document.addEventListener('DOMContentLoaded', function() {
    add_toogle_start();
})

function add_toogle_start()
{
    var start_button = document.querySelector('#start')
    console.log(start_button)
    start_button.addEventListener("click", () => {
        start_journey()
    })
}

function start_journey() {
    var narrator = document.querySelector('#narrator')
    var card = document.querySelector('.player-card')
    console.log(narrator)
    //crete new Player model
    fetch('/create_player', {
        method: "PUT"
    })
    .then(response => response.json())


    narrator.innerHTML = "This is start of great journey!"
    narrator.style.display = 'block'
    card.style.display = 'block'
}