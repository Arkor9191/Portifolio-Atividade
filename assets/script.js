const STORAGE_KEY = 'rafaelPortfolioMessages';


const CONTACT_EMAIL = 'rafaelpalmiere03@gmail.com';
const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/';

const seedMessages = Array.from({ length: 20 }, (_, index) => ({
  id: `demo-${index + 1}`,
  name: ['Neymar JR', 'Messi', 'Mbappe', 'Charles Leclerc'][index % 4],
  email: `visitor${index + 1}@example.com`,
  subject: ['Feedback sobre o portfólio', 'Possível colaboração', 'Dúvida sobre Front-end', 'Oportunidade de estágio'][index % 4],
  message: `Esta é a mensagem de teste número ${index + 1}, criada automaticamente para a avaliação do portfólio. Você pode editar ou excluir este registro no painel administrativo.`,
  date: new Date(Date.now() - index * 86400000).toISOString(),
  demo: true
}));

function readMessages() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    console.error('Não foi possível ler as mensagens do LocalStorage:', error);
    return [];
  }
}

function writeMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    return true;
  } catch (error) {
    console.error('Não foi possível salvar as mensagens:', error);
    return false;
  }
}

// Primeiro acesso: cria automaticamente 20 registros para a avaliação do CRUD.
if (localStorage.getItem(STORAGE_KEY) === null) {
  writeMessages(seedMessages);
}

document.getElementById('year').textContent = new Date().getFullYear();

// Navegação por âncoras: fecha o menu mobile após selecionar uma seção.
const primaryNavigation = document.getElementById('primaryNavigation');
document.querySelectorAll('.site-header .nav-link, .site-header .wordmark').forEach((link) => {
  link.addEventListener('click', () => {
    if (window.bootstrap?.Collapse && primaryNavigation?.classList.contains('show')) {
      window.bootstrap.Collapse.getOrCreateInstance(primaryNavigation).hide();
    }
  });
});

// Indica visualmente a seção atualmente selecionada na navegação.
const sectionLinks = [...document.querySelectorAll('.site-header .nav-link')];
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    });
  }, { rootMargin: '-25% 0px -60% 0px' });
  observedSections.forEach((section) => sectionObserver.observe(section));
}


const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitButton = document.getElementById('submitButton');

function setFormStatus(message, state = '') {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.dataset.state = state;
}

