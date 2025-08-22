// Interações básicas da landing
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));

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

// Fake audio demo
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
        if (idx >= lines.length) { playBtn.disabled = false; playBtn.textContent = '▶ Ouvir Exemplo'; return; }
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
    playBtn.textContent = 'Reproduzindo...';
    addLine();
});

// Bloco de newsletter removido (form não está presente na página)

// Marquee usa apenas CSS; nenhuma manipulação de estilo inline necessária
