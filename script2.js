const icon = document.querySelector('.icon');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const mealList = document.getElementById('meal');
const fetchButton = document.getElementById('fetchButton');
const dataContainer = document.getElementById('meal-details-content');
fetchButton.addEventListener('click', fetchData);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    dataContainer.parentElement.classList.remove('showRecipe');
});

function fetchData() {
    fetch('https://api.spoonacular.com/recipes/random?apiKey=7c24c5f6779b417a8c7f91021d764914&number=6')
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.recipes.length > 0) {
                data.recipes.forEach(recipe => {
                    html += `
                    <div class="meal-item" data-id="${recipe.id}" data-title="${recipe.title}">
                        <div class="meal-img">
                            <img src="${recipe.image}" alt="food">
                        </div>
                        <div class="meal-name">
                            <h3>${recipe.title}</h3>
                            <a href="#" class="recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "No results";
                mealList.classList.add('notFound');
            }
            let sanitizedInput = escapeHTML(html);
            mealList.innerHTML = sanitizedInput;
        })
        .catch(error => {
            dataContainer.innerHTML = '<p>An error occurred while fetching data</p>';
        });
}

function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        var mealItemID = e.target.parentElement.parentElement.getAttribute("data-id");
        fetch(`https://api.spoonacular.com/recipes/${mealItemID}/information?apiKey=7c24c5f6779b417a8c7f91021d764914&includeNutrition=false`)
            .then(response => response.json())
            .then(data => {
                mealRecipeModal(data);
            })
    }
}

function mealRecipeModal(meal) {
    let mealItemTitle = meal.title;
    let mealInstructions = meal.instructions;
    let mealCategory = meal.dishTypes.length > 0 ? meal.dishTypes[0].charAt(0).toUpperCase() + meal.dishTypes[0].slice(1) : linearSearchForCuisines(meal);

    let html = `
        <h2 class="recipe-title">${mealItemTitle}</h2>
        <div class="recipe-meal-img">
            <img src="${meal.image}" alt="">
        </div>
        <h3 class="recipe-sub">Category</h3>
        <p class="recipe-category">${mealCategory}</p>
        <br> <br>
        <h3 class="recipe-sub">Vegan?</h3>
        <p class="recipe-isVegan">${meal.vegan}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${mealInstructions}</p>
        </div>
        
        <div class="recipe-link">
            <a href="${meal.sourceUrl}" target="_blank">Source</a>
        </div>
    `;

    let sanitizedInput = escapeHTML(html);
    dataContainer.innerHTML = sanitizedInput;
    dataContainer.parentElement.classList.add('showRecipe');
}

function linearSearchForCuisines(meal) {
    for (let key in meal) {
        if (key === 'cuisines' && meal[key] !== null) {
            return meal[key];
        }
    }
    return 'Cuisines not found in meal object';
}

function escapeHTML(unsafe) {
    return DOMPurify.sanitize(unsafe);
}
