const mealDiv = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const savedMeals = JSON.parse(localStorage.getItem('savedMealRecipe')) || [];


mealDiv.addEventListener('click', (e) => {
    if(e.target.id === 'remove-rcipie-btn') {
        const mealIdToRemove = e.target.parentElement.parentElement.dataset.id;
        removeSavedMeal(mealIdToRemove);
    }
    getMealRecipe(e);
});



window.onload = function () {
    let html = "";
    console.log(JSON.stringify(savedMeals));
    
    savedMeals.forEach(result => {
        html += `
        <div class="meal-item" data-id="${result.id}" data-title="${result.title}">
        <div class="meal-img">
        <img src="${result.image}" alt="food">
        </div>
        <div class="meal-name">
        <h3>${result.title}</h3>
        <a href="#" class="recipe-btn">Get Recipe</a>
        <a href="#" id="remove-rcipe-btn">Remove</a>
        </div>
        </div>`;
        
    });
    mealDiv.innerHTML = html;
    if(savedMeals.length === 0){
        alert("no favorites");
    }
}

function removeSavedMeal(mealId){
    savedMeals = savedMeals.filter(meal => meal.id !== mealId);
    localStorage.setItem("savedMealRecipe", JSON.stringify(savedMeals));

    let html = "";

    savedMeals.forEach(result=> { 
        html += `
        <div class="meal-item" data-id="${result.id}" data-title="${result.title}">
        <div class="meal-img">
            <img src="${result.image}" alt="food">
        </div>
        <div class="meal-name">
            <h3>${result.title}</h3>
            <a href="#" class="recipe-btn">Get Recipe</a>
            <a href="#" id="remove-rcipe-btn">Remove</a>
        </div>
    </div>`;
    });
    mealDiv.innerHTML = html;
    if(savedMeals.length === 0) {
        alert("no favorites");
    }


    
}

const mealList = document.getElementById('meal');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

recipeCloseBtn.addEventListener('click', (e) => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
    const selectRecipe = $("div.meal-item[data-active-meal=true]");
    selectRecipe.removeAttr("data-active-meal");
});

function saveMealRecipe(e)
{
    e.preventDefault();
    const activeMeal =  $("div.meal-item[data-active-meal=true]");
    // if (e.target.classList.contains('recipe-btn')) {
        var mealItemID = activeMeal.attr('id');
                //console.log(mealItem);
        fetch(`https://api.spoonacular.com/recipes/${mealItemID}/information?apiKey=7c24c5f6779b417a8c7f91021d764914&includeNutrition=false`)
            .then(response => response.json())
            .catch(error => alert(error))
            .then(data => { 
                if (typeof(Storage) !== "undefined"){
                    
                    savedMeals.push(data);
                    console.log(savedMeals);
                    localStorage.getItem("savedMealRecipe");
                    localStorage.setItem("savedMealRecipe", JSON.stringify(savedMeals));
                }
                else{
                    window.alert("error. local storage not supported. please use a different browser");
                }
                
            })
    // }
    
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
            let html = "";
            if (data.length > 0) {
                data.forEach(results => {
                    html += `
                        <div class="meal-item" data-id="${results.id}" data-title="${results.title}">
                            <div class="meal-img">
                                <img src="${results.image}" alt="food">
                            </div>
                            <div class="meal-name">
                                <h3>${results.title}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                                <a href="#" id="save-rcipe-btn">Save Recipe</a>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "No results";
                mealList.classList.add('notFound');
            }
            mealList.innerHTML = escapeHTML(html);
        })
        .catch(error => {
            let unsafeHttpError = `<p style="color: white";>${error}</p>`;
            let safeHttpE = escapeHTML(unsafeHttpError);
            mealList.innerHTML += safeHttpE;
            // console.error(error);
        });



}

function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        var mealItemID = e.target.parentElement.parentElement.getAttribute("data-id");
        //console.log(mealItem);
        fetch(`https://api.spoonacular.com/recipes/${mealItemID}/information?apiKey=7c24c5f6779b417a8c7f91021d764914&includeNutrition=false`)
            .then(response => response.json())
            .then(data => {
                mealRecipeModal(data);
            })
    }
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



// getSingleCountry("");

//www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata
//https://api.spoonacular.com/recipes/716429/information?apiKey=dRwhC4AYy0Zu67YNxqqXPrs9mr2FNITeeotbxFBa
// http://countryapi.gear.host/v1/Country/getCountries
//