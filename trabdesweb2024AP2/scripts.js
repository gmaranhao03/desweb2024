function entrar() {
  let senha = document.getElementById("senha").value;

  if (hex_sha256(senha) === "bdb161ea0e8f982d6f9f628787410b91535e49da84da647d30fda76fe6fe9829") {
    window.sessionStorage.setItem("logado", "logado");
    window.location = "principal.html";
  } else {
    alert("Senha incorreta!");
  }
}

function sair() {
  window.sessionStorage.removeItem("logado");
  window.location.href = "index.html";
}

function carregar(tipo) {
  document.getElementById("filtro").value = "";
  fetch("https://botafogo-atletas.mange.li/2024-1/" + tipo)
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (jogadores) {
      localStorage.setItem("jogadores", JSON.stringify(jogadores));
      criarCards(jogadores);
    })
    .catch(function (erro) {
      alert("Erro ao obter os dados." + tipo);
    });
}


function filtrar(nome) {
  let todosJogadores = JSON.parse(localStorage.getItem("jogadores") ?? '[]');

  if(todosJogadores.length == 0) {
    alert("Selecione o elenco.")
  }

  let jogadores = todosJogadores.filter((jogador) => {
    return jogador.nome.toLowerCase().indexOf(nome) > -1;
  })

  criarCards(jogadores)
}

function irParaDetalhes(event) {
  window.location = "jogador.html?id=" + event.target.closest('.card').id;
}

function criarCards(jogadores) {
  document.getElementById("elenco").innerHTML = "";

  for (var i = 0; i < jogadores.length; i++) {
    jogador = jogadores[i];

    var div = document.createElement("div");
    var divTitulo = document.createElement("div");
    var titulo = document.createElement("h3");
    var detalhes = document.createElement("h4");
    var img = document.createElement("img");

    divTitulo.classList.add("dvTitulo");
    div.id = jogador.id;
    div.classList.add("card");
    titulo.textContent = jogador.nome;
    img.src = jogador.imagem;
    img.alt = jogador.nome;
    img.classList.add('img-jogador');
    detalhes.textContent = "Mais detalhes";
    div.onclick = irParaDetalhes;

    divTitulo.appendChild(titulo)
    div.appendChild(divTitulo);
    div.appendChild(img);
    div.appendChild(img);
    div.appendChild(detalhes);

    document.getElementById("elenco").appendChild(div);
  }

  document.getElementById("text").style.display = "none";
}

function buscarJogadorPorId(id) {
  fetch("https://botafogo-atletas.mange.li/2024-1/" + id)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      mostrarDados(data);
    })
    .catch(function (erro) {
      alert("Não foi possível obter os dados no momento, tente novamente.");
    });
}

function mostrarDados(jogador) {
  var article = document.createElement("article");

  var divImg = document.createElement("div");
  var nome = document.createElement("h3");
  var img = document.createElement("img");

  var divDetalhes = document.createElement("div");
  var nome_completo = document.createElement("p");
  var nascimento = document.createElement("p");
  var altura = document.createElement("p");
  var elenco = document.createElement("p");
  var posicao = document.createElement("p");
  var descricao = document.createElement("p");
  var naturalidade = document.createElement("p");
  var descricao = document.createElement("p");
  var qtdjogos = document.createElement("p");
  var Titulo = document.createElement("h2");
  var link = document.createElement("a");

  article.classList.add("jogador");

  divImg.id = "foto-jogador";
  nome.textContent = jogador.nome;
  img.alt = jogador.nome;
  img.src = jogador.imagem;
  divImg.appendChild(img);
  divImg.appendChild(nome);
  article.appendChild(divImg);

  divDetalhes.id = "detalhes";
  Titulo.textContent = "Perfil do atleta"
  elenco.innerHTML  =  "<b>Elenco: </b>" + jogador.elenco;
  nascimento.innerHTML  = "<b>Data de nascimento: </b>" + jogador.nascimento;
  altura.innerHTML  = "<b>Altura: </b>" + jogador.altura;
  posicao.innerHTML  = "<b>Posição: </b>" +jogador.posicao;
  descricao.textContent  = jogador.detalhes;
  naturalidade.innerHTML = "<b>Naturalidade:</b> " + jogador.naturalidade;
  qtdjogos.innerHTML = jogador.n_jogos + " pelo <b>BOTAFOGO</b>";
  link.href = jogador.url_detalhes;
  link.target = "_blank";
  link.textContent = "Ver mais"
  
  divDetalhes.appendChild(Titulo);
  divDetalhes.appendChild(descricao);
  divDetalhes.appendChild(nascimento);
  if(jogador.altura) divDetalhes.appendChild(altura);
  divDetalhes.appendChild(elenco);
  divDetalhes.appendChild(posicao);
  divDetalhes.appendChild(naturalidade);
  divDetalhes.appendChild(qtdjogos);
  divDetalhes.appendChild(link);
  
  article.appendChild(divDetalhes)

  document.getElementById("jogador").appendChild(article);
}

window.onload = () => {
  let paginaLogin = window.location.href.indexOf("index") > -1;
  let paginaJogador = window.location.href.indexOf("jogador") > -1;
  let paginaHome = window.location.href.indexOf("principal") > -1;
 
  if (!paginaLogin && !window.sessionStorage.getItem("logado")) {
    alert("Usuário deve estar logado.");
    window.location = "index.html";
  }

  if(paginaHome){
    document.getElementById("filtro").addEventListener('keyup', (event) => {
      filtrar(event.target.value?.toLowerCase())
    })
  }

  if (paginaJogador) {
    var queryString = new URLSearchParams(document.location.search);
    var id = parseInt(queryString.get("id"));
    buscarJogadorPorId(id);
  }
};