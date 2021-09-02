var indice = 0;
var mapProduct = new Map();
const express = require('express');
const PORT = 8080;
const api = express();

const msjProductNotFound = {error: "producto no encontrado"}
const msjProductsNotCharge = {error: "no hay productos cargados"}
const msjError = {error: "error en la petición"}
const msjDelete = {success: "producto borrado"}
const msjSave = {success: "producto fue guardado"}

var workProducts = (function() {

    var saveProduct = function(product) {
        mapProduct[indice] = product;
        indice++;
    }

    var deleteProduct = function(product) {
        mapProduct.delete(product.id);
    }

    var updateProduct = function(product) {
        for (var [key, value] of mapProduct){
            if(key === product.id){
                value.title = product.title;
                value.price = product.price;
                value.thumbnail = product.thumbnail;
                break;
            }
        }
    }
    
    var getProductById = function(key) {
        return mapProduct[key];
    }
    
    var getProducts = function() {
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
    
    var validateBody = function (product) {
        return product != null;
    }
    
    var validateId = function (id) {
        return id && mapProduct[id];
    }

    return {
        saveProduct: saveProduct,
        getProductById: getProductById,
        getProducts: getProducts,
        validateBody: validateBody,
        validateId: validateId,
        updateProduct: updateProduct,
        deleteProduct: deleteProduct
    }

})();

api.engine('pug', require('pug').__express);
api.set('views', './views');
api.set('view engine','pug');
api.use(express.urlencoded({extended: true}));
api.use(express.static('public'));

api.get('/', (req, res) => {
    res.render("main.pug", { title: indice > 0? "Lista Productos" : "No hay productos", products: workProducts.getProducts(), listExists: indice > 0 });
})

api.post('/productos/guardar', (req, res) => {
    res.render("./layouts/addProduct", { title: "Agregar Producto"});
})

api.post('/productos/vista', (req, res) => {
    if(workProducts.validateBody(req.body)){
       workProducts.saveProduct(req.body);
    }
    res.render("main.pug", { title: indice > 0? "Lista Productos" : "No hay productos",  products: workProducts.getProducts(), listExists: indice > 0 });
})

api.get('/api/productos/listar', (req, res) => {
    if(indice == 0){
        res.status(400).send(msjProductsNotCharge);
    } else {
        res.send(workProducts.getProducts());
    }
});

api.get('/api/productos/listar/:id', (req, res) => {
    if(!workProducts.validateId(req.params.id)){
        res.status(400).send(msjProductNotFound);
    } else {
        res.send({
            id: req.params.id,
            product: workProducts.getProductById(req.params.id)
        });
    }
});

api.delete('/api/productos/borrar', (req, res) => {
    if(!workProducts.validateBody(req.body)){
        res.status(400).send(msjError);
    } else {
        workProducts.deleteProduct(req.body);
        res.send(msjDelete);
    }
});

api.put('/api/productos/actualizar', (req, res) => {
    if(!workProducts.validateBody(req.body)){
        res.status(400).send(msjError);
    } else {
        workProducts.updateProduct(req.body);
        res.send(msjSave);
    }
});

api.post('/api/productos/guardar', (req, res) => {
    if(!workProducts.validateBody(req.body)){
        res.status(400).send(msjError);
    } else {
        workProducts.saveProduct(req.body);
        res.send(msjSave);
    }
});

api.listen(PORT, err => {
    if(err) throw new Error(`Error en servidor ${err}`)
    console.log("My HTTP server listening on port " + PORT + "...");
});