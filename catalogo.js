(function(doc) {
  'use strict';

  function app() {

    var $nome = doc.querySelector('[data-js="nome"]');
    var $telefone = doc.querySelector('[data-js="telefone"]');
    var $buttonCreate = doc.querySelector('[data-js="button"]');
    var $imagem = doc.querySelector('[data-js="imagem"]');
    var $marca = doc.querySelector('[data-js="marca"]');
    var $ano = doc.querySelector('[data-js="ano"]');
    var $placa = doc.querySelector('[data-js="placa"]');
    var $cor = doc.querySelector('[data-js="cor"]');
    var $tbody = doc.querySelector('[data-js="tbody"]');

    var arrForm = ['marca', 'ano', 'placa', 'cor'];

    function init() {
      startAjax();
      getValues();
      addListenerToCreateButton();
    }

    function getValues() {
      var ajaxGet = new XMLHttpRequest();
      ajaxGet.open('GET', 'http://localhost:3000/car/');
      ajaxGet.send();
      handleReadyState(ajaxGet);
    }

    function addTable(responseJson) {
      responseJson.map(function(item) {
        $tbody.appendChild(createFragment(item));
      })
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
      var responseJson = JSON.parse(ajax.responseText);
      return responseJson.length > 1 ?addTable(responseJson) : addNameAndPhone(responseJson);
    }

    function addNameAndPhone(infoEmpresa) {
      $nome.innerHTML = infoEmpresa[0].name;
      $telefone.innerHTML = infoEmpresa[0].phone;
    }

    function addListenerToCreateButton() {
      $buttonCreate.addEventListener('click', function() {
        var ajax = new XMLHttpRequest();
        ajax.open('POST', 'http://localhost:3000/car');
        ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        ajax.send(`imagem=${$imagem.value}&marca=${$marca.value}&ano=${$ano.value}&placa=${$placa.value}&cor=${$cor.value}`);

        e.preventDefault();
      })
    }

    function createFragment(item) {
      var $fragment = doc.createDocumentFragment();
      return $fragment.appendChild(createAndFillTableRow(item));
    }

    function createAndFillTableRow(value) {
      var $tr = doc.createElement('tr');
      $tr.appendChild(createImg(value.imagem));
      arrForm.map(function(item) {
        $tr.appendChild(createTd(item, value));
      })
      $tr.appendChild(createButtonRemove());
      return $tr;
    }

    function createTd(item, value = '') {
      var $td = doc.createElement('td');
      (arrForm.indexOf(item) === -1) ? $td.appendChild(item) : $td.appendChild(doc.createTextNode(value[item]));
      return $td;
    }

    function createImg(imagem) {
      var $img = doc.createElement('img');
      $img.src = imagem;
      return createTd($img);
    }

    function createButtonRemove() {
      var $buttonRemove = doc.createElement('button');
      var $contentButtonRemove = doc.createTextNode('Remover');
      $buttonRemove.appendChild($contentButtonRemove);
      removeRow($buttonRemove);
      deleteCar($buttonRemove);
      return createTd($buttonRemove);
    }

    function removeRow($buttonRemove) {
      $buttonRemove.addEventListener('click', function() {
        $tbody.removeChild($buttonRemove.parentElement.parentElement);
      })
    }

    function deleteCar($buttonRemove) {
      $buttonRemove.addEventListener('click', function() {
        var placa = $buttonRemove.parentElement.previousElementSibling.previousElementSibling.textContent;
        var ajaxDel = new XMLHttpRequest();
        ajaxDel.open('DELETE', 'http://localhost:3000/car/' + placa);
        ajaxDel.send();
      })
    }

    return {
      init: init
    }

  }

  app().init();

})(document);