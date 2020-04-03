const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1'); 
const messageTwo = document.querySelector('#message-2');
const btnLocation = document.querySelector('#btn-location')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = search.value;

    loadingMessage()
    
    const promiseData = fetch(`/weather?address=${location}`)
    display(promiseData)
});

btnLocation.addEventListener('click', (e) => {
    e.preventDefault()

    loadingMessage()

    navigator.geolocation.getCurrentPosition(({ coords },error) => {
        if(!error){
            const promiseData = fetch(`/weatherFromCurrentLocation?latitude=${coords.latitude}&longitude=${coords.longitude}`)
            display(promiseData)
        }
    })
})

// fetch promise management
const display = (promiseData) => {
    promiseData.then((response) => {
        response.json().then((data) => {
            if(data.error) {
                messageOne.textContent = data.error;
            } else{
                messageOne.textContent = data.location;
                messageTwo.textContent = data.forecast;
            }
        });
    });
}

// message temporaire en attendant de recevoir les infos de la fonction asyc fetch()
const loadingMessage = () => {
    messageOne.textContent = "Loading...";
    messageTwo.textContent = "";
}
