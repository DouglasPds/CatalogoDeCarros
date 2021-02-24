const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const cars = [{
  imagem: 'https://quatrorodas.abril.com.br/wp-content/uploads/2019/03/vw-gol-bc3a1sico.jpg?quality=70&strip=info',
  marca: 'Gol',
  ano: '2021',
  placa: 'GOL-1254',
  cor: 'Branco',
},
{
  imagem: 'https://quatrorodas.abril.com.br/wp-content/uploads/2018/05/gol_e_voyage_2019__9_-e1526935241764.jpg?quality=70&strip=info',
  marca: 'Voyage',
  ano: '2021',
  placa: 'VOY-0934',
  cor: 'Prata',
}];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/car', (req, res) => {
  res.json(cars);
});

app.get('/car/:marca', (req, res) => {
  const { marca } = req.params;

  const hasCar = cars.some((car) => car.marca === marca);

  if (hasCar) {
    res.json(cars.filter((car) => car.marca === marca));
  }
});

app.post('/car', (req) => {
  const {
    imagem, marca, ano, placa, cor,
  } = req.body;

  const infoCarro = [imagem, marca, ano, placa, cor];

  const hasValueEmpty = infoCarro.some((item) => item === '');
  if (hasValueEmpty) { return; }

  const hasCar = cars.some((car) => car.placa === placa);
  if (hasCar) { return; }

  cars.push({
    imagem,
    marca,
    ano,
    placa,
    cor,
  });
});

app.delete('/car/:placa', (req) => {
  const { placa } = req.params;
  const delIndex = cars.filter((item) => item.placa === placa);
  cars.splice(cars.indexOf(delIndex[0]), 1);
});

app.listen(3000);
