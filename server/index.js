const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const cars = [{
  id: 1,
  imagem: 'https://quatrorodas.abril.com.br/wp-content/uploads/2019/03/vw-gol-bc3a1sico.jpg?quality=70&strip=info',
  marca: 'Gol',
  ano: '2021',
  placa: 'GOL-1254',
  cor: 'Branco',
},
{
  id: 2,
  imagem: 'https://quatrorodas.abril.com.br/wp-content/uploads/2018/05/gol_e_voyage_2019__9_-e1526935241764.jpg?quality=70&strip=info',
  marca: 'Voyage',
  ano: '2021',
  placa: 'VOY-0934',
  cor: 'Prata',
}];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

function validateFields(req, res, next) {
  const {
    imagem, marca, ano, placa, cor,
  } = req.body;

  const infoCarro = [imagem, marca, ano, placa, cor];

  const hasValueEmpty = infoCarro.some((item) => item === '');
  if (hasValueEmpty) { return; }

  next();
}

app.get('/car', (req, res) => {
  res.json(cars);
});

app.post('/car', validateFields, (req) => {
  const {
    imagem, marca, ano, placa, cor,
  } = req.body;
  const id = Date.now();

  const hasCar = cars.some((car) => car.placa === placa);
  if (hasCar) { return; }

  cars.push({
    id,
    imagem,
    marca,
    ano,
    placa,
    cor,
  });
});

app.put('/car/:id', validateFields, (req) => {
  const { id } = req.params;
  const {
    imagem, marca, ano, placa, cor,
  } = req.body;

  const carId = cars.findIndex((car) => car.id === Number(id));
  cars[carId] = {
    id,
    imagem,
    marca,
    ano,
    placa,
    cor,
  };
});

app.delete('/car/:placa', (req) => {
  const { placa } = req.params;
  const delIndex = cars.filter((item) => item.placa === placa);
  cars.splice(cars.indexOf(delIndex[0]), 1);
});

app.listen(3000);
