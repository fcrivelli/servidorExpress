const express = require('express');
const PORT = 8080;
const api = express();
api.use(express.json());
api.use(express.urlencoded({extended: true}));

var indice = 0;
var mapProduct = new Map();
const msjProductNotFound = {error: "producto no encontrado"}
const msjProductsNotCharge = {error: "no hay productos cargados"}
const msjError = {error: "error en la petición"}
const msjSave = { success: "producto fue guardado"}


api.get('/api/productos/listar', (req, res) => {
    if(indice == 0){
        res.status(400).send(msjProductsNotCharge);
    } else {
        res.send(getProducts());
    }
});

api.get('/api/productos/listar/:id', (req, res) => {
    if(!validateId(req.params.id)){
        res.status(400).send(msjProductNotFound);
    } else {
        res.send({
            id: req.params.id,
            product: getProductById(req.params.id)
        });
    }
});

api.post('/api/productos/guardar', (req, res) => {
    if(!validateBody(req.body)){
        res.status(400).send(msjError);
    } else {
        saveProduct(req.body);
        res.send(msjSave);
    }
});

api.listen(PORT, function() {
    console.log("My HTTP server listening on port " + PORT + "...");
});

function saveProduct(product) {
    mapProduct[indice] = product;
    indice++;
}

function getProductById(key){
    return mapProduct[key];
}

function getProducts(){
    var listProduct = [];
    Object.keys(mapProduct).forEach((key) => {
        listProduct.push({
            id: key,
            title: mapProduct[key].title,
            price: mapProduct[key].price,
            thumbnail: mapProduct[key].thumbnail
        });
    });
    return listProduct;
}

function validateBody (product){
    return product != null;
}

function validateId(id){
    return id && mapProduct[id];
}