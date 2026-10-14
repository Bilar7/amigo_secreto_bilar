import { firebaseConfig } from './firebase';

const endpoint = (method: string) => `https://identitytoolkit.googleapis.com/v1/accounts:${method}?key=${firebaseConfig.apiKey}`;
const resetEndpoint = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${firebaseConfig.apiKey}`;

type FirebaseAuthResponse = { localId: string; email: string; displayName?: string; idToken: string; refreshToken: string; expiresIn: string };

async function request<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) {
    const code = data?.error?.message || 'UNKNOWN_ERROR';
    const messages: Record<string, string> = {
      EMAIL_EXISTS: 'Este email já tem uma conta. Entre na sua conta.',
      EMAIL_NOT_FOUND: 'Não existe uma conta com este email.',
      INVALID_PASSWORD: 'A palavra-passe está incorreta.',
      INVALID_LOGIN_CREDENTIALS: 'Email ou palavra-passe incorretos.',
      WEAK_PASSWORD: 'Escolha uma palavra-passe com pelo menos 6 caracteres.',
      USER_DISABLED: 'Esta conta está desativada.',
      TOO_MANY_ATTEMPTS_TRY_LATER: 'Muitas tentativas. Tente novamente mais tarde.',
      OPERATION_NOT_ALLOWED: 'Ative Email/Palavra-passe em Firebase Console → Authentication → Sign-in method.',
      INVALID_EMAIL: 'Introduza um endereço de email válido.'
    };
    throw new Error(messages[code] || `Não foi possível autenticar (${code}). Verifique a configuração do Firebase.`);
  }
  return data as T;
}

function persistSession(auth: FirebaseAuthResponse, fallbackName = '') {
  const user = {
    id: auth.localId,
    name: auth.displayName || fallbackName || auth.email.split('@')[0],
    email: auth.email,
    avatar: '',
    isOnline: true,
    role: 'member' as const
  };
  localStorage.setItem('bilar_user', JSON.stringify(user));
  // Tokens are stored separately for future authenticated API calls; never log them.
  localStorage.setItem('bilar_auth_session', JSON.stringify({ idToken: auth.idToken, refreshToken: auth.refreshToken, expiresAt: Date.now() + Number(auth.expiresIn) * 1000 }));
  return user;
}

export const firebaseAuthService = {
  async signUp(email: string, password: string, name: string) {
    const auth = await request<FirebaseAuthResponse>(endpoint('signUp'), { email: email.trim(), password, returnSecureToken: true });
    try {
      await request(endpoint('update'), { idToken: auth.idToken, displayName: name.trim(), returnSecureToken: true });
    } catch { /* Authentication succeeds even if optional display-name update fails. */ }
    return persistSession({ ...auth, displayName: name.trim() }, name.trim());
  },
  async signIn(email: string, password: string) {
    const auth = await request<FirebaseAuthResponse>(endpoint('signInWithPassword'), { email: email.trim(), password, returnSecureToken: true });
    return persistSession(auth);
  },
  async sendPasswordReset(email: string) {
    await request(resetEndpoint, { requestType: 'PASSWORD_RESET', email: email.trim() });
  },
  signOut() {
    localStorage.removeItem('bilar_user');
    localStorage.removeItem('bilar_auth_session');
  }
};
