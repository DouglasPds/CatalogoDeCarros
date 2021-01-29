(function() {
  'use strict';

  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"

  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.

  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.

  Essas informações devem ser adicionadas no HTML via Ajax.

  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.

  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */

  function app() {

    var $nome = document.querySelector('[data-js="nome"]');
    var $telefone = document.querySelector('[data-js="telefone"]');
    var $button = document.querySelector('[data-js="button"]');
    var $imagem = document.querySelector('[data-js="imagem"]');
    var $marca = document.querySelector('[data-js="marca"]');
    var $ano = document.querySelector('[data-js="ano"]');
    var $placa = document.querySelector('[data-js="placa"]');
    var $cor = document.querySelector('[data-js="cor"]');

    var arrForm = [$marca, $ano, $placa, $cor];

    function init() {
      startAjax();
    }

    function startAjax() {
      var ajax = new XMLHttpRequest();
      ajax.open('GET', 'company.json');
      ajax.send();
      handleReadyState(ajax);
    }

    function handleReadyState(ajax) {
      ajax.addEventListener('readystatechange', function() {
        if(ajaxIsReady(ajax))
          handleResponseToObject(ajax);
      })
    }

    function ajaxIsReady(ajax) {
      return ajax.readyState === 4 && ajax.status === 200;
    }

    function handleResponseToObject(ajax) {
      var infoEmpresa = JSON.parse(ajax.responseText);
      return addNameAndPhone(infoEmpresa);
    }

    function addNameAndPhone(infoEmpresa) {
      $nome.innerHTML = infoEmpresa.name;
      $telefone.innerHTML = infoEmpresa.phone;
    }

    $button.addEventListener('click', function(e) {
      e.preventDefault();
      var $tbody = document.querySelector('[data-js="tbody"]');
      $tbody.appendChild(createFragment());
    })

    function createFragment() {
      var $fragment = document.createDocumentFragment();
      return $fragment.appendChild(fillTable());
    }

    function fillTable() {
      var $tr = document.createElement('tr');
      $tr.appendChild(createImg());
      arrForm.map(function(item) {
        $tr.appendChild(createTd(item));
        item.value = '';
      })
      return $tr;
    }

    function createTd(item) {
      var $td = document.createElement('td');
      (arrForm.indexOf(item) === -1) ? $td.appendChild(item) : $td.appendChild(document.createTextNode(item.value));
      return $td;
    }

    function createImg() {
      var $img = document.createElement('img');
      $img.src = $imagem.value;
      $imagem.value = '';
      return createTd($img);
    }

    return {
      init: init
    }

  }

  app().init();

})(window.DOM);
