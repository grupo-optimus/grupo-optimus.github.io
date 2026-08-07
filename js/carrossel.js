/* ============================================================
   Carrossel dos integrantes - Grupo Optimus

   Mostra um integrante por vez, troca sozinho a cada 4 segundos
   e responde as setas, as bolinhas, ao teclado e ao deslize do
   dedo no celular.

   O que mudou em relacao a versao do Cozinha & Codigo:
   - a troca e uma transicao suave, nao um corte seco
   - as bolinhas sao criadas sozinhas, uma por slide: para incluir
     um integrante basta copiar o slide no HTML
   - o giro automatico pausa com o mouse em cima, com o foco do
     teclado dentro e quando a aba sai da frente
   - os controles sao <button> com rotulo, em vez de onclick
     escrito no meio do HTML
   - quem configurou o sistema para menos animacao fica so no
     controle manual
   ============================================================ */


/* Quanto tempo cada integrante fica na tela, em milissegundos */
const TEMPO_DE_TROCA = 4000;

/* Distancia minima, em pixels, para um arrastar de dedo contar como
   deslize - abaixo disso foi so um toque torto na tela */
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

/* Ajuste de acessibilidade do sistema operacional. Quando esta ligado,
   o visitante pediu menos animacao - entao nada gira sozinho. */
const preferMenosAnimacao =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;


iniciar();


function iniciar() {
    /* Sem carrossel na pagina, ou sem slides dentro dele, nao ha nada
       a ligar - o resto do arquivo simplesmente nao roda */
    if (!carrossel || slides.length === 0) return;

    criarBolinhas();
    ligarControles();
    mostrarSlide(0);
    iniciarGiro();
}


/* ------------------------------------------------------------
   TROCA DE SLIDE
   ------------------------------------------------------------ */

/* Marca um slide como ativo e apaga os outros. O resto - o fade - e
   trabalho do CSS: aqui so entra e sai a classe --ativo. */
function mostrarSlide(indice) {
    /* O resto da divisao faz a volta: passou do ultimo, cai no primeiro;
       passou do primeiro para tras, cai no ultimo. Somar slides.length
       antes de dividir evita indice negativo. */
    slideAtual = (indice + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
        const ativo = (i === slideAtual);
        slide.classList.toggle("carrossel__slide--ativo", ativo);
        /* Esconde de leitor de tela quem esta fora de vista */
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


/* ------------------------------------------------------------
   BOLINHAS

   Uma por slide, criadas aqui em vez de escritas no HTML: assim o
   HTML nao precisa saber quantos integrantes existem, e ninguem
   esquece de acrescentar a bolinha ao incluir alguem no grupo.
   ------------------------------------------------------------ */

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


/* ------------------------------------------------------------
   CONTROLES
   ------------------------------------------------------------ */

function ligarControles() {
    carrossel.querySelector(".carrossel__seta--anterior")
        .addEventListener("click", anterior);

    carrossel.querySelector(".carrossel__seta--proximo")
        .addEventListener("click", proximo);

    /* Setas do teclado. O evento so chega aqui quando o foco esta em
       algum botao de dentro do carrossel, entao as setas continuam
       rolando a pagina normalmente no resto do site. */
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

    /* Pausa enquanto o visitante esta olhando ou mexendo */
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

/* Deslize do dedo no celular. O passive: true avisa o navegador que
   nao vamos bloquear a rolagem, entao ele nao precisa esperar por nos. */
function ligarDeslize() {
    const trilho = carrossel.querySelector(".carrossel__slides");

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


/* ------------------------------------------------------------
   GIRO AUTOMATICO
   ------------------------------------------------------------ */

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
    pausado = false;
    iniciarGiro();
}
