'use strict';

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();

var cars = [{
  imagem: 'https://quatrorodas.abril.com.br/wp-content/uploads/2019/03/vw-gol-bc3a1sico.jpg?quality=70&strip=info',
  marca: 'Gol',
  ano: '2021',
  placa: 'GOL-1254',
  cor: 'Branco'
}, 
{
  imagem: 'https://quatrorodas.abril.com.br/wp-content/uploads/2018/05/gol_e_voyage_2019__9_-e1526935241764.jpg?quality=70&strip=info',
  marca: 'Voyage',
  ano: '2021',
  placa: 'VOY-0934',
  cor: 'Prata'
}];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/car', function(req, res) {
  res.json(cars);
})

app.get('/car/:marca', function(req, res) {
  var marca = req.params.marca;

  var hasCar = cars.some(function(car) {
    return car.marca === marca;
  })

  if(hasCar){
    res.json(cars.filter(function(car) {
      return car.marca === marca;
    }))
  }
})

app.post('/car', function(req, res) {
  var imagem = req.body.imagem;
  var marca = req.body.marca;
  var ano = req.body.ano;
  var placa = req.body.placa;
  var cor = req.body.cor;

  var hasCar = cars.some(function(car) {
    return car.marca === marca;
  })
  if(hasCar) {
    return res.json(cars); 
  }

  cars.push({
    imagem: imagem,
    marca: marca,
    ano: ano,
    placa: placa,
    cor: cor
  });
});

app.delete('/car/:placa', function(req, res) {
  var placa = req.params.placa;
  var delIndex = cars.filter(function(item) {
      return item.placa == placa;
  });
  console.log(placa);
  delIndex = delIndex[0];
  cars.splice(cars.indexOf(delIndex), 1);
})

app.listen(3000);