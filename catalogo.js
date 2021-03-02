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
    let carValues = [];
    let isUpdate = false;
    let idCar;

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
      carValues = responseJson;
      return responseJson[0].name ? addNameAndPhone(responseJson) : addTable(responseJson);
    }

    function addNameAndPhone(infoEmpresa) {
      $nome.innerHTML = infoEmpresa[0].name;
      $telefone.innerHTML = infoEmpresa[0].phone;
    }

    function addListenerToCreateButton() {
      // eslint-disable-next-line consistent-return
      $buttonCreate.addEventListener('click', () => {
        if (isUpdate) {
          isUpdate = false;
          return updateValueCar();
        }
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
      const tdAction = createButtonRemove();
      tdAction.appendChild(createButtonUpdate());
      $tr.appendChild(tdAction);
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

    function createButtonUpdate() {
      const $buttonUpdate = doc.createElement('button');
      const $contentButtonUpdate = doc.createTextNode('Atualizar');
      $buttonUpdate.appendChild($contentButtonUpdate);
      getCarValue($buttonUpdate);
      return $buttonUpdate;
    }

    function getCarValue($buttonUpdate) {
      $buttonUpdate.addEventListener('click',
        () => {
          const placa = $buttonUpdate.parentElement.previousElementSibling
            .previousElementSibling.textContent;
          const carAtual = carValues.find((car) => car.placa === placa);
          isUpdate = true;
          clearInput();
          idCar = carAtual.id;
          updateValuesOnTheInput(carAtual);
        });
    }

    function updateValuesOnTheInput(carAtual) {
      const {
        imagem, marca, ano, placa, cor,
      } = carAtual;
      $imagem.value = imagem;
      $marca.value = marca;
      $ano.value = ano;
      $placa.value = placa;
      $cor.value = cor;
      $buttonCreate.innerHTML = 'Atualizar';
    }

    function clearInput() {
      const $buttonClear = doc.querySelector('[data-js="buttonClear"]');
      $buttonClear.removeAttribute('id');
      $buttonClear.addEventListener('click', () => {
        if (isUpdate) {
          $imagem.value = '';
          $marca.value = '';
          $ano.value = '';
          $placa.value = '';
          $cor.value = '';
        }
      });
      isUpdate = false;
    }

    function updateValueCar() {
      const ajaxPut = new XMLHttpRequest();
      ajaxPut.open('PUT', `http://localhost:3000/car/${idCar}`);
      ajaxPut.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      ajaxPut.send(`imagem=${$imagem.value}&marca=${$marca.value}&ano=${$ano.value}&placa=${$placa.value}&cor=${$cor.value}`);
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
