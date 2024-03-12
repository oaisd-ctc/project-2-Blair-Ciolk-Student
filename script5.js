const mealDiv = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
var savedMeals = JSON.parse(localStorage.getItem('savedMealRecipe')) || [];


mealDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-recipe-btn')) {
        const mealIdToRemove = e.target.closest('.meal-item').dataset.id;
        removeSavedMeal(mealIdToRemove);
    }
    else if (e.target.classList.contains('recipe-btn')) {
        const mealIdToShow = e.target.parentElment.parentElement.dataset.id;
        getMealRecipe(mealIdToShow)
    }
})

function checkNullValues(savedMeals) {
    var filteredMeals = savedMeals.filter(meal => {
        // Check if any property of the meal is null
        for (let key in savedMeals) {
          if (meal === null) {
            return false; // Return false to exclude this meal
          }
          // Check if any element of ingredients array is null
          if (Array.isArray(meal[key])) {
            if (meal[key].some(item => item === null)) {
              return false; // Return false to exclude this meal
            }
          }
        }
        return true; // Return true to include this meal
      });
    
      return filteredMeals;
}

window.onload = function () {
    displaySavedMeals();
}

function removeSavedMeal(mealId) {
    var savedItemsHaveNull = checkNullValues(savedMeals);
    if(!savedItemsHaveNull){
        savedMeals = savedMeals.filter(meal => meal.id !== Number(mealId));
    
        localStorage.setItem("savedMealRecipe", JSON.stringify(savedMeals));
    
    
        for (let i = 0; i < mealDiv.children.length; i++) {
            let child = mealDiv.children[i];
            let dataId = child.getAttribute('data-id');
            if (dataId === mealId) {
                mealDiv.removeChild(child);
                break;
            }
        }
        // displaySavedMeals();
        
    }

}

const mealList = document.getElementById('meal');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

recipeCloseBtn.addEventListener('click', (e) => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
    const selectRecipe = $("div.meal-item[data-active-meal=true]");
    selectRecipe.removeAttr("data-active-meal");
});

function saveMealRecipe(meal) {
    var textFile = null,
        makeTextFile = function (text) {
            var data = new Blob([text], { type: 'text/plain' });

            if (textFile != null) {
                window.URL.revokeObjectURL(textFile);
            }
            textFile = window.URL.createObjectURL(data);

            return textFile;
        };
    console.log(textFile);
    if (typeof (Storage) === "undefined") {
        // Check if meal already exists in savedMeals
        const existingMeal = savedMeals.find(savedMeal => savedMeal.id === meal.id);
        if (!existingMeal) {
            // Add the new meal to savedMeals
            savedMeals.push(meal);
            // Update localStorage with the updated savedMeals
            localStorage.setItem("savedMealRecipe", JSON.stringify(savedMeals));
            // Display the updated saved meals
            displaySavedMeals();
            alert("Meal saved successfully!");
        } else {
            alert("This meal is already saved!");
        }
    } else {
        window.alert("Error: Local storage not supported. Please use a different browser.");
    }
}

function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=7c24c5f6779b417a8c7f91021d764914&ingredients=${searchInputTxt}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

        })
        .catch(error => {
            let unsafeHttpError = `<p style="color: white";>${error}</p>`;
            let safeHttpE = escapeHTML(unsafeHttpError);
            mealList.innerHTML += safeHttpE;
            // console.error(error);
        });
}



function displaySavedMeals() {
    let html = "";


    if (savedMeals != null) {
        savedMeals.forEach(r => {
            if (r  != null) {
                var result = r;

                html += `
               <div class="meal-item" data-id="${result.id}" data-title="${result.title}">
               <div class="meal-img">
               <img src="${result.image}" alt="food">
               </div>
               <div class="meal-name">
               <h3>${result.title}</h3>
               <a href="#" class="recipe-btn">Get Recipe</a>
               <a href="#" class="remove-recipe-btn">Remove</a>
               </div>
               </div>`;

                mealDiv.innerHTML = html;
            }

        });
    }
    else {
        for (let i = 0; i < mealDiv.children.length; i++) {
            let child = mealDiv.children[i];
            let dataId = child.getAttribute('data-id');
            if (dataId === mealId) {
                savedMeals = savedMeals.filter(meal => meal.id !== mealId);
                localStorage.setItem("savedMealRecipe", JSON.stringify(savedMeals));
                mealDiv.removeChild(child);
                break;
            }
        }
    }

    if (savedMeals.length === 0) {
        alert("no favorites");
    }
}
function getMealRecipe(mealId) {
    fetch(`https://api.spoonacular.com/recipes/${mealId}/information?apiKey=7c24c5f6779b417a8c7f91021d764914&includeNutrition=false`)
        .then(response => response.json())
        .then(data => {
            mealRecipeModal(data);
        })
        .catch(error => {
            console.error("error fetching meal recipe: ", error);
        })
}
function escapeHTML(unsafe) {
    return DOMPurify.sanitize(unsafe);
}

