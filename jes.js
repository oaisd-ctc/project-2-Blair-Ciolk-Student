const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
})

function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    let mealResults = document.getElementById('meal').html;
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?apiKey=7c24c5f6779b417a8c7f91021d764914&ingredients=${searchInputTxt}`)
    .then((response) => {
        if(!response.ok)
        {
            mealResults =response.status;
            throw new Error(`HTTP error`);
        }
        return response.json()
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
                     </div>
                 </div>
            `;
            });
            mealList.classList.remove('notFound');
        }
        else {
            html = "No results";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    })
   
    
}

function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        var mealItemID = e.target.parentElement.parentElement.getAttribute("data-id");
        let mealItem = e.target.parentElement.parentElement;
        //console.log(mealItem);
        fetch(`https://api.spoonacular.com/recipes/${mealItemID}/information?apiKey=7c24c5f6779b417a8c7f91021d764914&includeNutrition=false`)
            .then(response => response.json())
            .then(data => {
                mealRecipeModal(data);
            })
    }
}
function escapeHTML(unsafe)
{
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"g/, "&quot;")
        .replace(/'/g, "&#039;");
}

function mealRecipeModal(meal) {
    console.log(meal);
    let mealItemTitle = meal.title;
    console.log(mealItemTitle);
    if (meal.dishTypes.length == 0) {
        if (meal.cuisines) {
            let altName = linearSearchForCuisines(meal);
            //let mealCategory = meal.cuisines[0].charAt(0).toUpperCase() + meal.cuisines[0].slice(1);
            mealInstructions = meal.instructions;
            let html = `
            <h2 class="recipe-title">${mealItemTitle}</h2>
            <h3 class="recipe-sub">Information</h3>
            <p class="recipe-category">${altName}</p>
            <div class="recipe-instruct">
                <h3>Instructions:</h3>
                <p>${mealInstructions}</p>
                
        
            </div>
            <div class="recipe-meal-img">
                <img src="${meal.image}" alt="">
            </div>
            <div class="recipe-link">
                <a href="${meal.sourceUrl}" target="_blank">Source</a>
            </div>
            `;

            let xssFree = escapeHTML(html);
            mealDetailsContent.innerHTML = xssFree; 
            mealDetailsContent.parentElement.classList.add('showRecipe');
        }


    }
    else {
        let mealCategory = meal.dishTypes[0].charAt(0).toUpperCase() + meal.dishTypes[0].slice(1);
        mealInstructions = meal.instructions;
        let html = `
        <h2 class="recipe-title">${mealItemTitle}</h2>
        <h3 class="recipe-sub">Category</h3>
        <p class="recipe-category">${mealCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${mealInstructions}</p>
            
    
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.image}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.sourceUrl}" target="_blank">Source</a>
        </div>
        `;

        let xssFree = escapeHTML(html);
        mealDetailsContent.innerHTML = xssFree;
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