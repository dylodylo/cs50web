document.addEventListener('DOMContentLoaded', function() {
    button = document.querySelector('#start')
    narrator = document.querySelector('#narrator')
    card = document.querySelector('.player-card')
    choices = document.querySelector('#choices')
    player_location = document.querySelector('#location')
    if (button != null){
        add_toogle_start();
    }
        
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
    player_location.innerHTML = "Home"
    get_story(getFuncName(), narrator)
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
    get_story(getFuncName(), narrator)
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
    get_story(getFuncName(), narrator)
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
    narrator.style.display = 'block'
    choices.style.display = 'none'
    get_story(getFuncName(), narrator)
    button.innerHTML = "Go to Diagon Alley"
    button.onclick = diagon_alley
    console.log(button.innerHTML)
}


function diagon_alley(){
    update_story(getFuncName())
    button.innerHTML = "Prepare to expedition"
    document.querySelector('#items-table').style.display = 'none'
    console.log(button.innerHTML)
    button.onclick = () => alert("Function not implemented yet!")
    console.log(button)
    player_location.innerHTML = "Diagon Alley"
    get_story(getFuncName(), narrator)
    narrator.style.display = 'block'
    choices.innerHTML = `<button id="ollivanders" onclick="ollivanders()">Go to Ollivanders</button>
    <button id="malkin" onclick="malkin()">Go to Madam Malkin's Robes for All Occasions</button>
    <button id="apothecary" onclick="apothecary()">Go to Apothecary</button>
    <button id="bookstore" onclick="bookstore()">Whizz Hard Books</button>`
    choices.style.display = "block"

}

function malkin(){
    player_location.innerHTML = "Madam Malkin's Robes for All Occasions"
    choices.style.display = 'none'
    get_story(getFuncName(), narrator)
    item_table("Robe")
    button.innerHTML = "Go back to Diagon Alley"
    button.onclick = diagon_alley

}

function item_table(model_name, ){
    var url = new URL('http://127.0.0.1:8000/get_all_items')
    var params = {model:model_name}
    var table = document.querySelector("#items-table")
    table.innerHTML = ''
    table.style.display = 'block'
    url.search = new URLSearchParams(params).toString()
    fetch(url)
    .then(response => response.json())
    .then(element => {
        fields = element[1]
        items = element[0]
        var table_columns = document.createElement("tr")
        console.log(items)
        fields.forEach(field => {
            if (field != "Id"){
                var new_column = document.createElement("th")
                new_column.innerHTML = field
                table.append(new_column)
            }
        })
        items.forEach(item => {
            var row = table.insertRow()
            
            for (var i = 1; i < item.length; i++){
                var cell = row.insertCell()
                cell.innerHTML = item[i]
            }
            var cell = row.insertCell()
            cell.innerHTML = `<button onclick="buy_item(this)" data-id="${item[0]}" data-model="${model_name}">Buy</a>`
        })
    
    })
}


async function buy_item(button){
    item_id = button.getAttribute('data-id')
    model = button.getAttribute('data-model')
    await fetch('/buy_item', {
        method: "PUT",
        body: JSON.stringify({
            item_id: item_id,
            model_name: model
        })
    })
    .then(response => {
        console.log(response.status)
        if (response.status === 304){
            alert("You already have this!")
            response.json()
            alert(data.message)
        }

        else if(response.status === 201){
            alert("You bought item!")
            //here get story for narrator
            narrator.innerHTML = `You bought ${model}! You are almost ready for expedition!`
        }
    })
}

function get_story(func_name, narrator)
{
    var url = new URL('http://127.0.0.1:8000/get_story')
    var params = {function_name:func_name}
    url.search = new URLSearchParams(params).toString()
    fetch(url)
    .then(response => response.json())
    .then(data => {
        story = data.story
        narrator.innerHTML = story
    })
}

function ollivanders(){
    choices.style.display = 'none'
    player_location.innerHTML = "Ollivanders"
    get_story(getFuncName(), narrator)
    item_table("Wand")
    button.innerHTML = "Go back to Diagon Alley"
    button.onclick = diagon_alley
}

function apothecary(){
    choices.style.display = 'none'
    player_location.innerHTML = "Apothecary"
    get_story(getFuncName(), narrator)
    button.innerHTML = "Go back to Diagon Alley"
    button.onclick = diagon_alley
}

function bookstore(){
    choices.style.display = 'none'
    player_location.innerHTML = "Whizz Hard Books"
    get_story(getFuncName(), narrator)
    item_table("Book")
    button.innerHTML = "Go back to Diagon Alley"
    button.onclick = diagon_alley
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
            await update_skill(['charisma', 10])
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

async function equip(button)
{
    itemId = button.getAttribute("data-item")
    category = button.getAttribute("data-category")
    console.log(itemId)
    console.log(category)
    await fetch('/change_equipment', {
        method: "PUT",
        body: JSON.stringify({
            category: category,
            item: itemId
        })
    })
    .then(response => response.json())
    .then((data) => {
        var item = data.item
        document.querySelector(`#players-${category.toLowerCase()}`).innerHTML = item
    })
    location.reload()
}

async function unequip(button)
{
    item = button.getAttribute("data-item")
    await fetch('/unequip', {
        method: "PUT",
        body: JSON.stringify({
            item: item
        })
    })
    .then(response => response.json())
    location.reload()
}