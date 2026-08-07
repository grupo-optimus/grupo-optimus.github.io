/* ============================================================
   Prateleira de atividades

   Carrossel horizontal de cartoes. Quem rola de verdade e o
   navegador: o trilho e uma area com overflow-x e scroll-snap,
   feitos no CSS. Este arquivo so manda rolar de uma tela por vez
   e mantem as bolinhas e as setas de acordo.

   A vantagem de deixar a rolagem com o navegador e que deslizar
   o dedo, girar a roda do mouse e navegar pelo teclado ja vem
   pronto - e, sem JavaScript, a prateleira continua funcionando
   na mao.
   ============================================================ */


document.querySelectorAll(".prateleira").forEach(montarPrateleira);


function montarPrateleira(prateleira) {
    const trilho = prateleira.querySelector(".prateleira__trilho");
    const areaDasBolinhas = prateleira.querySelector(".prateleira__bolinhas");
    const anterior = prateleira.querySelector(".prateleira__seta--anterior");
    const proximo = prateleira.querySelector(".prateleira__seta--proximo");

    if (!trilho) return;

    let bolinhas = [];

    anterior.addEventListener("click", function () {
        trilho.scrollBy({ left: -larguraDaPagina() });
    });

    proximo.addEventListener("click", function () {
        trilho.scrollBy({ left: larguraDaPagina() });
    });

    /* A rolagem dispara muitos eventos seguidos; o requestAnimationFrame
       junta todos e deixa so um recalculo por quadro */
    let agendado = false;
    trilho.addEventListener("scroll", function () {
        if (agendado) return;
        agendado = true;
        requestAnimationFrame(function () {
            agendado = false;
            atualizar();
        });
    }, { passive: true });

    /* Mudar a largura da janela muda quantos cartoes cabem, entao o
       numero de paginas - e de bolinhas - muda junto */
    window.addEventListener("resize", montarBolinhas);

    montarBolinhas();

    /* Uma bolinha por tela de cartoes, nao por cartao: com dois
       cartoes visiveis, doze atividades dao seis bolinhas */
    function montarBolinhas() {
        const paginas = contarPaginas();

        /* Tudo ja cabe na tela: nao ha o que navegar */
        prateleira.classList.toggle("prateleira--completa", paginas <= 1);

        if (bolinhas.length === paginas) {
            atualizar();
            return;
        }

        areaDasBolinhas.innerHTML = "";
        bolinhas = [];

        for (let i = 0; i < paginas; i++) {
            const bolinha = document.createElement("button");
            bolinha.type = "button";
            bolinha.className = "prateleira__bolinha";
            bolinha.setAttribute("aria-label", "Ver atividades " + (i + 1) + " de " + paginas);
            bolinha.addEventListener("click", function () {
                trilho.scrollTo({ left: i * larguraDaPagina() });
            });
            areaDasBolinhas.appendChild(bolinha);
            bolinhas.push(bolinha);
        }

        atualizar();
    }

    /* Quanto anda um clique na seta: os cartoes que cabem na largura
       visivel, cada um contando com o espaco que o separa do vizinho.
       Nao da para usar a largura do trilho direto - as folgas entre os
       cartoes sobram no fim e criariam uma pagina fantasma, so com o
       resto do ultimo cartao dentro. */
    function larguraDaPagina() {
        return porPagina() * passoDoCartao();
    }

    function passoDoCartao() {
        const cartao = trilho.firstElementChild;
        if (!cartao) return trilho.clientWidth;

        const folga = parseFloat(getComputedStyle(trilho).columnGap) || 0;
        return cartao.getBoundingClientRect().width + folga;
    }

    function porPagina() {
        if (trilho.clientWidth === 0) return 1;
        return Math.max(1, Math.round(trilho.clientWidth / passoDoCartao()));
    }

    function contarPaginas() {
        const cartoes = trilho.children.length;
        if (cartoes === 0) return 1;
        return Math.ceil(cartoes / porPagina());
    }

    function atualizar() {
        const pagina = Math.round(trilho.scrollLeft / larguraDaPagina());

        bolinhas.forEach(function (bolinha, i) {
            const ativa = (i === pagina);
            bolinha.classList.toggle("prateleira__bolinha--ativa", ativa);
            bolinha.setAttribute("aria-current", ativa ? "true" : "false");
        });

        /* A rolagem nem sempre para no numero redondo: sobra um resto de
           fracao de pixel nas pontas. Comparar com zero exato deixaria a
           seta da esquerda acesa mesmo com a prateleira ja no comeco. */
        const FOLGA = 2;
        const fim = trilho.scrollWidth - trilho.clientWidth - FOLGA;

        anterior.disabled = trilho.scrollLeft <= FOLGA;
        proximo.disabled = trilho.scrollLeft >= fim;
    }
}
