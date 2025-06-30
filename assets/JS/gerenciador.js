// ========================================
// 1) Carrega dados do localStorage (ou inicializa)
// ========================================
function carregarDadosLocalStorage() {
  // --------- Fila de senhas (waiting list) ---------
  let filaSenhas = [];
  try {
    const filaBruta = localStorage.getItem("filaSenhas");
    filaSenhas = JSON.parse(filaBruta) || [];
    if (!Array.isArray(filaSenhas)) filaSenhas = [];
    if (!filaBruta) {
      localStorage.setItem("filaSenhas", JSON.stringify(filaSenhas));
    }
  } catch {
    filaSenhas = [];
    localStorage.setItem("filaSenhas", JSON.stringify([]));
  }

  // --------- Senhas já atendidas ---------
  let senhasAtendidas = [];
  try {
    const atendidasBruto = localStorage.getItem("senhasAtendidas");
    senhasAtendidas = JSON.parse(atendidasBruto) || [];
    if (!Array.isArray(senhasAtendidas)) senhasAtendidas = [];
    if (!atendidasBruto) {
      localStorage.setItem("senhasAtendidas", JSON.stringify(senhasAtendidas));
    }
  } catch {
    senhasAtendidas = [];
    localStorage.setItem("senhasAtendidas", JSON.stringify([]));
  }

  // --------- Última senha chamada ---------
  const ultimaSenhaChamou = localStorage.getItem("ultimaSenha") || "";

  return {
    filaSenhas,
    senhasAtendidas,
    ultimaSenhaChamou,
  };
}

// ========================================
// 2) Renderiza a interface do painel
// ========================================
function renderizarPainel() {
  const { filaSenhas, senhasAtendidas, ultimaSenhaChamou } = carregarDadosLocalStorage();

  // 2.1) Atualiza a senha atual com animação
  const campoSenhaAtual = document.getElementById("senhaAtual");
  if (campoSenhaAtual) {
    campoSenhaAtual.textContent = ultimaSenhaChamou || "—";
    campoSenhaAtual.classList.add("pulse");
    setTimeout(() => campoSenhaAtual.classList.remove("pulse"), 500);
  }

  // 2.2) Preenche a lista de senhas em espera
  const listaEsperaEl = document.getElementById("senhasEspera");
  if (listaEsperaEl) {
    listaEsperaEl.innerHTML = filaSenhas.length === 0 ? 
      '<li class="vazio">(nenhuma senha em espera)</li>' : 
      filaSenhas.map(senha => `<li>${senha}</li>`).join('');
  }

  // 2.3) Preenche a lista de senhas atendidas (mantém apenas 3)
  const listaAtendidasEl = document.getElementById("senhasAtendidas");
  if (listaAtendidasEl) {
    const ultimas3Senhas = senhasAtendidas.slice(-3);
    listaAtendidasEl.innerHTML = ultimas3Senhas.length === 0 ? 
      '<li class="vazio">(nenhuma senha atendida ainda)</li>' : 
      ultimas3Senhas.map(senha => `<li>${senha}</li>`).join('');
  }
}

// ========================================
// 3) Chamar a próxima senha da fila (FIFO)
// ========================================
function chamarProximaSenha() {
  const { filaSenhas, senhasAtendidas } = carregarDadosLocalStorage();

  if (filaSenhas.length === 0) {
    alert("Não há senhas em espera para chamar.");
    return;
  }

  const proxima = filaSenhas.shift(); // FIFO
  localStorage.setItem("ultimaSenha", proxima);

  // Mantém apenas as 3 últimas senhas atendidas
  const novasSenhasAtendidas = [...senhasAtendidas, proxima].slice(-3);
  
  localStorage.setItem("senhasAtendidas", JSON.stringify(novasSenhasAtendidas));
  localStorage.setItem("filaSenhas", JSON.stringify(filaSenhas));

  renderizarPainel();
}

