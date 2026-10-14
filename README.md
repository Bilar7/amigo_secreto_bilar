# Bilar Amigo Secreto 🎁

Plataforma completa para organização de Amigo Secreto em qualquer ocasião — desenvolvida oficialmente pela **Bilar DigitalTech Solutions**.

---

## 🌟 Principais Recursos

- **Multi-Ocasião e Inclusivo:** Suporte completo para Aniversários, Confraternizações de Empresas, Grupos de Amigos, Família e Festas Sazonais.
- **Sorteio Seguro com Ciclo Fechado:** Algoritmo estrito de derangement que garante sigilo absoluto e impede que qualquer participante tire a si próprio.
- **Bilar Conversas (Chat estilo WhatsApp):**
  - **Modo Claro:** Cores oficiais do WhatsApp (`#008069`, `#efeae2`, balões enviados em `#d9fdd3` com texto preto `#111b21`, balões recebidos em branco `#ffffff` e tiques azuis).
  - **Modo Escuro:** Cores de WhatsApp Dark (`#202c33`, `#0b141a`, balões em `#005c4b`).
  - **Modo Anônimo:** Envio de pistas sem revelar o nome do remetente.
- **Listas de Desejos:** Adicione itens com fotografias, lojas (Amazon, Wook, Jumia, AliExpress) e preços em Meticais (MZN).
- **Partilha de Convites no WhatsApp:** Geração automática de mensagem formatada com código de entrada e link direto (`?join=CODIGO`).
- **Instalável no Celular (PWA):** Suporte completo a Progressive Web App com `manifest.json`, ícone SVG e banner de instalação em 1 toque (Android e iOS Safari).
- **Backend Firebase Conectado:** Configurado diretamente com o seu projeto `jfb-amigo-secreto-pro-2026` (Plano Gratuito Spark) com sincronização em nuvem e persistência local.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js** (versão 18 ou superior): [https://nodejs.org/](https://nodejs.org/)

### Passos Rápidos

1. Extraia o ficheiro ZIP para uma pasta no seu computador.
2. No Windows, clique duas vezes em `INICIAR-LOCAL.bat` (ele instala as dependências e inicia automaticamente).
3. Ou no terminal / VS Code:
   ```bash
   npm install
   npm run dev
   ```
4. Abra o endereço no navegador: `http://127.0.0.1:5173/`.

---

## 🔥 Regras do Firebase (Plano Gratuito Spark)

As chaves do seu projeto `jfb-amigo-secreto-pro-2026` já estão configuradas no código e no ficheiro `.env`.

### Como ativar as Regras no Console do Firebase:

1. Aceda ao console do Firebase: [https://console.firebase.google.com/project/jfb-amigo-secreto-pro-2026/firestore/rules](https://console.firebase.google.com/project/jfb-amigo-secreto-pro-2026/firestore/rules)
2. Se ainda não ativou o Firestore, clique em **Criar banco de dados** e escolha a localização mais próxima.
3. Clique na aba **Regras** (Rules).
4. Substitua o conteúdo existente pelas regras oficiais presentes no ficheiro `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Grupos de Amigo Secreto: leitura e escrita abertas para os participantes com código
    match /groups/{groupId} {
      allow read, write: if true;
      match /members/{memberId} {
        allow read, write: if true;
      }
    }
    // Mensagens do Chat Anônimo e de Grupo
    match /messages/{messageId} {
      allow read, write: if true;
    }
    // Listas de Desejos
    match /wishlists/{wishlistId} {
      allow read, write: if true;
    }
    // Notificações do Sistema
    match /notifications/{notifId} {
      allow read, write: if true;
    }
  }
}
```

5. Clique no botão **Publicar** (Publish). Pronto! O seu banco de dados na nuvem está 100% ativo no plano gratuito Spark sem custos.

---

## 📦 Como Publicar no GitHub e Hospedar

### 1. Subir o Código para o GitHub

No terminal da pasta do projeto:

```bash
git init
git add .
git commit -m "feat: Versão Oficial Bilar Amigo Secreto"
git branch -M main
git remote add origin https://github.com/SEU_UTILIZADOR/bilar-amigo-secreto.git
git push -u origin main
```

### 2. Opções Gratuitas de Hospedagem (Prontas para Produção)

- **Vercel (Recomendado - 1 Clique):**
  1. Aceda a [https://vercel.com/](https://vercel.com/) e entre com a sua conta GitHub.
  2. Clique em **Add New Project** e selecione o repositório `bilar-amigo-secreto`.
  3. Clique em **Deploy**. Em 30 segundos terá o seu link oficial ativo (`https://bilar-amigo-secreto.vercel.app`) com HTTPS e PWA!

- **Netlify:**
  1. Aceda a [https://netlify.com/](https://netlify.com/).
  2. Importe o repositório do GitHub.
  3. Build command: `npm run build` | Publish directory: `dist`. Clique em Deploy.

- **GitHub Pages:**
  1. No `package.json`, adicione `"deploy": "vite build && gh-pages -d dist"`.
  2. Como configuramos `base: './'` no `vite.config.ts`, todos os ficheiros carregarão perfeitamente no GitHub Pages.

---

## 📱 Instalação no Celular (PWA)

- **Android (Chrome / Edge):** Toque no botão *"Instalar no Celular"* que surge na barra inferior da aplicação.
- **iPhone / iPad (Safari):** Toque no botão de *Partilhar* (quadrado com seta para cima) e selecione *"Adicionar ao Ecrã Principal"*.

---

© 2026 **Bilar DigitalTech Solutions** • Todos os direitos reservados.

## Publicação e instalação (PWA)

- O workflow `.github/workflows/deploy.yml` constrói a aplicação e publica `dist` no GitHub Pages.
- No GitHub, abra **Settings → Pages → Build and deployment → GitHub Actions**. Envie os ficheiros para a branch `main` e acompanhe o workflow em **Actions**.
- Teste localmente com `npm install`, `npm run dev` e valide a compilação com `npm run build`.
- Android/Chrome: use **Instalar aplicação** no menu do navegador. iPhone/iPad: **Partilhar → Adicionar ao ecrã principal**.

## Firebase e segurança antes de produção

A configuração do cliente foi alinhada ao projeto Firebase indicado pelo proprietário. O chat aceita anexos pequenos (até 350 KB) como dados incorporados; para anexos maiores e uso intenso, migre para Firebase Storage. A `apiKey` web identifica o projeto, mas não substitui autenticação nem regras de segurança. As regras Firestore atuais permitem acesso aberto; não as publique assim com dados reais. Antes de produção, configure Firebase Authentication, regras por utilizador/grupo e Firebase Storage para anexos. Gravação de voz exige HTTPS (ou localhost) e permissão do microfone.


## Notas desta revisão visual e de privacidade

- Ecrãs de grupos e sorteio usam fotografia de presentes como fundo, com menos elementos decorativos artificiais.
- O ecrã do sorteio deixou de apresentar a lista completa de nomes dos membros.
- A interface filtra grupos carregados para mostrar apenas grupos em que o utilizador local é organizador ou membro. Isto é um filtro de interface; não é uma barreira de segurança de servidor.
- O ficheiro `firestore.rules` nega acesso público até à implementação de Firebase Authentication e autorização por grupo.
- A compilação de produção ainda precisa de ser executada no computador de desenvolvimento com `npm install` e `npm run build`.


## Revisão de autenticação (outubro de 2026)

Os formulários de entrada e registo usam agora os endpoints oficiais de Firebase Authentication para criar contas com email/palavra-passe, iniciar sessão e pedir recuperação de palavra-passe. O botão de acesso fictício apenas com nome foi removido. O Firebase Console tem de ter o método **Email/Password** ativado em Authentication → Sign-in method. A chave Web do Firebase é uma configuração pública do cliente, não um segredo de servidor.

**Limitação importante antes de produção:** os grupos, chats e lista de desejos ainda têm partes que usam `localStorage` e a integração antiga Firestore REST não envia o token Firebase. As regras em `firestore.rules` negam deliberadamente todo o acesso até o modelo de documentos e as regras de pertença serem implementados e testados. Portanto, o login é real, mas ainda não se deve anunciar sincronização de grupos/chats entre dispositivos como concluída. Não abrir as regras Firestore publicamente para contornar esta limitação.

Para publicar: configure GitHub Pages → GitHub Actions e envie para `main`. O workflow compila e publica a interface; a compilação deve passar antes de a publicação ser considerada validada.

## Publicar na Vercel sem carregar ficheiros um a um

1. Envie este projeto para um repositório GitHub usando GitHub Desktop ou Git no terminal. Não envie `node_modules` nem `dist`.
2. Na Vercel, escolha **Add New → Project → Import Git Repository** e selecione o repositório.
3. Framework Preset: **Vite**. Build Command: `npm run build`. Output Directory: `dist`.
4. Clique **Deploy**. O ficheiro `vercel.json` já define estes valores e o fallback para rotas da aplicação.

## Publicar no GitHub usando Git (Windows PowerShell)

Abra o terminal dentro desta pasta e execute:

```powershell
git init
git add .
git commit -m "Preparar Bilar Amigo Secreto para publicação"
git branch -M main
git remote add origin https://github.com/SEU-UTILIZADOR/SEU-REPOSITORIO.git
git push -u origin main
```

Substitua o URL de exemplo pelo URL real do seu repositório. Se o repositório já estiver ligado a outro remoto, não execute `git remote add origin` novamente; verifique `git remote -v` primeiro.
