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

  // 2.1) Atualiza a senha atual
  const campoSenhaAtual = document.getElementById("senhaAtual");
  if (campoSenhaAtual) {
    campoSenhaAtual.textContent = ultimaSenhaChamou || "—";
  }

  // 2.2) Preenche a lista de senhas em espera
  const listaEsperaEl = document.getElementById("senhasEspera");
  if (listaEsperaEl) {
    listaEsperaEl.innerHTML = "";

    if (filaSenhas.length === 0) {
      const liVazio = document.createElement("li");
      liVazio.textContent = "(nenhuma senha em espera)";
      liVazio.classList.add("vazio");
      listaEsperaEl.appendChild(liVazio);
    } else {
      filaSenhas.forEach((senha) => {
        const li = document.createElement("li");
        li.textContent = senha;
        listaEsperaEl.appendChild(li);
      });
    }
  }

  // 2.3) Preenche a lista de senhas atendidas
  const listaAtendidasEl = document.getElementById("senhasAtendidas");
  if (listaAtendidasEl) {
    listaAtendidasEl.innerHTML = "";

    if (senhasAtendidas.length === 0) {
      const liVazio = document.createElement("li");
      liVazio.textContent = "(nenhuma senha atendida ainda)";
      liVazio.classList.add("vazio");
      listaAtendidasEl.appendChild(liVazio);
    } else {
      senhasAtendidas.forEach((senha) => {
        const li = document.createElement("li");
        li.textContent = senha;
        listaAtendidasEl.appendChild(li);
      });
    }
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

  senhasAtendidas.push(proxima);
  localStorage.setItem("senhasAtendidas", JSON.stringify(senhasAtendidas));
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
// 5) Inicialização dos botões e painel
// ========================================
function iniciarGerenciador() {
  const btnChamar = document.getElementById("btnChamarProxima");
  if (btnChamar) {
    btnChamar.addEventListener("click", chamarProximaSenha);
  }

  const btnReset = document.getElementById("btnResetar");
  if (btnReset) {
    btnReset.addEventListener("click", resetarTudo);
  }

  renderizarPainel();
}

// ========================================
// 6) Inicia ao carregar o DOM
// ========================================
window.addEventListener("DOMContentLoaded", iniciarGerenciador);
<<<<<<< HEAD
=======


// Painel de Controle de Vídeos
// Gerenciador de Vídeos - Painel de Controle
document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-video-btn');
    const urlInput = document.getElementById('video-url-input');
    const videoListUl = document.getElementById('video-list');
    // NOVO: Referência aos botões de navegação
    const prevBtn = document.getElementById('ante-video-btn');
    const nextBtn = document.getElementById('prox-video-btn');
    
    // NOVO: Chaves para o localStorage
    const listKey = 'videoCarrosselList';
    const indexKey = 'videoCarrosselIndex';

    // Função para renderizar a lista de vídeos no painel de controle
    const renderControlList = () => {
        const videos = JSON.parse(localStorage.getItem(listKey)) || [];
        
        videoListUl.innerHTML = '';

        if (videos.length === 0) {
            videoListUl.innerHTML = '<li>Nenhum vídeo na lista.</li>';
            return;
        }
        
        videos.forEach((url, index) => {
            const li = document.createElement('li');
            const textSpan = document.createElement('span');
            textSpan.textContent = url;
            li.appendChild(textSpan);
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remover';
            removeBtn.className = 'remove-btn';
            removeBtn.onclick = () => removeVideo(index);
            li.appendChild(removeBtn);
            videoListUl.appendChild(li);
        });
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

    // Função para remover um vídeo
    const removeVideo = (indexToRemove) => {
        const videos = JSON.parse(localStorage.getItem(listKey)) || [];
        videos.splice(indexToRemove, 1);
        localStorage.setItem(listKey, JSON.stringify(videos));
        // Ao remover, reseta para o primeiro vídeo
        localStorage.setItem(indexKey, '0'); 
        renderControlList();
    };

    //Função para navegar entre os vídeos proximo e anterior
    const navigate = (direction) => {
        const videos = JSON.parse(localStorage.getItem(listKey)) || [];
        if (videos.length < 2) return; // Não faz nada se tiver menos de 2 vídeos

        let currentIndex = parseInt(localStorage.getItem(indexKey)) || 0;

        if (direction === 'prox') {
            currentIndex = (currentIndex + 1) % videos.length;
        } else if (direction === 'ante') {
            currentIndex = (currentIndex - 1 + videos.length) % videos.length;
        }

        // Salva o novo índice(posição) no localStorage para o carrossel "ouvir"
        localStorage.setItem(indexKey, currentIndex);
    };

    // Adiciona clique aos botões de adicionar video 
    addBtn.addEventListener('click', addVideo);
    urlInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') addVideo();
    });
    // Adiciona click aos botões de proximo e anterior
    prevBtn.addEventListener('click', () => navigate('ante'));
    nextBtn.addEventListener('click', () => navigate('prox'));

    renderControlList();
});
>>>>>>> main
