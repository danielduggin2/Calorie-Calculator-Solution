const calorieCounter = document.getElementById("calorie-counter");
const budgetNumberInput = document.getElementById("budget");
const entryDropdown = document.getElementById("entry-dropdown");
const addEntryButton = document.getElementById("add-entry");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");

let isError = false;

function cleanInputString(str){
    // this is efficient but not for memory and runtime performance
    // const strArray = str.split('');
    // cleanStrArray = [];

    // for(let i = 0; i < strArray.length; i++){
    //     // return cleanStrArray[i];
    //     if(!["+", "-", " "].includes(strArray[i])){
    //         cleanStrArray.push(strArray[i]);
    //     }
    // }
    // In regex, shorthand character classes allow you to match specific characters without having to write those characters in your pattern.
    // Shorthand character classes are preceded with a backslash (\). The character class \s will match any whitespace character.
    const regex = /[+-\s]/g;
    return str.replace(regex, "");
}

// The e in a number input can also be an uppercase E. 
// Regex has a flag for this, however – the i flag, which stands for "insensitive".
// Number inputs only allow the e to occur between two digits. 
// To match any number, you can use the character class [0-9]
function isInvalidInput(str){
    // const regex = /[0-9]+e[0-9]+/i;
    // There is a shorthand character class to match any digit: \d
    const regex = /\d+e\d+/i;
    return str.match(regex);
}

function addEntry(){
    // const targetId = "#" + entryDropdown.value; we dont need this bc of template literals
    // targetInputContainer = document.querySelector(targetId + " .input-container");
    // template literal - interpolate variables directly within a string
    // variables passed with ${} to insert variable into the string
    // const targetInputContainer = document.querySelector(`${targetId} .input-container`);
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
    const HTMLString = `
        <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
        <input type="text" 
            placeholder="Name" 
            id="${entryDropdown.value}-${entryNumber}-name"
        />
        <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
        <input type="number" 
            min="0"
            placeholder="Calories"
            id="${entryDropdown.value}-${entryNumber}-calories"
        />`;
    // this line does not save entrties
    // targetInputContainer.innerHTML += HTMLString;
    targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
}

// after getCalsFromInputs func
function calculateCalories(e){
    e.preventDefault();
    isError = false;
    const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
    const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
    const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
    const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
    const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

    // call getCalsFromInp functinon
    const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
    const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
    const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
    const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
    const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
    // the reason we do line 80 is because we did getElementById which returns an element instead of a NodeList
    // NodeList: array-like so we can iterate through it
    // in getCalsFrom func, an array will work for the argument just as well as a NodeList
    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

    if(isError){
        return;
    }

    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
    const surplusOrDeficit = remainingCalories >= 0 ? 'Surplus' : 'Deficit';
    output.innerHTML = `
        <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
        <hr>
        <p>${budgetCalories}Calories Budgeted</p>
        <p>${consumedCalories} Calories Consumed</p>
        <p>${exerciseCalories} Calories Burned</p>
    `;

    output.classList.remove('hide');
}

function getCaloriesFromInputs(list){
    let calories = 0;
    // The NodeList values you will pass to list will consist of input elements.
    //  So you will want to look at the value attribute of each element.
    
    for (let i = 0; i < list.length; i++) {
    const currVal = cleanInputString(list[i].value);
    const invalidInputMatch = isInvalidInput(currVal);;

    // returns true or false. In js you can pass directly with no comparison
       if(invalidInputMatch){
        alert(`Invalid Input: ${invalidInputMatch[0]}`);
        isError = true;
        return null;
       }

       calories += Number(currVal);
    }
    return calories;
}

function clearForm(){
    // returns a NodeList
    // Array object has a .from() method that accepts an array-like and returns an array.
    // This is helpful when you want access to more robust array methods
    const inputContainers = Array.from(document.querySelectorAll(".input-container"));
    for(let i = 0; i < inputContainers.length; i++){
        inputContainers[i].innerHTML = '';
    }
    budgetNumberInput.value = '';
    // innerText will not render HTML elements but will display the tafs and content as raw text
    output.innerText = '';
    output.classList.add('hide');
}

addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);