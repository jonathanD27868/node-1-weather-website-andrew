const request = require('request');

const forecast = (latitude, longitude, cb) => {
    const url = `https://api.darksky.net/forecast/${process.env.FORECAST_API_KEY}/${latitude},${longitude}?units=si&lang=en`;

    request({url, json: true}, (error, { body }) => {
        if(error){
            cb('Unable to connect to weather service!', undefined);
        } else if(body.error){
            cb('Unable to find location', undefined);
        } else{
            
            cb(undefined, `${body.daily.data[0].summary} It is currently ${body.currently.temperature} degrees out. The high today is ${body.daily.data[0].temperatureHigh}  with a low of ${body.daily.data[0].temperatureLow} There is a ${body.currently.precipProbability}% chance of rain.\nIcon to display: ${body.daily.data[0].icon}`);
        }
    });

};

module.exports = forecast;