function mealRecipeModal(meal) {
    //console.log(meal);
    let mealItemTitle = meal.title;
    //console.log(mealItemTitle);


    if (meal.dishTypes[0].length == 0) {
        if (meal.cuisines) {
            let altName = linearSearchForCuisines(meal);
            //let mealCategory = meal.cuisines[0].charAt(0).toUpperCase() + meal.cuisines[0].slice(1);
            if (meal.vegan == true) {
                mealVegan = "True";
            }
            else {
                mealVegan = "False";
            }
            mealInstructions = meal.instructions;
            let html = `
            <h2 class="recipe-title">${mealItemTitle}</h2>
            <div class="recipe-meal-img">
                <img src="${meal.image}" alt="">
                </div>
            <h3 class="recipe-sub">Information</h3>
            <p class="recipe-category">${altName}</p>
            <h3 class="recipe-sub">Prep Time</h3>
            <p class="recipe-isVegan">${meal.readyInMinutes}</p>
            <h3 class="recipe-sub">Vegan?</h3>
            <p class="recipe-isVegan">${mealVegan}</p>
            <div class="recipe-instruct">
            <h3>Summary</h3>
            <p>${meal.summary}</p>
            </div>
            <div class="recipe-instruct">
                <h3>Instructions:</h3>
                <p>${mealInstructions}</p>
            </div>
            <div class="recipe-link">
                <a href="${meal.sourceUrl}" target="_blank">Source</a>
            </div>
            `;

            let sanitizedInput = escapeHTML(html);
            mealDetailsContent.innerHTML = sanitizedInput;
            mealDetailsContent.parentElement.classList.add('showRecipe');
        }


    }
    else {
        let mealCategory = meal.dishTypes[0].charAt(0).toUpperCase() + meal.dishTypes[0].slice(1);
        if (meal.vegan == true) {
            mealVegan = "True";
        }
        else {
            mealVegan = "False";
        }
        mealInstructions = meal.instructions;
        let html = `
        <h2 class="recipe-title">${mealItemTitle}</h2>
        <div class="recipe-meal-img">
            <img src="${meal.image}" alt="">
        </div>
        <h3 class="recipe-subInfo">Information</h3>
        <h3 class="recipe-sub">Prep Time</h3>
        <p class="recipe-isVegan">${meal.readyInMinutes} minutes</p>
        <h3 class="recipe-sub">Category</h3>
        <p class="recipe-category">${mealCategory}</p>
        <h3 class="recipe-sub">Vegan?</h3>
        <p class="recipe-isVegan">${mealVegan}</p>
        <div class="recipe-instruct">
            <h3>Summary</h3>
            <p>${meal.summary}</p>
        </div>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${mealInstructions}</p>
            
    
        </div>
        <div class="recipe-link">
            <a href="${meal.sourceUrl}" target="_blank">Source</a>
        </div>
        `;

        let sanitizedInput = escapeHTML(html);
        mealDetailsContent.innerHTML = sanitizedInput;
        mealDetailsContent.parentElement.classList.add('showRecipe');
    }

}

function linearSearchForCuisines(meal) {
    for (let key in meal) {
        if (key === 'cuisines') {
            if (key == !null) { return meal[key]; }
        }
        if (key === 'diets') {
            return meal.diets[0];
        }

    }
    return alert('Cuisines not found in meal object');
}

//www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata
//https://api.spoonacular.com/recipes/716429/information?apiKey=dRwhC4AYy0Zu67YNxqqXPrs9mr2FNITeeotbxFBa