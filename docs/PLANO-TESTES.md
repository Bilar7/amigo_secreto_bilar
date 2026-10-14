# Plano de testes antes da publicação

## Interface
- [ ] Abertura e navegação em 360 px, tablet e desktop.
- [ ] Saudação com o nome da conta ativa, sem nome fixo de demonstração.
- [ ] Criar grupo, entrar com código, abrir participantes.
- [ ] Sorteio: validar restrições e impedir revelar resultados de outras pessoas.
- [ ] Chat de grupo separado de chat privado anónimo.
- [ ] Lista de desejos: validar URLs e indicar claramente dados demonstrativos.
- [ ] Erros de rede: mostrar mensagem e opção de tentar novamente.

## Segurança / backend
- [ ] Definir autenticação real.
- [ ] Proibir leitura dos resultados atribuídos a outros participantes.
- [ ] Validar permissões de cada conversa no servidor.
- [ ] Testar regras com contas distintas e utilizadores não autenticados.
- [ ] Nunca remover regras de produção para resolver erros de interface.
