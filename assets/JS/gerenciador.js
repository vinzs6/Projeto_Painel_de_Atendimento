// Arquivo: assets/JS/gerenciador.js

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
