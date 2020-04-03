/*

Ajout du bouton de localisation pour le navigateur


*/


const path = require('path');
const express = require('express');
const hbs = require('hbs');

const { geocode, geocodeLocation } = require('./utils/geocode');
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
    
    if(!address && !latitude1 && !longitude1){
        return res.send({
            error: "You must porvide an address or click on the button below to get your current location"
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
                location: location
            });
        });
    });
});

app.get('/weatherFromCurrentLocation', (req, res) => {
    const latitude = req.query.latitude
    const longitude = req.query.longitude

    if(!latitude && !longitude){
        return res.send({
            error: "Something went wrong, refresh the page and try again"
        });
    }

    geocodeLocation(latitude, longitude, (error, { location }) => {
        if(error){
            return res.send(error);
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send(error);
            }
            res.send({
                forecast: forecastData,
                location: location
            });
        });
    })
})

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
