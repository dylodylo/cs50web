document.addEventListener('DOMContentLoaded', function() {
    add_toogle_start();
})

function add_toogle_start()
{
    var button = document.querySelector('#start')
    console.log(button)
    button.addEventListener("click", () => {
        start_journey()
    })
}

function start_journey() {
    var narrator = document.querySelector('#narrator')
    var card = document.querySelector('.player-card')
    //crete new Player model
    fetch('/create_player', {
        method: "PUT"
    })
    .then(response => response.json())

    var button = document.querySelector('#start')
    narrator.innerHTML = "This is start of great journey!"
    narrator.style.display = 'block'
    card.style.display = 'block'
    button.removeEventListener("click", start_journey)
    button.innerHTML = "Continue"
    button.addEventListener("click", () => {
        choose_family()
    })
}

function choose_family() {
    var button = document.querySelector('#start')
    var narrator = document.querySelector('#narrator')
    var choices = document.querySelector('#choices')

    button.removeEventListener("click", choose_family)


    narrator.innerHTML = "Choose your family." 
    button.innerHTML = "This is my family!"
    //choices.innerHTML = `<select id="family"><option value="Muggle">Muggle</option><option value="Half-blood">Half-blood</option><option value="Pure-blood">Pure-blood</option></select>`
    choices.style.display = "block"

    button.addEventListener("click", () => {
        blood_toogle()  
    })
}

function blood_toogle()
{
    var button = document.querySelector('#start')
    var narrator = document.querySelector('#narrator')
    var choices = document.querySelector('#choices')

    button.removeEventListener("click", blood_toogle)
    var blood_choice = document.querySelector('#family')
    console.log(blood_choice)
    var blood = blood_choice.value
    console.log(blood)
    blood_change(blood)


    // narrator.innerHTML = "Which subjects do you love most in Hogwart? (choose 3)"
    // button.innerHTML = "I loved these subjects"
    // choices.innerHTML = `<input type="checkbox" id="charms" value="Bike">
    // <label for="charms"> Charms</label><br>
    // <input type="checkbox" id="dada" value="Car">
    // <label for="dada"> Defence Against the Dark Arts</label><br>
    // <input type="checkbox" id="flying" value="Boat">
    // <label for="flying"> Flying</label><br>
    // <input type="checkbox" id="Herbology" value="Bike">
    // <label for="Herbology"> Herbology</label><br>
    // <input type="checkbox" id="Potions" value="Car">
    // <label for="Potions"> Potions</label><br>
    // <input type="checkbox" id="transfiguration" value="Boat">
    // <label for="transfiguration"> Transfiguration</label><br>  `

    // button.addEventListener("click", () => {
    //     subjects_toogle()
    // })
}

function subjects_toogle()
{
    var button = document.querySelector('#start')
    var narrator = document.querySelector('#narrator')
    var choices = document.querySelector('#choices')

    button.removeEventListener("click", subjects_toogle)
}

function blood_change(blood)
{
    fetch('/change_blood', {
        method: "PUT",
        body: JSON.stringify({
            blood: blood
        })
    })
    .then(response => response.json())
    var field = document.querySelector("#blood-value")
    field.innerHTML = blood
}

function update_skill(skill, value) {
    fetch('/update_skill', {
        method: "PUT",
        body: JSON.stringify({
            skill: skill,
            value: value
        })
    })
    .then(response => response.json())
    .then(data => {
        var new_value = data.value
        var field = document.querySelector(`#${skill}-value`)
        field.innerHTML = new_value
    })

}