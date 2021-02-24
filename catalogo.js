(function catalogo(doc) {
  function app() {
    const $nome = doc.querySelector('[data-js="nome"]');
    const $telefone = doc.querySelector('[data-js="telefone"]');
    const $buttonCreate = doc.querySelector('[data-js="button"]');
    const $imagem = doc.querySelector('[data-js="imagem"]');
    const $marca = doc.querySelector('[data-js="marca"]');
    const $ano = doc.querySelector('[data-js="ano"]');
    const $placa = doc.querySelector('[data-js="placa"]');
    const $cor = doc.querySelector('[data-js="cor"]');
    const $tbody = doc.querySelector('[data-js="tbody"]');

    const arrForm = ['marca', 'ano', 'placa', 'cor'];

    function init() {
      getNameAndPhone();
      getValues();
      addListenerToCreateButton();
    }

    function getValues() {
      const ajaxGet = new XMLHttpRequest();
      ajaxGet.open('GET', 'http://localhost:3000/car/');
      ajaxGet.send();
      handleReadyState(ajaxGet);
    }

    function addTable(responseJson) {
      responseJson.map((item) => $tbody.appendChild(createFragment(item)));
    }

    function getNameAndPhone() {
      const ajax = new XMLHttpRequest();
      ajax.open('GET', 'company.json');
      ajax.send();
      handleReadyState(ajax);
    }

    function handleReadyState(ajax) {
      ajax.addEventListener('readystatechange', () => {
        if (ajaxIsReady(ajax)) {
          handleResponseToObject(ajax);
        }
      });
    }

    function ajaxIsReady(ajax) {
      return ajax.readyState === 4 && ajax.status === 200;
    }

    function handleResponseToObject(ajax) {
      const responseJson = JSON.parse(ajax.responseText);
      return responseJson[0].name ? addNameAndPhone(responseJson) : addTable(responseJson);
    }

    function addNameAndPhone(infoEmpresa) {
      $nome.innerHTML = infoEmpresa[0].name;
      $telefone.innerHTML = infoEmpresa[0].phone;
    }

    function addListenerToCreateButton() {
      $buttonCreate.addEventListener('click', () => {
        const ajaxPost = new XMLHttpRequest();
        ajaxPost.open('POST', 'http://localhost:3000/car');
        ajaxPost.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        ajaxPost.send(`imagem=${$imagem.value}&marca=${$marca.value}&ano=${$ano.value}&placa=${$placa.value}&cor=${$cor.value}`);
      });
    }

    function createFragment(item) {
      const $fragment = doc.createDocumentFragment();
      return $fragment.appendChild(createAndFillTableRow(item));
    }

    function createAndFillTableRow(value) {
      const $tr = doc.createElement('tr');
      $tr.appendChild(createImg(value.imagem));
      arrForm.map((item) => $tr.appendChild(createTd(item, value)));
      $tr.appendChild(createButtonRemove());
      return $tr;
    }

    function createTd(item, value = '') {
      const $td = doc.createElement('td');
      (arrForm.indexOf(item) === -1)
        ? $td.appendChild(item)
        : $td.appendChild(doc.createTextNode(value[item]));
      return $td;
    }

    function createImg(imagem) {
      const $img = doc.createElement('img');
      $img.src = imagem;
      return createTd($img);
    }

    function createButtonRemove() {
      const $buttonRemove = doc.createElement('button');
      const $contentButtonRemove = doc.createTextNode('Remover');
      $buttonRemove.appendChild($contentButtonRemove);
      removeRow($buttonRemove);
      deleteCar($buttonRemove);
      return createTd($buttonRemove);
    }

    function removeRow($buttonRemove) {
      $buttonRemove.addEventListener('click', () => $tbody.removeChild($buttonRemove
        .parentElement.parentElement));
    }

    function deleteCar($buttonRemove) {
      $buttonRemove.addEventListener('click', () => {
        const placa = $buttonRemove.parentElement.previousElementSibling
          .previousElementSibling.textContent;
        const ajaxDel = new XMLHttpRequest();
        ajaxDel.open('DELETE', `http://localhost:3000/car/${placa}`);
        ajaxDel.send();
      });
    }

    return {
      init,
    };
  }

  app().init();
}(document));
