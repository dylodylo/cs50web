import {house_toogle, subjects_toogle, blood_toogle, player_location, button, narrator, choices} from '../script.js'
import {get_story, back_to_journey, update_story} from './story_status.mjs'
import {diagon_alley} from './diagon_alley.mjs'
import {update_skill} from './skills.mjs'

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

function start_expedition(){
    update_story(start_expedition.name)
    narrator.style.display = 'block'
    choices.style.display = 'none'
    get_story(start_expedition.name, narrator)
    button.innerHTML = "Start fight!"
    button.onclick = () => first_fight()
}


function first_fight(){
    var url = new URL('http://127.0.0.1:8000/get_creature')
    var params = {creature: "Hinkypunk"}
    url.search = new URLSearchParams(params).toString()
    fetch(url)
    .then(response => response.json())
    .then(data => {
        var params = data.params
        var xp = data.xp
        start_fight(params, xp)
    })
    var hp = document.querySelector("#creature-hp-value").innerHTML

}

function start_fight(params, xp){
    console.log(localStorage.getItem('fightStarted'))
    if (localStorage.getItem('fightStarted') === null){
        localStorage.setItem('fightStarted', true)
        document.querySelector("#creature-hp-value").innerHTML = params["HP"]
        var player_hp = document.querySelector("#hp-value").innerHTML
    }

    else {
        var player_hp = localStorage.getItem('player-hp')
        document.querySelector("#hp-value").innerHTML = player_hp
        document.querySelector("#creature-hp-value").innerHTML = localStorage.getItem('creature-hp')
    }
        var params = params
        var xp = xp
        var name = params["Name"]
        var attack = params["Attack"]
        var defence_t = params["Defence_t"]
        var defence_c = params["Defence_c"]
        var hp = params["HP"]
    

        document.querySelector("#creature-name-value").innerHTML = name
        document.querySelector("#creature-attack-value").innerHTML = attack
        document.querySelector("#creature-defence-charms-value").innerHTML = defence_c
        document.querySelector("#creature-defence-trans-value").innerHTML = defence_t
    
        document.querySelector("#creature").style.display = 'block'
    

        var player_defence = document.querySelector("#defence-value").innerHTML
        var player_charms = document.querySelector("#charms-value").innerHTML
        var player_transfiguration = document.querySelector("#transfiguration-value").innerHTML


    narrator.style.display = 'block'
    narrator.innerHTML = 'Choose action'
    choices.innerHTML = `
    <button onclick="battle('attack', ${player_charms}, ${defence_c})">Simple attack</button>
    <button onclick="battle('transfiguration', ${player_transfiguration})">Try transfigure</button>
    `
    choices.style.display = 'block'

}


function battle(action, value, defence){
    var player_hp = document.querySelector("#hp-value").innerHTML
    if (action === "attack"){
        if (value > defence){
            var attack_strength = value-defence
            var hp = document.querySelector("#creature-hp-value").innerHTML
            hp -= attack_strength
            localStorage.setItem('creature-hp', hp)
            if (hp<=0) {
                alert(`You attack with ${attack_strength} power. You kill the beast`)
                update_skill(["hp", player_hp])
                cave()
            }
            else {
                var attack = document.querySelector("#creature-attack-value").innerHTML
                var player_defence = document.querySelector("#defence-value").innerHTML    
                if (attack>player_defence){
                    var creature_attack_value = attack-player_defence
                    player_hp -= creature_attack_value
                    localStorage.setItem('player-hp', player_hp)
                }
                else {
                    var creature_attack_value = 0
                }
                if(player_hp<=0){
                    update_skill(["hp", player_hp])
                    game_over
                }
                else {
                    alert(`You attack with ${attack_strength} power. Beast has ${hp} hp left. Beast attack with ${creature_attack_value} power. You have ${player_hp} left`)
                    document.querySelector("#hp-value").innerHTML = player_hp
                    document.querySelector("#creature-hp-value").innerHTML = hp
                    start_fight
                }
            }
        }
    }
}

function game_over(){
    alert("You're dead!")
    update_story(game_over.name)
    narrator.style.display = 'block'
    choices.style.display = 'none'
    document.querySelector("#creature").style.display = 'none'
    get_story(game_over.name, narrator)
}

function cave(){
    update_story(cave.name)
    narrator.style.display = 'block'
    choices.style.display = 'none'
    document.querySelector("#creature").style.display = 'none'
    get_story(cave.name, narrator)
    button.innerHTML = "Not implemented yet"
}

export {start_journey, choose_family, choose_subjects, choose_house, intro_story, start_expedition, battle, cave}