async function sendEmailNotification(data) {
  if (!CONTACT_EMAIL || CONTACT_EMAIL === 'SEU_EMAIL_AQUI' || !CONTACT_EMAIL.includes('@')) {
    throw new Error('O e-mail de destino ainda não foi configurado em assets/script.js.');
  }

  const endpoint = `${FORMSUBMIT_ENDPOINT}${encodeURIComponent(CONTACT_EMAIL)}`;
  const payload = {
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
    _subject: `Novo contato pelo portfólio — ${data.subject}`,
    _replyto: data.email,
    _template: 'table',
    _honey: data._honey || ''
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error('O serviço de e-mail retornou uma resposta inválida.');
  }

  const accepted = result.success === true || result.success === 'true' || result.success === 'True';
  if (!response.ok || (result.success !== undefined && !accepted)) {
    throw new Error(result.message || 'O serviço não conseguiu encaminhar o e-mail.');
  }
  return result;
}

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const formData = Object.fromEntries(new FormData(contactForm).entries());
  ['name', 'email', 'subject', 'message'].forEach((field) => {
    formData[field] = (formData[field] || '').trim();
  });
  // Campo honeypot preenchido indica possível envio automatizado.
  if (formData._honey) {
    setFormStatus('Não foi possível validar o envio.', 'error');
    return;
  }

  const messageRecord = {
    id: window.crypto?.randomUUID?.() || `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: formData.name.trim(),
    email: formData.email.trim(),
    subject: formData.subject.trim(),
    message: formData.message.trim(),
    date: new Date().toISOString(),
    demo: false,
    emailStatus: 'pending'
  };

  const messages = readMessages();
  messages.unshift(messageRecord);
  if (!writeMessages(messages)) {
    setFormStatus('O navegador não conseguiu salvar a mensagem. Verifique o armazenamento local.', 'error');
    return;
  }

  submitButton.disabled = true;
  submitButton.classList.add('is-loading');
  setFormStatus('Salvando e enviando sua mensagem…', 'pending');

  try {
    await sendEmailNotification(formData);
    messageRecord.emailStatus = 'sent';
    writeMessages(readMessages().map((message) => message.id === messageRecord.id ? messageRecord : message));
    setFormStatus('Mensagem enviada com sucesso. Obrigado pelo contato!', 'success');
    contactForm.reset();
  } catch (error) {
    console.error('Falha na notificação por e-mail:', error);
    messageRecord.emailStatus = 'failed';
    writeMessages(readMessages().map((message) => message.id === messageRecord.id ? messageRecord : message));
    setFormStatus(`Mensagem salva neste navegador, mas o e-mail não foi enviado. ${error.message}`, 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.classList.remove('is-loading');
  }
});

// Painel administrativo oculto: Ctrl + Shift + A.
const adminPanel = document.getElementById('adminPanel');
const adminBackdrop = document.getElementById('adminBackdrop');
const messagesList = document.getElementById('messagesList');
const messageCount = document.getElementById('messageCount');

function createTextElement(tagName, className, content) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = content;
  return element;
}

function openAdmin() {
  adminPanel.classList.add('open');
  adminBackdrop.classList.add('open');
  adminPanel.setAttribute('aria-hidden', 'false');
  document.body.classList.add('admin-open');
  renderMessages();
  document.getElementById('closeAdmin').focus();
}

function closeAdmin() {
  adminPanel.classList.remove('open');
  adminBackdrop.classList.remove('open');
  adminPanel.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('admin-open');
}

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'a') {
    event.preventDefault();
    openAdmin();
  }
  if (event.key === 'Escape') closeAdmin();
});

document.getElementById('closeAdmin').addEventListener('click', closeAdmin);
adminBackdrop.addEventListener('click', closeAdmin);

document.getElementById('resetSeed').addEventListener('click', () => {
  if (window.confirm('Substituir todas as mensagens por 20 registros de teste?')) {
    writeMessages(seedMessages);
    renderMessages();
  }
});

function renderMessages() {
  const messages = readMessages();
  messageCount.textContent = `${messages.length} ${messages.length === 1 ? 'mensagem' : 'mensagens'}`;
  messagesList.replaceChildren();

  if (!messages.length) {
    messagesList.append(createTextElement('p', 'admin-empty', 'Nenhuma mensagem encontrada.'));
    return;
  }

  messages.forEach((message) => {
    const card = document.createElement('article');
    card.className = 'message-item';

    const title = createTextElement('h3', 'message-title', `${message.name} — ${message.subject}`);
    const metadata = createTextElement('p', 'message-meta', `${message.email} · ${new Date(message.date).toLocaleString('pt-BR')}`);
    const body = createTextElement('p', 'message-body', message.message);
    const status = createTextElement('span', `message-status status-${message.emailStatus || 'demo'}`,
      message.demo ? 'Registro de teste' : message.emailStatus === 'sent' ? 'E-mail enviado' : message.emailStatus === 'failed' ? 'Falha no e-mail' : 'Aguardando envio');
    const actions = document.createElement('div');
    actions.className = 'message-actions';

    const editButton = createTextElement('button', 'admin-action edit-action', 'Editar');
    editButton.type = 'button';
    editButton.addEventListener('click', () => showEditForm(card, message));

    const deleteButton = createTextElement('button', 'admin-action delete-action', 'Excluir');
    deleteButton.type = 'button';
    deleteButton.addEventListener('click', () => {
      if (window.confirm(`Excluir a mensagem de ${message.name}?`)) {
        writeMessages(readMessages().filter((item) => item.id !== message.id));
        renderMessages();
      }
    });

    actions.append(editButton, deleteButton);
    card.append(title, metadata, status, body, actions);
    messagesList.append(card);
  });
}

function showEditForm(card, message) {
  if (card.querySelector('.edit-message-form')) return;

  const editForm = document.createElement('form');
  editForm.className = 'edit-message-form';
  const fields = [
    { name: 'name', label: 'Nome', value: message.name, type: 'text' },
    { name: 'email', label: 'E-mail', value: message.email, type: 'email' },
    { name: 'subject', label: 'Assunto', value: message.subject, type: 'text' },
    { name: 'message', label: 'Mensagem', value: message.message, type: 'textarea' }
  ];

  fields.forEach((field) => {
    const label = createTextElement('label', '', field.label);
    let input;
    if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 3;
    } else {
      input = document.createElement('input');
      input.type = field.type;
    }
    input.name = field.name;
    input.value = field.value;
    input.required = true;
    label.append(input);
    editForm.append(label);
  });

  const saveButton = createTextElement('button', 'admin-action save-action', 'Salvar alterações');
  saveButton.type = 'submit';
  editForm.append(saveButton);
  editForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!editForm.reportValidity()) return;
    const updated = Object.fromEntries(new FormData(editForm).entries());
    const nextMessages = readMessages().map((item) => item.id === message.id ? { ...item, ...updated } : item);
    writeMessages(nextMessages);
    renderMessages();
  });
  card.append(editForm);
}
