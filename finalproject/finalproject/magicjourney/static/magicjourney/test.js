function first_function (){
        document.addEventListener('DOMContentLoaded', function() {
            var button = document.querySelector('#start')
            var narrator = document.querySelector('#narrator')
            var card = document.querySelector('.player-card')
            //const choices = document.querySelector('#choices')
            var player_location = document.querySelector('#location')
            console.log(button)
            var ar = [button, narrator, card, player_location]
            console.log(ar)
            return ar
        
        })

    
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

export {diagon_alley, first_function}