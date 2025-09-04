// Interações básicas da landing
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));

// Utilitário: envio seguro de eventos GA4
function gaEvent(name, params = {}) {
    try {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', name, params);
        }
    } catch (_) { /* noop */ }
}

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(i => {
    const btn = i.querySelector('.faq-q');
    btn.addEventListener('click', () => {
        i.classList.toggle('open');
    });
});

// Demo chat simples (mock)
const demoChat = document.getElementById('demo-chat');
const demoInput = document.getElementById('demoInput');
const demoSend = document.getElementById('demoSend');
const demoReset = document.getElementById('demoReset');

const seed = [
    { role: 'bot', text: 'Olá! Descreva o que você quer orçar.' }
];
let convo = [...seed];

function renderChat() {
    if (!demoChat) return; // evita erro quando a demo não está presente
    demoChat.innerHTML = '';
    convo.forEach(m => {
        const div = document.createElement('div');
        div.className = 'line ' + (m.role === 'user' ? 'user' : 'bot');
        div.textContent = m.text;
        demoChat.appendChild(div);
    });
    demoChat.scrollTop = demoChat.scrollHeight;
}
renderChat();

function botRespond(userText) {
    // Regras simples para demonstrar refinamento
    const lower = userText.toLowerCase();
    if (/(preco|preço|quanto|valor).*(suger|médio|medio)/.test(lower)) {
        return 'Sugestão: faixa de R$ 4.000 - 4.800 considerando complexidade padrão. Ajustar margens?';
    }
    if (/(adiciona|inclui|add).*(suporte|manuten)/.test(lower)) {
        return 'Adicionei linha de suporte mensal com valor estimado. Algo mais?';
    }
    if (/prazo|entrega/.test(lower)) {
        return 'Defini prazo padrão de 10 dias úteis. Deseja alterar valores ou condições de pagamento?';
    }
    if (/desconto/.test(lower)) {
        return 'Apliquei desconto de 5% sobre o total. Ajustar porcentagem?';
    }
    if (/imposto|taxa|icms|iss/.test(lower)) {
        return 'Calculei impostos conforme configuração padrão (ISS 3%). Quer modificar a alíquota?';
    }
    if (/pdf|finaliza|gerar/.test(lower)) {
        return 'Gerando PDF com itens, totais e condições... pronto! (Simulação)';
    }
    return 'Entendi. Posso detalhar pacotes, margens ou gerar o PDF. O que prefere em seguida?';
}

demoSend?.addEventListener('click', () => {
    const text = demoInput.value.trim();
    if (!text) return;
    convo.push({ role: 'user', text });
    renderChat();
    setTimeout(() => {
        convo.push({ role: 'bot', text: botRespond(text) });
        renderChat();
    }, 400);
    demoInput.value = '';
    demoInput.focus();
});

demoInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') demoSend.click();
});

demoReset?.addEventListener('click', () => {
    convo = [...seed];
    renderChat();
});

// Simulação de conversa (sem áudio)
const playBtn = document.getElementById('play-audio-demo');
playBtn?.addEventListener('click', () => {
    playBtn.disabled = true;
    const lines = [
        'Gerar orçamento para desenvolvimento de aplicativo mobile com backend e manutenção de 6 meses.',
        'Adicionar opção com dashboard web e suporte prioritário.',
        'Gerar PDF com duas opções e condições de pagamento em 3 parcelas.'
    ];
    let idx = 0;
    const chatWindow = document.getElementById('chat-window');
    function addLine() {
        if (idx >= lines.length) { playBtn.disabled = false; playBtn.textContent = '▶ Simular conversa'; return; }
        const div = document.createElement('div');
        div.className = 'msg user';
        div.textContent = lines[idx];
        chatWindow.appendChild(div);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        if (idx === lines.length - 1) {
            const botDiv = document.createElement('div');
            botDiv.className = 'msg bot emph';
            botDiv.textContent = 'PDF atualizado gerado (simulação).';
            setTimeout(() => { chatWindow.appendChild(botDiv); chatWindow.scrollTop = chatWindow.scrollHeight; }, 500);
        }
        idx++;
        setTimeout(addLine, 1400);
    }
    playBtn.textContent = 'Simulando...';
    addLine();
});

// Bloco de newsletter removido (form não está presente na página)

// Marquee usa apenas CSS; nenhuma manipulação de estilo inline necessária

// Modal de seleção de canal (WhatsApp/Telegram)
const channelModal = document.getElementById('channelModal');
const closeChannelModal = document.getElementById('closeChannelModal');
const chooseWhatsApp = document.getElementById('chooseWhatsApp');
const chooseTelegram = document.getElementById('chooseTelegram');
let pendingPlan = null; // '24h' | '7d' | '30d'

function openChannelModal(plan) {
    pendingPlan = plan || null;
    channelModal?.classList.add('open');
    channelModal?.setAttribute('aria-hidden', 'false');
    // focus trap básico
    setTimeout(() => closeChannelModal?.focus(), 10);
}
function closeModal() {
    channelModal?.classList.remove('open');
    channelModal?.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.open-subscribe').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const plan = btn.getAttribute('data-plan');
        openChannelModal(plan);
    });
});

closeChannelModal?.addEventListener('click', closeModal);
channelModal?.addEventListener('click', (e) => {
    if (e.target && (e.target.matches('[data-close-modal]') || e.target === channelModal)) {
        closeModal();
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && channelModal?.classList.contains('open')) closeModal();
});

// Redirecionamentos dos canais
// WhatsApp temporariamente indisponível
const WHATSAPP_NUMBER = null; // em breve
const TELEGRAM_HANDLE = 'quantoaibot';

function buildUtm(plan) {
    const p = plan || 'na';
    const ts = Date.now();
    return `utm_source=lp&utm_medium=modal&utm_campaign=signup&utm_content=${encodeURIComponent(p)}-${ts}`;
}

// Desativado: manter handler vazio por acessibilidade caso o botão seja habilitado no futuro
chooseWhatsApp?.addEventListener('click', (e) => {
    e.preventDefault();
    // opcional: feedback visual no futuro
});

chooseTelegram?.addEventListener('click', () => {
    // GA: clique para Telegram via modal
    gaEvent('contact_click', {
        channel: 'telegram',
        source: 'modal',
        plan: pendingPlan || 'na'
    });
    const utm = buildUtm(pendingPlan);
    // Telegram deep link with start param
    const startParam = encodeURIComponent(`from=lp&plan=${pendingPlan || 'na'}`);
    const url = `https://t.me/${TELEGRAM_HANDLE}?start=${startParam}`;
    // Anexar UTM ao referrer via hash (não padrão do Telegram, mas útil se abrirem no browser)
    const withUtm = `${url}#${utm}`;
    window.open(withUtm, '_blank', 'noopener');
    closeModal();
});

// GA: cliques diretos nos cards de canais (seção "Canais de Acesso")
// Não há links de WhatsApp ativos no momento

document.querySelectorAll('a[href^="https://t.me/"]').forEach(a => {
    a.addEventListener('click', () => {
        gaEvent('contact_click', {
            channel: 'telegram',
            source: 'channels_section',
            intent: a.href.includes('?start=') ? 'start_bot' : 'view_bot',
            link_text: (a.textContent || '').trim().slice(0, 100)
        });
    });
});
