// ========================================
// Atualiza data, hora e clima no topo/rodapé
// ========================================
function atualizarTopoRodape() {
  const agora = new Date();

  // Formatando data e hora
  const data = agora.toLocaleDateString("pt-BR", {
    // weekday: 'long',
    year: "numeric",
    month: "2-digit", // mais padronizado
    day: "2-digit",
  });

  const hora = agora.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const textoDataHora = `${hora} ${data}`;

  // Atualizando data/hora no topo e rodapé (com verificação de elementos)
  const topoData = document.getElementById("displayDataHoraTopo");
  const rodapeData = document.getElementById("displayDataHoraRodape");
  if (topoData) topoData.textContent = textoDataHora;
  if (rodapeData) rodapeData.textContent = textoDataHora;

  // Clima via OpenWeather
  const apiKey = "1cc74e49bdf9f9a0b65fcfc199bf0685"; // ⚠️ IMPORTANTE: Esta chave da API está hardcoded temporariamente.
  // Em versões futuras, será movida para o back-end ou variáveis de ambiente (.env). 
  
    const cidade = "São Paulo";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&lang=pt_br&units=metric`;

<<<<<<< HEAD
  fetch(url)
    .then((res) => res.json())
    .then((dados) => {
      const temperatura = dados.main.temp.toFixed(1) + "°C";
      const climaTopo = document.getElementById("displayClimaTopo");
      const climaRodape = document.getElementById("displayClimaRodape");
      if (climaTopo) climaTopo.textContent = temperatura;
      if (climaRodape) climaRodape.textContent = temperatura;
    })
    .catch(() => {
      const climaTopo = document.getElementById("displayClimaTopo");
      const climaRodape = document.getElementById("displayClimaRodape");
      if (climaTopo) climaTopo.textContent = "-- °C";
      if (climaRodape) climaRodape.textContent = "-- °C";
    });
}

// Atualiza imediatamente e depois a cada 10 segundos
setInterval(atualizarTopoRodape, 10000);
atualizarTopoRodape();

// Inicializações adicionais
document.addEventListener("DOMContentLoaded", () => {
  const botao = document.getElementById("btnChamarProxima");
  if (botao) {
    botao.addEventListener("click", chamarProximaSenha);
  }
  atualizarTela?.(); // Verifica se a função existe antes de chamar
});
=======
  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();
    const temperatura = dados.main.temp;
    const descricao = dados.weather[0].description;
    document.getElementById(
      "clima"
    ).textContent = `${cidade}: ${temperatura.toFixed(1)}°C`;
  } catch (erro) {
    document.getElementById("clima").textContent =
      "Não foi possível carregar o clima.";
  }
}

buscarClima();

/*function atualizarTopoRodape() {
  const agora = new Date();

  // Formatando data e hora
  const data = agora.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit", // mais padronizado
    day: "2-digit",
  });

  const hora = agora.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const textoDataHora = `${hora} ${data}`;

  // Atualizando data/hora no topo e rodapé (com verificação de elementos)
  const topoData = document.getElementById("displayDataHoraTopo");
  const rodapeData = document.getElementById("displayDataHoraRodape");
  if (topoData) topoData.textContent = textoDataHora;
  if (rodapeData) rodapeData.textContent = textoDataHora;

  // Clima via OpenWeather
  const apiKey = "1cc74e49bdf9f9a0b65fcfc199bf0685"; // Esta chave da API está hardcoded temporariamente.
    // Em versões futuras, será movida para o back-end ou variáveis de ambiente (.env). 
  const cidade = "São Paulo";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&lang=pt_br&units=metric`;

  fetch(url)
    .then((res) => res.json())
    .then((dados) => {
      const temperatura = dados.main.temp.toFixed(1) + "°C";
      const climaTopo = document.getElementById("displayClimaTopo");
      const climaRodape = document.getElementById("displayClimaRodape");
      if (climaTopo) climaTopo.textContent = temperatura;
      if (climaRodape) climaRodape.textContent = temperatura;
    })
    .catch(() => {
      const climaTopo = document.getElementById("displayClimaTopo");
      const climaRodape = document.getElementById("displayClimaRodape");
      if (climaTopo) climaTopo.textContent = "-- °C";
      if (climaRodape) climaRodape.textContent = "-- °C";
    });
}  */

// SENHA
let senhaAtual = 1;
const senha = document.getElementById('senha');
const progresso = document.getElementById('progresso');
const tempo = document.getElementById('tempo-restante');
const tempoTotal = 5000;
let tempoRestante = tempoTotal;
let intervalo;

function formatarSenha(numero) {
    return numero.toString().padStart(4, '0');
}

function atualizarProgresso() {
    const porcentagem = (tempoRestante / tempoTotal) * 100;
    progresso.style.width = porcentagem + '%';
    
    const segundos = Math.ceil(tempoRestante / 1000);
    tempo.textContent = `Próxima senha em ${segundos}s`;
    
    tempoRestante -= 100;
    
    if (tempoRestante <= 0) {
        clearInterval(intervalo);
    }
}

function exibirProximaSenha() {
    senhaAtual++;
    if (senhaAtual > 9999) {
        senhaAtual = 1;
    }
    
    senha.textContent = formatarSenha(senhaAtual);
    tempoRestante = tempoTotal;

    progresso.style.width = '100%';
    tempo.textContent = `Próxima senha em ${tempoTotal/1000}s`;

    clearInterval(intervalo);

    intervalo = setInterval(atualizarProgresso, 100);

    setTimeout(exibirProximaSenha, tempoTotal);
}

function iniciarCiclo() {
    senha.textContent = formatarSenha(senhaAtual);

    intervalo = setInterval(atualizarProgresso, 100);

    setTimeout(exibirProximaSenha, tempoTotal);
}
window.addEventListener('DOMContentLoaded', iniciarCiclo);
>>>>>>> main
