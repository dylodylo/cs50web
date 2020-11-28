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
            var message = data.message
            if (!message){
                var new_value = data.value
                var field = document.querySelector(`#${skills[0]}-value`)
                field.innerHTML = new_value
            }
            else {
                alert(message)
            }
        })
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
    var skill_to_update = []
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

export {update_skill, house_skills, subjects_skills}