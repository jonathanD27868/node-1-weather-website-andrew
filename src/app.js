/*
git hub initialisation:

Après avoir créé les clés ssh (id_rsa.pub et id_rsa) et le repository node-1-weather-website-andrew dans github:

1- Ajouter sa clé ssh (id_rsa.pub) dans les settings pour transférer les fichiers
2- git remote add origin https://github.com/jonathanD27868/node-1-weather-website-andrew.git => set origin vers le repository désiré
2-bis- git remote set-url origin https://github.com/jonathanD27868/weather-website-andrew.git => set-url permet de modifier l'url du repository désiré
3- git push -u origin master => enregistre le flux de donné vers le repository (-u option) et envoie le projet sur github


Heroku initialisation:

1- heroku login => connection vers siteweb pour authentification (press space key)
2- heroku keys:add => ajoute les clés ssh pour transfert sécurisé
3- heroku create d27868-node-1-weather-andrew => crée le projet avec le nom "d27868-node-1-weather-andrew" qui servira dans l'url (choisir un nom unique POUR TOUS LES USERS!!! je commence mes sites par d27868-...)
4- git push heroku master => transfère de github à heroku
5- heroku logs => affiche le log, utile en cas de problème



modif project to git, github & Heroku

Après avoir modifié notre projet:

1- git status => affiche l'état des fichiers modifiés
2- git add . => ajoute tous les fichiers modifiés
3- git commit -m "description des modifs" => enregistre les modifs!
4- git push (= git push origin master) => envoie le tout vers github
5- git remote => affiche les connexions distantes (ici heroku et origin)
6- git push heroku master => transfère de github à heroku


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
        name: 'Jonathan D'
    });
});

app.get('/about', (req, res) => {
    res.render('about',{
        title: 'About Me',
        name: 'Jonathan D'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Jonathan D'
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
        name: 'Jonathan D'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        errorText: "Page not found.",
        title: "404",
        name: 'Jonathan D'
    });
});

app.listen(port , () => {
    console.log("Server is up on port " + port);
});
