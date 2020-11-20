document.addEventListener('DOMContentLoaded', function() {
    add_toogle_start();
})

function add_toogle_start()
{
    var button = document.querySelector('#start')
    console.log(button)
    button.onclick = start_journey
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
    button.innerHTML = "Continue"
    button.onclick = choose_family
}

function choose_family() {
    var button = document.querySelector('#start')
    var narrator = document.querySelector('#narrator')
    var choices = document.querySelector('#choices')


    narrator.innerHTML = "Choose your family." 
    button.innerHTML = "This is my family!"
    //choices.innerHTML = `<select id="family"><option value="Muggle">Muggle</option><option value="Half-blood">Half-blood</option><option value="Pure-blood">Pure-blood</option></select>`
    choices.style.display = "block"

    button.onclick = blood_toogle
}

function blood_toogle()
{
    var button = document.querySelector('#start')
    var narrator = document.querySelector('#narrator')
    var choices = document.querySelector('#choices')

    var blood_choice = document.querySelector('#family')
    console.log(blood_choice)
    var blood = blood_choice.value
    console.log(blood)
    update_skill(['blood', blood])


    narrator.innerHTML = "Which subjects do you love most in Hogwart? (choose 3)"
    button.innerHTML = "I loved these subjects"
    choices.innerHTML = `<input type="checkbox" id="charms" class="subject" value="charms">
    <label for="charms"> Charms</label><br>
    <input type="checkbox" id="dada" class="subject" value="dada">
    <label for="dada"> Defence Against the Dark Arts</label><br>
    <input type="checkbox" id="flying" class="subject" value="flying">
    <label for="flying"> Flying</label><br>
    <input type="checkbox" id="herbology" class="subject" value="herbology">
    <label for="herbology"> Herbology</label><br>
    <input type="checkbox" id="potions" class="subject" value="potions">
    <label for="potions"> Potions</label><br>
    <input type="checkbox" id="transfiguration" class="subject" value="transfiguration">
    <label for="transfiguration"> Transfiguration</label><br>  `

    button.onclick = subjects_toogle
}

function subjects_toogle()
{
    var subjects = document.querySelectorAll('.subject')
    var counter = 0
    var checked_subjects = []
    subjects.forEach(item => {
        if (item.checked == true) {
            counter++
            checked_subjects.push(item.value)
        }
    })
    console.log(checked_subjects)
    console.log(counter)
    if (counter != 3) {
        alert("Choose exactly 3 subjects!")
    }

    else {
        subjects_skills(checked_subjects)
        var button = document.querySelector('#start')
        var narrator = document.querySelector('#narrator')
        var choices = document.querySelector('#choices')

        button.onclick = choose_house
        narrator.innerHTML = "In which house were you in Hogwart?"
        button.innerHTML = "This was my house!"
        choices.innerHTML = `<select id="house">
        <option value="Gryffindor">Gryffindor</option>
        <option value="Ravenclaw">Ravenclaw</option>
        <option value="Hufflepuff">Hufflepuff</option>
        <option value="Slytherin">Slytherin</option>
        </select>`

    }  
}

function choose_house()
{
    var house_choice = document.querySelector("#house")
    var house = house_choice.value

    update_skill(['house', house])


}

async function subjects_skills(subjects){
    skill_to_update = []
    for (const item of subjects) {
        if (item === "charms"){
            skill_to_update.push(["charms", 10])
        }
        else if (item === "dada"){
            skill_to_update.push(["defence", 5])
            skill_to_update.push(["charms", 5])
        }
        else if (item === "flying"){
            skill_to_update.push(["hp", 5])
            skill_to_update.push(["defence", 5])
        }
        else if (item === "herbology"){
            skill_to_update.push(["hp", 5])
            skill_to_update.push(["potions", 5])
        }
        else if (item === "potions"){
            skill_to_update.push(["potions", 10])
        }
        else if (item === "transfiguration"){
            skill_to_update.push(["transfiguration", 10])
        }
    }

    for (const item of skill_to_update) {
        const result = await update_skill(item)
        console.log(result)
    }
}

async function update_skill(skills) {
    
    await fetch('/update_skill', {
            method: "PUT",
            body: JSON.stringify({
                skill: skills[0],
                value: skills[1]
            })
        })
        .then(response => response.json())
        .then(data => {
            var new_value = data.value
            var field = document.querySelector(`#${skills[0]}-value`)
            field.innerHTML = new_value
        })
}