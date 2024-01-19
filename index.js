import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-fca1c-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const addButtonEl = document.getElementById("add-button")
const inputFieldEl = document.getElementById("input-field")
const shoppingListEl = document.getElementById("shopping-list")
const tipEl = document.getElementById("tip")


addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    
    if(inputValue === "") {
        addButtonEl.disable = true
    }else {
        push(shoppingListInDB, inputValue)
        clearInputField(inputFieldEl)
    }
})

onValue(shoppingListInDB, function(snapshot) {
    
    if(snapshot.exists()) {
        let shoppingListArray = Object.entries(snapshot.val()) 

        clearShoppingListEl()
        for(let i = 0; i < shoppingListArray.length; ++i) {
            let currentItem = shoppingListArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]

            addShoppingiItem(currentItem)
        }
        tipEl.innerHTML = "Click supply to delete"
    } else {
        shoppingListEl.innerHTML = "No supplies here... yet"
        tipEl.innerHTML = ""
    }
})

function clearInputField(inputField) {
    inputField.value = ""
}

function addShoppingiItem(shoppingItem) {
    let shoppingItemID = shoppingItem[0]
    let shoppingItemValue = shoppingItem[1]
    let newEl = document.createElement("li")

    newEl.textContent = shoppingItemValue

    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${shoppingItemID}`)
        remove(exactLocationOfItemInDB)
    })

    shoppingListEl.append(newEl)
}

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}
