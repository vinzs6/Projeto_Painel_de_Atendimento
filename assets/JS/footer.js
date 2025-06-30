function DataHora() {
  const agora = new Date();

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

  document.getElementById("dataHora").textContent = `${hora} ${data}`;
  // document.getElementById('hora').textContent = `${hora}`;
}
setInterval(DataHora, 1000);
DataHora();

// Buscar clima usando OpenWeather
async function buscarClima() {
  const apiKey = "1cc74e49bdf9f9a0b65fcfc199bf0685"; // key de API do OpenWeather
  const cidade = "São Paulo"; // Cidade para buscar o clima
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&lang=pt_br&units=metric`;

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
