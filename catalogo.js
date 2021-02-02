(function() {
  'use strict';

  function app() {

    var $nome = document.querySelector('[data-js="nome"]');
    var $telefone = document.querySelector('[data-js="telefone"]');
    var $buttonCreate = document.querySelector('[data-js="button"]');
    var $imagem = document.querySelector('[data-js="imagem"]');
    var $marca = document.querySelector('[data-js="marca"]');
    var $ano = document.querySelector('[data-js="ano"]');
    var $placa = document.querySelector('[data-js="placa"]');
    var $cor = document.querySelector('[data-js="cor"]');
    var $tbody = document.querySelector('[data-js="tbody"]');

    var arrForm = [$marca, $ano, $placa, $cor];

    function init() {
      startAjax();
      getValues();
    }

    function getValues() {
      var get = new XMLHttpRequest();
      get.open('GET', 'http://localhost:3000/car/');
      get.send();
  
      get.addEventListener('readystatechange', function() {
        if(get.readyState === 4){
          var responseJson = JSON.parse(get.responseText);
          for(var cont = 0; cont < responseJson.length; cont++) {
            var $tr = document.createElement('tr');
  
            var $imagem = document.createElement('img');
            var $tdImagem = document.createElement('td');
            var $tdMarca = document.createElement('td');
            var $tdAno = document.createElement('td');
            var $tdPlaca = document.createElement('td');
            var $tdCor = document.createElement('td');
  

            $imagem.src = responseJson[cont].imagem;
            $tdImagem.appendChild($imagem);
            $tdMarca.textContent = responseJson[cont].marca;
            $tdAno.textContent = responseJson[cont].ano;
            $tdPlaca.textContent = responseJson[cont].placa;
            $tdCor.textContent = responseJson[cont].cor;
  
            $tr.appendChild($tdImagem);
            $tr.appendChild($tdMarca);
            $tr.appendChild($tdAno);
            $tr.appendChild($tdPlaca);
            $tr.appendChild($tdCor);
            $tr.appendChild(createButtonRemove());
  
            $tbody.appendChild($tr);
          }
        }      
      });
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

    $buttonCreate.addEventListener('click', function() {
      var ajax = new XMLHttpRequest();
      ajax.open('POST', 'http://localhost:3000/car');
      ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      ajax.send(`imagem=${$imagem.value}&marca=${$marca.value}&ano=${$ano.value}&placa=${$placa.value}&cor=${$cor.value}`);

      // e.preventDefault();
      // $tbody.appendChild(createFragment());
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
      $tr.appendChild(createButtonRemove());
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

    function createButtonRemove() {
      var $buttonRemove = document.createElement('button');
      var $contentButtonRemove = document.createTextNode('Remover');
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

})(window.DOM);
