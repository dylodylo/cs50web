import {house_toogle, subjects_toogle, blood_toogle, player_location, button, narrator, choices} from '../script.js'
import {get_story, back_to_journey, update_story} from './story_status.mjs'
import {diagon_alley} from './diagon_alley.mjs'

function start_journey(button, narrator, card) {
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
            narrator.innerHTML = "This is start of great journey!"
            narrator.style.display = 'block'
            card.style.display = 'block'
            button.innerHTML = "Continue"
            button.onclick = choose_family
        }
    })
}


function choose_family() {
    update_story(choose_family.name)
    player_location.innerHTML = "Home"
    get_story(choose_family.name, narrator)
    narrator.style.display = 'block'
    button.innerHTML = "This is my family!"
    choices.innerHTML = `<select id="family">
    <option value="Muggle">Muggle</option>
    <option value="Half-blood">Half-blood</option>
    <option value="Pure-blood">Pure-blood</option>
    </select>`
    choices.style.display = "block"
    button.onclick = blood_toogle
}


function choose_subjects(){
    update_story(choose_subjects.name)

    narrator.style.display = 'block'
    choices.style.display = 'block'
    get_story(choose_subjects.name, narrator)
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

function choose_house() {
    update_story(choose_house.name)

    narrator.style.display = "block"
    choices.style.display = "block"
    button.onclick = house_toogle
    get_story(choose_house.name, narrator)
    button.innerHTML = "This was my house!"
    choices.innerHTML = `<select id="house">
    <option value="Gryffindor">Gryffindor</option>
    <option value="Ravenclaw">Ravenclaw</option>
    <option value="Hufflepuff">Hufflepuff</option>
    <option value="Slytherin">Slytherin</option>
    </select>`
}

function intro_story()
{
    update_story(intro_story.name)
    narrator.style.display = 'block'
    choices.style.display = 'none'
    get_story(intro_story.name, narrator)
    button.innerHTML = "Go to Diagon Alley"
    button.onclick = diagon_alley
    console.log(button.innerHTML)
}

export {start_journey, choose_family, choose_subjects, choose_house, intro_story}