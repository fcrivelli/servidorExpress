const express = require('express');
const fs = require('fs'); 

const PORT = 8080;
const app = express();
const path = 'products.txt';

var visit1 = 0;
var visit2 = 0;

readFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, list) => {
        if (err) {
            reject(err);
        }
        var result = JSON.parse(list);
        resolve(result);
        });
    });
}

app.listen(PORT, function() {
    console.log("My HTTP server listening on port " + PORT + "...");
});

app.get('/items', function(req, res) {
    readFile(path).then( function (result) {
        visit1 = visit1 + 1;
        console.log({
            items: result,
            cantidad: result.length
        });
    }).catch((error) => {
        console.log("error on read file");
    });
});

app.get('/item-random', function(req, res) {
    readFile(path).then( function (result) {
        visit2 = visit2 + 1;
        console.log([...result].sort(() => (Math.random() > 0.5 ? 1 : -1)).slice(0, 1));
    }).catch((error) => {
        console.log("error on read file");
    });
});

app.get('/visitas', function(req, res) {
    readFile(path).then( function (result) {
        console.log({ visitas: {
            items: visit1,
            item: visit2   
        }});
    }).catch((error) => {
        console.log("error on read file");
    });
});