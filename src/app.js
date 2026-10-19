// Interações básicas da landing
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));

// Utilitário: envio seguro de eventos GA4
function gaEvent(name, params = {}) {
    if (name === 'contact_click') metaEvent('Contact', { content_category: params.channel, content_name: params.plan || params.source });
    try {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', name, params);
        }
    } catch (_) { /* noop */ }
}

// Pixel da Meta: clique para falar no WhatsApp/Telegram vira "Contact" (otimização de campanhas)
function metaEvent(name, params = {}) {
    try {
        if (typeof window.fbq === 'function') window.fbq('track', name, params);
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
        return 'Incluí os impostos que você informou nos totais. Quer ajustar algum valor?';
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
const WHATSAPP_NUMBER = '5531997204935';
const TELEGRAM_HANDLE = 'quantoaibot';

// Origem do visitante (UTM/clid) guardada na sessão e enviada ao bot como código "ref".
// Formato: <origem>_<plano>_<campanha>, só [A-Za-z0-9_-] (limite do start param do Telegram).
const SRC_MAP = { instagram: 'ig', ig: 'ig', facebook: 'fb', fb: 'fb', meta: 'fb', google: 'gg', tiktok: 'tt', youtube: 'yt', whatsapp: 'wa' };
function readOrigin() {
    try {
        const q = new URLSearchParams(location.search);
        const saved = JSON.parse(sessionStorage.getItem('qa_origin') || 'null');
        if (!q.get('utm_source') && !q.get('gclid') && !q.get('fbclid') && saved) return saved;
        let src = (q.get('utm_source') || '').toLowerCase();
        src = SRC_MAP[src] || src.replace(/[^a-z0-9]/g, '').slice(0, 6);
        if (!src) src = q.get('gclid') ? 'gg' : q.get('fbclid') ? 'fb' : (document.referrer && !document.referrer.includes(location.host) ? 'ref' : 'site');
        const campaign = (q.get('utm_campaign') || '').replace(/[^A-Za-z0-9-]/g, '').slice(0, 24);
        const origin = { src, campaign };
        sessionStorage.setItem('qa_origin', JSON.stringify(origin));
        return origin;
    } catch {
        return { src: 'site', campaign: '' };
    }
}
const ORIGIN = readOrigin();
const PLAN_CODE = { '24h': 'd1', '7d': 'd7', '30d': 'd30' };
function buildRef(plan) {
    return [ORIGIN.src, PLAN_CODE[plan] || 'x', ORIGIN.campaign].filter(Boolean).join('_').slice(0, 60);
}

function buildUtm(plan) {
    const p = plan || 'na';
    const ts = Date.now();
    return `utm_source=lp&utm_medium=modal&utm_campaign=signup&utm_content=${encodeURIComponent(p)}-${ts}`;
}

function buildWhatsAppUrl(plan) {
    const base = `https://wa.me/${WHATSAPP_NUMBER}`;
    const text = encodeURIComponent(`Olá! Quero usar o Quanto AI. (ref: ${buildRef(plan)})`);
    return `${base}?text=${text}`;
}

function openWhatsApp({ plan = 'na', source = 'unknown' } = {}) {
    gaEvent('contact_click', {
        channel: 'whatsapp',
        source,
        plan
    });
    const url = buildWhatsAppUrl(plan);
    window.open(url, '_blank', 'noopener');
}

chooseWhatsApp?.addEventListener('click', () => {
    openWhatsApp({ source: 'modal', plan: pendingPlan || 'na' });
    closeModal();
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
    const startParam = buildRef(pendingPlan);
    const url = `https://t.me/${TELEGRAM_HANDLE}?start=${startParam}`;
    // Anexar UTM ao referrer via hash (não padrão do Telegram, mas útil se abrirem no browser)
    const withUtm = `${url}#${utm}`;
    window.open(withUtm, '_blank', 'noopener');
    closeModal();
});

// GA: cliques diretos nos cards de canais (seção "Canais de Acesso")
document.querySelectorAll('a[href^="https://t.me/"]').forEach(a => {
    // links diretos para o bot também levam a origem
    a.href = `${a.href.split('?')[0]}?start=${buildRef(null)}`;
    a.addEventListener('click', () => {
        gaEvent('contact_click', {
            channel: 'telegram',
            source: 'channels_section',
            intent: a.href.includes('?start=') ? 'start_bot' : 'view_bot',
            link_text: (a.textContent || '').trim().slice(0, 100)
        });
    });
});

document.querySelectorAll('[data-whatsapp-link]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const plan = link.getAttribute('data-plan') || 'na';
        const source = link.getAttribute('data-source') || 'channels_section';
        openWhatsApp({ plan, source });
    });
});
