/*
Heroku

dans package json: on à remplacé
    "start": "nodemon src/app.js -e js,hbs",
par
    "start": "node src/app.js",

// Ajout de variable pour le port d'écoute heroku et pour l'utililsation locale 3000:
    const port = process.env.PORT || 3000;

et on adapte app.listen:
    app.listen(port , () => {
        console.log("Server is up on port " + port));
    });

    ensuite il faut adapter le lien de la méthode fetch dans public/js/app.js pour qu'il fonctionne en locale et en production avec heroku:
    on passe de:
        `http://localhost:3000/weather?address=${location}`
    à:
        `/weather?address=${location}`


*/


const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// port d'écoute heroku:
const port = process.env.PORT || 3000;

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, '../templates/views'); 
const partialsPath = path.join(__dirname, '../templates/partials'); 

// setup view engine & view directory
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Andrew Mead'
    });
});

app.get('/about', (req, res) => {
    res.render('about',{
        title: 'About Me',
        name: 'Andrew Mead'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'John Doe'
    });
});

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: "You must provide a search term"
        });
    } 
    res.send({
        products: []
    });
});

app.get('/weather', (req, res) => {
    const address = req.query.address;

    if(!address){
        return res.send({
            error: "You must porvide an address"
        });
    }

    geocode(address, (error, {longitude, latitude, location} = {}) => {
        if(error){
            return res.send(error);
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send(error);
            }
            res.send({
                forecast: forecastData,
                location: location,
                address: address
            });
        });
    
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorText: "Help article not found.",
        title: "404",
        name: 'John Doe'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        errorText: "Page not found.",
        title: "404",
        name: 'John Doe'
    });
});

app.listen(port , () => {
    console.log("Server is up on port " + port);
});
