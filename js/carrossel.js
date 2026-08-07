/* ============================================================
   Carrossel dos integrantes

   Mostra um integrante por vez e responde as setas, as bolinhas,
   ao teclado e ao deslize do dedo. A troca em si e feita pelo
   CSS: aqui so entra e sai a classe carrossel__slide--ativo.
   ============================================================ */


/* Tempo de cada integrante na tela, em milissegundos */
const TEMPO_DE_TROCA = 4000;

/* Arrastar menos que isso, em pixels, foi so um toque torto */
const DISTANCIA_DO_DESLIZE = 40;

const carrossel = document.querySelector(".carrossel");
const slides = carrossel ? carrossel.querySelectorAll(".carrossel__slide") : [];
const areaDasBolinhas = carrossel ? carrossel.querySelector(".carrossel__bolinhas") : null;

/* Preenchido por criarBolinhas() */
const bolinhas = [];

let slideAtual = 0;
let intervalo = null;
let pausado = false;
let inicioDoToque = null;

/* Ajuste de acessibilidade do sistema: quando ligado, o visitante
   pediu menos animacao, entao nada gira sozinho */
const preferMenosAnimacao =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;


iniciar();


function iniciar() {
    if (!carrossel || slides.length === 0) return;

    criarBolinhas();
    ligarControles();
    mostrarSlide(0);
    iniciarGiro();
}

function mostrarSlide(indice) {
    /* O resto da divisao faz a volta: passou do ultimo, cai no
       primeiro; passou do primeiro para tras, cai no ultimo.
       Somar slides.length antes de dividir evita indice negativo. */
    slideAtual = (indice + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
        const ativo = (i === slideAtual);
        slide.classList.toggle("carrossel__slide--ativo", ativo);
        slide.setAttribute("aria-hidden", ativo ? "false" : "true");
    });

    bolinhas.forEach(function (bolinha, i) {
        const ativa = (i === slideAtual);
        bolinha.classList.toggle("carrossel__bolinha--ativa", ativa);
        bolinha.setAttribute("aria-current", ativa ? "true" : "false");
    });
}

/* Usada por todos os controles: alem de trocar, reinicia a contagem,
   para o integrante recem-escolhido nao sumir logo em seguida */
function irPara(indice) {
    mostrarSlide(indice);
    reiniciarGiro();
}

function proximo() {
    irPara(slideAtual + 1);
}

function anterior() {
    irPara(slideAtual - 1);
}

/* Uma bolinha por slide, criadas aqui e nao escritas no HTML: assim
   ninguem esquece de acrescentar a bolinha ao incluir um integrante */
function criarBolinhas() {
    slides.forEach(function (slide, i) {
        const nome = slide.querySelector(".carrossel__nome").textContent.trim();

        const bolinha = document.createElement("button");
        bolinha.type = "button";
        bolinha.className = "carrossel__bolinha";
        /* A bolinha e so um circulo: o nome do integrante entra como
           rotulo para quem navega por leitor de tela */
        bolinha.setAttribute("aria-label", "Ver " + nome);
        bolinha.addEventListener("click", function () {
            irPara(i);
        });

        areaDasBolinhas.appendChild(bolinha);
        bolinhas.push(bolinha);
    });
}

function ligarControles() {
    carrossel.querySelector(".carrossel__seta--anterior")
        .addEventListener("click", anterior);

    carrossel.querySelector(".carrossel__seta--proximo")
        .addEventListener("click", proximo);

    /* O evento so chega aqui quando o foco esta em algum botao de
       dentro do carrossel, entao as setas continuam rolando a pagina
       normalmente no resto do site */
    carrossel.addEventListener("keydown", function (evento) {
        if (evento.key === "ArrowLeft") {
            evento.preventDefault();
            anterior();
        }
        if (evento.key === "ArrowRight") {
            evento.preventDefault();
            proximo();
        }
    });

    carrossel.addEventListener("mouseenter", pausar);
    carrossel.addEventListener("mouseleave", retomar);
    carrossel.addEventListener("focusin", pausar);
    carrossel.addEventListener("focusout", retomar);

    /* Aba em segundo plano: nao adianta girar, ninguem esta vendo */
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            pararGiro();
        } else if (!pausado) {
            iniciarGiro();
        }
    });

    ligarDeslize();
}

function ligarDeslize() {
    const trilho = carrossel.querySelector(".carrossel__slides");

    /* O passive: true avisa o navegador que nao vamos bloquear a
       rolagem, entao ele nao precisa esperar por nos */
    trilho.addEventListener("touchstart", function (evento) {
        inicioDoToque = evento.changedTouches[0].clientX;
    }, { passive: true });

    trilho.addEventListener("touchend", function (evento) {
        if (inicioDoToque === null) return;

        const percorrido = evento.changedTouches[0].clientX - inicioDoToque;
        inicioDoToque = null;

        if (Math.abs(percorrido) < DISTANCIA_DO_DESLIZE) return;

        /* Dedo para a esquerda mostra o proximo, como virar uma pagina */
        if (percorrido < 0) proximo();
        else anterior();
    }, { passive: true });
}

function iniciarGiro() {
    if (preferMenosAnimacao) return;
    /* Sem esta linha, cada retomada ligaria mais um cronometro em
       cima do anterior e o carrossel iria acelerando sozinho */
    if (intervalo !== null) return;

    intervalo = setInterval(function () {
        mostrarSlide(slideAtual + 1);
    }, TEMPO_DE_TROCA);
}

function pararGiro() {
    clearInterval(intervalo);
    intervalo = null;
}

function reiniciarGiro() {
    pararGiro();
    if (!pausado) iniciarGiro();
}

function pausar() {
    pausado = true;
    pararGiro();
}

function retomar() {
    /* Mouse e teclado pausam pelo mesmo caminho, entao so volta a
       girar quando nenhum dos dois esta mais dentro do carrossel -
       senao tirar o foco retomaria o giro com o mouse ainda em cima */
    if (carrossel.matches(":hover")) return;
    if (carrossel.contains(document.activeElement)) return;

    pausado = false;
    iniciarGiro();
}
