document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.getElementById('carrossel-container');
    const placeholderHtml = carouselContainer.innerHTML;

    // Chaves para o localStorage (devem ser as mesmas do gerenciador.js)
    const listKey = 'videoCarrosselList';
    const indexKey = 'videoCarrosselIndex';

    let videos = [];
    let currentIndex = 0;
    let carouselInterval;

    const getYouTubeID = (url) => {
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === "youtu.be") return urlObj.pathname.slice(1);
            if (urlObj.hostname.includes("youtube.com")) return urlObj.searchParams.get("v");
        } catch (e) { /* Ignora URLs inválidas */ }
        return null;
    };

    // Função para renderizar o carrossel
    const renderCarousel = () => {
        clearInterval(carouselInterval);
        carouselContainer.innerHTML = '';

        if (videos.length === 0) {
            carouselContainer.innerHTML = placeholderHtml;
            return;
        }

        videos.forEach((url) => {
            const videoId = getYouTubeID(url);
            if (videoId) {
                const slide = document.createElement('div');
                slide.className = 'carrossel-slide';

                // ** CORREÇÃO CRÍTICA **
                // A linha abaixo foi alterada para remover `loop=1` e `playlist=...`.
                // Isto permite que o nosso script controle a troca, e não o YouTube.
                const iframeSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0`;

                slide.innerHTML = `<iframe src="${iframeSrc}" allow="autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                carouselContainer.appendChild(slide);
            }
        });

        showSlide(currentIndex);
        startCarousel();
    };

    // Função para mostrar o slide correto (usando a classe .active)
    const showSlide = (index) => {
        const slides = document.querySelectorAll('.carrossel-slide');
        if (slides[index]) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }
    };

    // Função para iniciar o ciclo do carrossel
    const startCarousel = () => {
        clearInterval(carouselInterval);
        const slides = document.querySelectorAll('.carrossel-slide');
        // Só ativa o temporizador se houver mais de um vídeo
        if (slides.length > 1) {
            // NOTA: A troca ocorrerá a cada 15s, independente da duração do vídeo.
            carouselInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                showSlide(currentIndex);
                localStorage.setItem(indexKey, currentIndex);
            }, 15000); // 15 segundos
        }
    };

    // Função principal para carregar dados do localStorage e renderizar
    const loadAndRender = () => {
        const storedVideos = localStorage.getItem(listKey);
        videos = storedVideos ? JSON.parse(storedVideos) : [];
        currentIndex = parseInt(localStorage.getItem(indexKey)) || 0;
        if (currentIndex >= videos.length) {
            currentIndex = 0;
        }
        renderCarousel();
    };

    // "Ouve" por mudanças feitas em outras abas (o painel de gerenciamento)
    window.addEventListener('storage', (event) => {
        if (event.key === listKey || event.key === indexKey) {
            loadAndRender();
        }
    });

    // Carga inicial quando a página abre
    loadAndRender();
});
