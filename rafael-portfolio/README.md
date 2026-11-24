# Rafael Palmiere — Portfólio

Portfólio acadêmico e pessoal desenvolvido do zero com HTML5, CSS3, JavaScript e Bootstrap 5. A direção visual usa como referência a estrutura de portfólio do tutorial do DevClub/Rodolfo Mori: navegação fixa, apresentação central com foto, fundo escuro, detalhes animados, cartões translúcidos, galeria de projetos e seção de contato. O conteúdo foi ampliado para cumprir a atividade do 4º bimestre.

## Abrir localmente

1. Extraia a pasta `rafael-portfolio`.
2. Para testar o formulário e as requisições externas, sirva a pasta por HTTP, por exemplo com `python -m http.server 8000`.
3. Abra `http://localhost:8000` no navegador.

## Estrutura

- `index.html` — conteúdo, navegação e estrutura semântica.
- `assets/style.css` — tema visual, cartões, animações e responsividade.
- `assets/script.js` — validação do formulário, integração de e-mail, LocalStorage e painel CRUD.
- `assets/profile.jpg` — fotografia de perfil fornecida.
- `assets/aizen-preview.jpg` — referência visual do projeto Aizen Store.
- `assets/programming-preview.svg` — prévia ilustrativa do repositório de estudos.
- `assets/confeitaria-preview.jpg` — captura de tela do sistema de estoque.
- `assets/confeitaria-demo.mp4` — demonstração em vídeo do sistema de estoque.

## Requisitos acadêmicos contemplados

- Apresentação pessoal, fotografia, perfil, hard skills e soft skills.
- Quatro áreas do conhecimento: Ciências Humanas, Ciências da Natureza, Matemática e Linguagens.
- Quatro tendências tecnológicas: Cibersegurança, Blockchain, Automação/Robótica e Edge Computing.
- Galeria com descrição, imagem de prévia e link externo por projeto.
- Formulário com validação, armazenamento JSON no LocalStorage e notificação por e-mail via serviço de automação.
- Painel administrativo oculto com operações de criar (formulário), ler, atualizar e excluir mensagens.
- Inicialização automática com 20 registros de teste quando a chave do LocalStorage ainda não existe (primeiro acesso).
- Layout responsivo com Bootstrap, CSS Grid e Flexbox.

## Configurar o envio real de e-mail

O formulário utiliza o serviço FormSubmit para encaminhar as mensagens para uma caixa de e-mail, sem precisar expor senha SMTP no navegador.

1. O endereço de recebimento já está configurado em `assets/script.js` (`CONTACT_EMAIL`) e no `action` do formulário em `index.html`. Para trocar o destinatário, atualize os dois locais com o mesmo endereço.
2. Publique/execute o site por HTTP/HTTPS e envie uma primeira mensagem de teste.
3. Abra o e-mail de confirmação enviado pelo FormSubmit para esse endereço e confirme a ativação do formulário. Depois dessa confirmação, os novos envios passam a ser encaminhados para a caixa configurada.

A mensagem é salva no LocalStorage antes da chamada externa. O painel informa separadamente se o e-mail foi enviado ou se houve falha. Se o serviço estiver indisponível ou o endereço ainda não tiver sido configurado, o registro local permanece salvo.

**Importante:** a integração está implementada no código, mas a entrega real depende da confirmação inicial do FormSubmit pelo dono da caixa de e-mail e de o serviço estar disponível. Não é possível concluir essa ativação apenas pelo código. O formulário informa quando o serviço aceita ou rejeita uma tentativa; faça um envio real de teste após publicar.

## Painel administrativo e CRUD

- Atalho: `Ctrl + Shift + A`.
- **Create:** novas mensagens entram pelo formulário de contato.
- **Read:** o painel lista as mensagens armazenadas.
- **Update:** use o botão “Editar” em uma mensagem.
- **Delete:** use o botão “Excluir”.
- **Seed de avaliação:** ao primeiro acesso, são inseridos 20 registros de demonstração; “Restaurar 20 registros de teste” repõe a base de avaliação.

As mensagens ficam no navegador atual e não são sincronizadas entre dispositivos, pois a atividade solicita LocalStorage em vez de banco de dados. Cada operação grava automaticamente o JSON no LocalStorage; não é necessário pressionar `Ctrl + S` para salvar os registros (esse atalho do navegador normalmente salva a página).

## Links de projetos

- Aizen Store: `https://github.com/Arkor9191/Aizen-Store`
- Atividades de TI: `https://github.com/Arkor9191/03TI-Atividades`
- Sistema de Organização Logística: `https://github.com/Arkor9191/OrganizacaoLogistica/tree/main`.
- Sistema de Estoque para Confeitaria: a demonstração em vídeo está incluída no projeto.

## Dependências externas

- Bootstrap 5.3.3 (CDN)
- Google Fonts — Poppins (CDN)
- FormSubmit (serviço de envio de formulários por e-mail)
