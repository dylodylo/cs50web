document.addEventListener('DOMContentLoaded', function() {
    button = document.querySelector('#start')
    narrator = document.querySelector('#narrator')
    card = document.querySelector('.player-card')
    choices = document.querySelector('#choices')
    add_toogle_start();
})

function getFuncName() {
    return getFuncName.caller.name
}

async function update_story(func_name)
{
    await fetch('/save_story_status',{
        method: "PUT",
        body: JSON.stringify({
            function: func_name
        })
    })
}

function add_toogle_start()
{
    button.onclick = start_journey
}

function start_journey() {
    //crete new Player model
    fetch('/create_player', {
        method: "PUT"
    })
    .then(response => {
        status = response.status
        if (status == 202){
            back_to_journey()
        }
        else{
            var button = document.querySelector('#start')
            narrator.innerHTML = "This is start of great journey!"
            narrator.style.display = 'block'
            card.style.display = 'block'
            button.innerHTML = "Continue"
            button.onclick = choose_family
        }
        })
    }

    

function back_to_journey() {
    card.style.display = 'block'
    fetch('/get_story_status')
    .then(response=>response.json())
    .then(data => {
        var status = data.status
        window[status]()
        })
    
}

function choose_family() {
    update_story(getFuncName())
    
    narrator.innerHTML = "Choose your family." 
    button.innerHTML = "This is my family!"
    choices.innerHTML = `<select id="family">
    <option value="Muggle">Muggle</option>
    <option value="Half-blood">Half-blood</option>
    <option value="Pure-blood">Pure-blood</option>
    </select>`
    choices.style.display = "block"

    button.onclick = blood_toogle
}

function blood_toogle()
{
    var blood_choice = document.querySelector('#family')
    var blood = blood_choice.value
    update_skill(['blood', blood])
    choose_subjects()
}



function choose_subjects(){
    update_story(getFuncName())

    narrator.style.display = 'block'
    choices.style.display = 'block'
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
    if (counter != 3) {
        alert("Choose exactly 3 subjects!")
    }

    else {
        subjects_skills(checked_subjects)
        choose_house()

    }  
}

function choose_house() {
    update_story(getFuncName())

    narrator.style.display = "block"
    choices.style.display = "block"
    button.onclick = house_toogle
    narrator.innerHTML = "In which house were you in Hogwart?"
    button.innerHTML = "This was my house!"
    choices.innerHTML = `<select id="house">
    <option value="Gryffindor">Gryffindor</option>
    <option value="Ravenclaw">Ravenclaw</option>
    <option value="Hufflepuff">Hufflepuff</option>
    <option value="Slytherin">Slytherin</option>
    </select>`
}

function house_toogle()
{
    var house_choice = document.querySelector("#house")
    var house = house_choice.value

    house_skills(house)
    intro_story()
}

function intro_story()
{
    update_story(getFuncName())
    narrator.innerHTML = "Some intro story about summer after end of magic school, find book with treasures description. You want to go to London to prepere yourself"
    button.innerHTML = "Go to Diagon Alley"
}

async function house_skills(house){
    await update_skill(['house', house])
    switch (house) {
        case "Gryffindor":
            await update_skill(['transfiguration', 10])
            await update_skill(['charisma', 10])
            break
        
        case "Hufflepuff":
            await update_skill(['hp', 10])
            await update_skill(['herbology', 10])
            break

        case "Ravenclaw":
            await update_skill(['charms', 10])
            await update_skill(['defence', 10])

        case "Slytherin":
            await update_skill(['potions', 10])
            await update_skill(['hp', 10])
    }
}

async function subjects_skills(subjects){
    skill_to_update = []
    for (const item of subjects) {
        switch (item) {
            case "charms":
                skill_to_update.push(["charms", 10])
                break

            case "dada":
                skill_to_update.push(["defence", 5])
                skill_to_update.push(["charms", 5])
                break
            
            case "flying":
                skill_to_update.push(["hp", 5])
                skill_to_update.push(["defence", 5])
                break
            
            case "herbology":
                skill_to_update.push(["hp", 5])
                skill_to_update.push(["potions", 5])
                break
            
            case "potions":
                skill_to_update.push(["potions", 10])
                break
            
            case "transfiguration":
                skill_to_update.push(["transfiguration", 10])
                break
        }
    }

    for (const item of skill_to_update) {
        await update_skill(item)
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