// ========================================
// 4) Resetar todos os dados
// ========================================
function resetarTudo() {
  if (confirm("Tem certeza que deseja resetar todas as senhas?")) {
    localStorage.removeItem("filaSenhas");
    localStorage.removeItem("senhasAtendidas");
    localStorage.removeItem("ultimaSenha");
    renderizarPainel();
  }
}

// ========================================
// 5) Configura atualização automática
// ========================================
function configurarAtualizacaoAutomatica() {
  // Atualiza quando houver mudanças no localStorage (entre abas)
  window.addEventListener('storage', (event) => {
    if (event.key === "ultimaSenha" || event.key === "filaSenhas" || event.key === "senhasAtendidas") {
      renderizarPainel();
    }
  });

  // Atualiza periodicamente (para mesma aba)
  setInterval(renderizarPainel, 2000);
}

// ========================================
// 6) Inicialização dos botões e painel
// ========================================
function iniciarGerenciador() {
  const btnChamar = document.getElementById("btnChamarProxima");
  if (btnChamar) btnChamar.addEventListener("click", chamarProximaSenha);

  const btnReset = document.getElementById("btnResetar");
  if (btnReset) btnReset.addEventListener("click", resetarTudo);

  renderizarPainel();
  configurarAtualizacaoAutomatica();
}

// ========================================
// 7) Inicia ao carregar o DOM
// ========================================
window.addEventListener("DOMContentLoaded", iniciarGerenciador);

// ========================================
// Painel de Controle de Vídeos
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-video-btn');
    const urlInput = document.getElementById('video-url-input');
    const videoListUl = document.getElementById('video-list');
    const prevBtn = document.getElementById('ante-video-btn');
    const nextBtn = document.getElementById('prox-video-btn');
    
    const listKey = 'videoCarrosselList';
    const indexKey = 'videoCarrosselIndex';

    // Função para renderizar a lista de vídeos
    const renderControlList = () => {
        const videos = JSON.parse(localStorage.getItem(listKey)) || [];
        videoListUl.innerHTML = videos.length === 0 ? 
            '<li>Nenhum vídeo na lista.</li>' : 
            videos.map((url, index) => `
                <li>
                    <span>${url}</span>
                    <button class="remove-btn" onclick="removeVideo(${index})">Remover</button>
                </li>
            `).join('');
    };

    // Função para adicionar um vídeo
    const addVideo = () => {
        const newUrl = urlInput.value.trim();
        if (newUrl) {
            const videos = JSON.parse(localStorage.getItem(listKey)) || [];
            videos.push(newUrl);
            localStorage.setItem(listKey, JSON.stringify(videos));
            urlInput.value = '';
            renderControlList();
        }
    };

    // Função para remover um vídeo (deve ser global para o onclick)
    window.removeVideo = (indexToRemove) => {
        const videos = JSON.parse(localStorage.getItem(listKey)) || [];
        videos.splice(indexToRemove, 1);
        localStorage.setItem(listKey, JSON.stringify(videos));
        localStorage.setItem(indexKey, '0');
        renderControlList();
    };

    // Função para navegar entre vídeos
    const navigate = (direction) => {
        const videos = JSON.parse(localStorage.getItem(listKey)) || [];
        if (videos.length < 2) return;

        let currentIndex = parseInt(localStorage.getItem(indexKey)) || 0;
        currentIndex = direction === 'prox' ? 
            (currentIndex + 1) % videos.length : 
            (currentIndex - 1 + videos.length) % videos.length;

        localStorage.setItem(indexKey, currentIndex);
    };

    // Event listeners
    addBtn.addEventListener('click', addVideo);
    urlInput.addEventListener('keypress', (e) => e.key === 'Enter' && addVideo());
    prevBtn.addEventListener('click', () => navigate('ante'));
    nextBtn.addEventListener('click', () => navigate('prox'));

    renderControlList();
});