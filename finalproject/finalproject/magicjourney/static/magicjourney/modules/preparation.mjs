import {house_toogle, subjects_toogle, blood_toogle, player_location, button, narrator, choices} from '../script.js'
import {get_story, back_to_journey, update_story} from './story_status.mjs'
import {update_skill} from './skills.mjs'


function prepare_to_expedition()
{
    update_story(prepare_to_expedition.name)
    narrator.style.display = 'block'
    choices.style.display = 'block'
    get_story(prepare_to_expedition.name, narrator)
    choices.innerHTML =`<button id="train-charms" onclick="train_skill(this)" data-skill="charms">Train charms</button>
                        <button id="train-transfiguration" onclick="train_skill(this)" data-skill="transfiguration">Train transfiguration</button>
                        <button id="train-flying" onclick="train_skill(this)" data-skill="flying">Train flying</button>
                        <button id="learn-charm" onclick="learn_charm()">Learn charm from equiped book</button>`
    button.innerHTML = "Go to expedition!"
    
}

function train_skill(train_button){
    var skill = train_button.getAttribute("data-skill")
    if (skill === "flying"){
        skill = "hp"
    }
    narrator.innerHTML = `This training give you 5 points of ${skill}!`
    choices.innerHTML = `<button id="train-charms" onclick="train(this)" data-skill="${skill}">Train!</button>`
    button.innerHTML = "Back"
    button.onclick = prepare_to_expedition
}

function train(train_button){
    var skill = train_button.getAttribute("data-skill")
    console.log(skill)
    update_skill([skill, 5])
}

function learn_charm(){
    fetch('/get_book')
    .then(response => response.json())
    .then(data => {
        var status = data.status
        if (!status) {
            var message = data.message
            alert(message)
        }
        else {
            var charms = data.charms
            var name = data.book_name
            books_charms(name,charms)
        }
    })
}

function books_charms(name, charms){
    narrator.innerHTML = `Charms you can learn from book ${name}:`
    var table = document.querySelector("#table")
    table.style.display = 'block'
    charms.forEach(charm => { 
        var row = table.insertRow()  
        for (var i = 0; i < charm.length; i++){
            var cell = row.insertCell()
            cell.innerHTML = charm[i]
        }
        var cell = row.insertCell()
        cell.innerHTML = `<button onclick="buy_item(this)" data-charm="${charm}">Learn</a>`

    })

}


export {prepare_to_expedition, train_skill, train, learn_charm}