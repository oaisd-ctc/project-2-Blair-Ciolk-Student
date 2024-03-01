const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const dataContainer = document.getElementById('meal-details-content');
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
})


window.onload=function(){
    let searchInputTxt = "pizza";
    let mealResults = document.getElementById('meal').html;
    fetch(`https://api.spoonacular.com/food/videos/search?apiKey=7c24c5f6779b417a8c7f91021d764914&query=${searchInputTxt}`)
    .then((response) => {
        if(!response.ok)
        {
            mealResults =response.status;
            throw new Error(`HTTP error`);
        }
        return response.json()
    })
    .catch(error => {
        let unsafeHT = `<p style="color: white";>Eror: ${error}</p>`;
        let safeHTML = escapeHTML(unsafeHT);
        mealList.innerHTML += safeHTML;

        console.error(error);
    })
    .then(data => {
        let html = "";
        if (data.videos.length > 0) {
            data.videos.forEach(results => {
                html += `
                 <div class="meal-item" data-id="${results.youTubeId}" data-title="${results.title}">
                     <div class="meal-img">
                         <img src="${results.thumbnail}" alt="food">
                     </div>
                     <div class="meal-name">
                         <h3>${results.shortTitle}</h3>
                         <a href="#" class="recipe-btn">Watch Video</a>
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

        mealList.innerHTML = escapeHTML(html);
    })
   
    
}







function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    let mealResults = document.getElementById('meal').html;
    fetch(`https://api.spoonacular.com/food/videos/search?apiKey=7c24c5f6779b417a8c7f91021d764914&query=${searchInputTxt}`)
    .then((response) => {
        if(!response.ok)
        {
            mealResults =response.status;
            throw new Error(`HTTP error`);
        }
        return response.json()
    })
    .catch(error => {
        let unsafeHT = `<p style="color: white";>Eror: ${error}</p>`;
        let safeHTML = escapeHTML(unsafeHT);
        mealList.innerHTML += safeHTML;

        console.error(error);
    })
    .then(data => {
        let html = "";
        if (data.videos.length > 0) {
            data.videos.forEach(results => {
                html += `
                 <div class="meal-item" data-id="${results.youTubeId}" data-title="${results.title}">
                     <div class="meal-img">
                         <img src="${results.thumbnail}" alt="food">
                     </div>
                     <div class="meal-name">
                         <h3>${results.shortTitle}</h3>
                         <a href="#" class="recipe-btn">Watch Video</a>
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

        mealList.innerHTML = escapeHTML(html);
    })
   
    
}

function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        var mealItemID = e.target.parentElement.parentElement.getAttribute("data-id");
        //console.log(mealItem);
        window.open(`https://www.youtube.com/watch?v=${mealItemID}`, '_blank');
    }
}
function escapeHTML(unsafe)
{
    return DOMPurify.sanitize(unsafe);
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
            <div class="recipe-meal-img">
                <img src="${meal.image}" alt="">
            </div>
            <h3 class="recipe-sub">Information</h3>
            <p class="recipe-category">${altName}</p>
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
            mealDetailsContent.innerHTML = sanitizedInput; 
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
        <h3 class="recipe-sub">Vegan?</h3>
        <p class="recipe-isVegan">${meal.vegan}</p>
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