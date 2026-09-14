# Grupo Optimus — portfólio

Site do **Grupo Optimus**, estudantes de tecnologia da UniAmérica. Reúne
tudo que o grupo produziu, período a período — de programas de terminal em
C a páginas publicadas na web, passando por um robô que anda sozinho.

**No ar em <https://grupo-optimus.github.io>**

HTML, CSS e JavaScript puros: sem framework, sem dependência, sem etapa de
build. É só abrir o `index.html` no navegador.

## Páginas

| endereço | o que tem |
|---|---|
| [`/`](https://grupo-optimus.github.io) | o grupo, os projetos em destaque e os integrantes |
| [`/periodo1.html`](https://grupo-optimus.github.io/periodo1.html) | 1º período — C e C++ |
| [`/periodo2.html`](https://grupo-optimus.github.io/periodo2.html) | 2º período — web |

A raiz é sobre o **grupo**, não sobre o semestre atual. Isso é de propósito:
cada período tem endereço fixo, que continua significando a mesma coisa
quando o semestre seguinte chegar. Período novo é um arquivo a mais, sem
renomear nada.

## Os trabalhos

Cada trabalho mora no seu próprio repositório, e o GitHub Pages publica
todos sob este mesmo domínio.

### 1º período — C e C++

| trabalho | |
|---|---|
| Quiz multiplayer *(mensal, 1ª entrega)* | [código](https://github.com/grupo-optimus/quiz-mensal) |
| PDV / Mercadinho *(mensal, 2ª entrega)* | [código](https://github.com/grupo-optimus/pdv) |
| Robô Sumô *(Integrador de Extensão I)* | [código](https://github.com/grupo-optimus/robo-sumo) · [portfólio da UniAmérica](https://portfoliodigital.uniamerica.br/projetos/robo-sumo-optimus-6a3be08175212) |
| 12 atividades de aula | [código](https://github.com/grupo-optimus/atividades-periodo1) |

### 2º período — web

| trabalho | |
|---|---|
| Cozinha & Código | [página](https://grupo-optimus.github.io/cozinha-e-codigo/) · [código](https://github.com/grupo-optimus/cozinha-e-codigo) |

## Como mexer

```
index.html        pagina do grupo
periodo1.html     1o periodo
periodo2.html     2o periodo
style.css         todo o estilo das tres paginas
js/carrossel.js   carrossel dos integrantes
js/prateleira.js  carrossel horizontal das atividades
img/              fotos (300x300), logo e favicon
```

Não há servidor nem instalação: abra o `.html` direto no navegador.

**Acrescentar um trabalho** — copie um bloco `<a class="projeto">` inteiro
na página do período e troque o `href`, o título e a descrição. Os cartões
se reorganizam sozinhos conforme a largura da tela; não há número de
cartões escrito em lugar nenhum.

**Acrescentar um integrante** — copie um bloco `<article class="carrossel__slide">`
e troque foto, nome e papel. A bolinha do carrossel é criada sozinha pelo
JavaScript.

**Acrescentar um período** — copie o `periodo2.html` para `periodo3.html`,
troque o conteúdo, e acrescente a opção no alternador das outras páginas e
um cartão na seção Períodos da home.

Duas coisas para não esquecer:

- **O cabeçalho e o rodapé são iguais nas três páginas.** Mexeu num, mexe
  nos três. Cada arquivo tem um comentário avisando disso no topo.
- **As fotos são quadradas, 300x300.** O CSS recorta em círculo; imagem
  fora dessa proporção sai distorcida.

## Quem faz parte

| | | |
|---|---|---|
| Cauê Vergopolan Hanzen | Scrum Master | [GitHub](https://github.com/kauoo) · [Instagram](https://www.instagram.com/caue.hanzen/) |
| André Luis Castelhano | Product Owner | [GitHub](https://github.com/andrecastelhanosilva) · [Instagram](https://www.instagram.com/andrecastelhano.silva/) |
| Carlos Henrique da Silva Menger Neto | Dev | [GitHub](https://github.com/chmenger) · [Instagram](https://www.instagram.com/c_.menger/) |
| Guilherme da Cunha Bonetto | Dev | [GitHub](https://github.com/GuilhermeBonetto22) · [Instagram](https://www.instagram.com/guilherme_bonetto/) |
| Pedro Pimentel Perdomo | Dev | [GitHub](https://github.com/PedroPimentelCS) · [Instagram](https://www.instagram.com/pedro.pperdomo/) |
| Zainab Ahmad Al Ghazaoui | Mentora | [GitHub](https://github.com/zainabdamani) · [Instagram](https://www.instagram.com/zainab.wav/) |

O Pedro entrou no grupo no 2º período, e os papéis de Scrum começaram no
mesmo semestre — no 1º período todos eram desenvolvedores. Por isso a
página de cada período mostra o grupo como ele era naquele momento.

---

UniAmérica · Atividades acadêmicas
