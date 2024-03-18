const icon = document.querySelector('.icon');

const mealList = document.getElementById('joke');
const fetchButton = document.getElementById('fetchButton');
const dataContainer = document.getElementById('meal-details-content');

fetchButton.addEventListener('click', handleClick);

mealList.addEventListener('click', getMealRecipe);



function setTheme() {
    var getLSWebsiteTheme = localStorage.getItem("websiteTheme");
    var theme = document.getElementsByTagName('link')[0];
    if (getLSWebsiteTheme === 'darkStyle.css' || getLSWebsiteTheme === 'darkStyle3.css') {
        theme.setAttribute('href', 'darkStyle3.css');
    } else {
        theme.setAttribute('href', 'style3.css');
    }
}

function toggleTheme() {
    var theme = document.getElementsByTagName('link')[0];
    var themeDocu = theme.getAttribute('href');
    if (themeDocu.includes('style3.css')) {
        theme.setAttribute('href', 'darkStyle.css');
        localStorage.setItem("websiteTheme", 'darkStyle.css');
    } else {
        theme.setAttribute('href', 'style3.css');
        localStorage.setItem("websiteTheme", 'style.css');
    }
    console.log(localStorage.getItem("websiteTheme"));
}


window.onload = function () {
    setTheme();
    fetch('https://api.api-ninjas.com/v1/jokes?limit=1', {
        method: 'GET',
        headers: { 'X-Api-Key': 'A0Hgh3vkAarORorljjhwBg==aB2LWV3ExUoIYH9x' },
        contentType: 'application/json',
    })
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data[0].joke.length <= 300) {
                console.log(data[0].joke)
                if (data[0].joke != null) {
                    CensorText(data[0].joke);
                    html += `<h3 class="jokeContent">${data[0].joke}</h3>`;
                    mealList.classList.remove('notFound');
                } else {
                    html = "No results";
                    mealList.classList.add('notFound');
                }
                let sanitizedInput = escapeHTML(html);
                mealList.innerHTML = sanitizedInput;
            }
            else {
                let uniJoke = data[0].joke;
                console.log(uniJoke);

            }

        })
        .catch(error => {
            var errorMessage = `<p>An error occurred while fetching data: ${error}</p>`;
            var cleanMessage = escapeHTML(errorMessage);
            dataContainer.innerHTML = cleanMessage;
        });
}



//https://api.spoonacular.com/food/jokes/random?apiKey=7c24c5f6779b417a8c7f91021d764914
function fetchData() {
    fetch('https://api.api-ninjas.com/v1/jokes?limit=1', {
        method: 'GET',
        headers: { 'X-Api-Key': 'A0Hgh3vkAarORorljjhwBg==aB2LWV3ExUoIYH9x' },
        contentType: 'application/json',
    })
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data[0].joke.length <= 300) {
                console.log(data[0].joke)
                if (data[0].joke != null) {
                    CensorText(data[0].joke);
                    html = `<h3 class="meal-name">${data[0].joke}</h3>`;
                    mealList.classList.remove('notFound');
                } else {
                    html = "No results";
                    mealList.classList.add('notFound');
                }
                let sanitizedInput = escapeHTML(html);
                mealList.innerHTML = sanitizedInput;
            }
            else {
                let uniJoke = data[0].joke;
                console.log(uniJoke);

            }

        })
        .catch(error => {
            dataContainer.innerHTML = '<p>An error occurred while fetching data</p>';
        });
}

function handleClick() {
    fetchData();
    fetchButton.disabled = true;

    // Enable the button after the specified duration
    setTimeout(() => {
        fetchButton.disabled = false;
    }, 3000); // Convert seconds to milliseconds
}

function CensorText(uncensored) {
    if (uncensored.includes("sex") || uncensored.includes("communist") || uncensored.includes("nazi") || uncensored.includes("Hitler")
        || uncensored.includes("German") || uncensored.includes("german") || uncensored.includes("Japan") || uncensored.includes("Hiroshima")
        || uncensored.includes("Jesus") || uncensored.includes("God") || uncensored.includes("hell") || uncensored.includes("handjob")
        || uncensored.includes("ass") || uncensored.includes("asshole") || uncensored.includes("penis") || uncensored.includes("blow job")
        || uncensored.includes("breast") || uncensored.includes("boob") || uncensored.includes("fuck") || uncensored.includes("beer")
        || uncensored.includes("alcohol") || uncensored.includes("Polak") || uncensored.includes("pee") || uncensored.includes("rehab")
        || uncensored.includes("naked") || uncensored.includes("genitals") || uncensored.includes("tease") || uncensored.includes("stroke")
        || uncensored.includes("mexican") || uncensored.includes("Mexic") || uncensored.includes("black") || uncensored.includes("novocain")
        || uncensored.includes("weed") || uncensored.includes("cocaine") || uncensored.includes("white") || uncensored.includes("supremacy")
        || uncensored.includes("supremacist") || uncensored.includes("congressmen") || uncensored.includes("Africa") || uncensored.includes("bar")
        || uncensored.includes("tavern") || uncensored.includes("poker") || uncensored.includes("donald") || uncensored.includes("Donald")
        || uncensored.includes("Trump") || uncensored.includes("trump") || uncensored.includes("athei") || uncensored.includes("Indian")
        || uncensored.includes("chinese") || uncensored.includes("japanese") || uncensored.includes("China") || uncensored.includes("depressed")
        || uncensored.includes("suicide") || uncensored.includes("kill") || uncensored.includes("smoking") || uncensored.includes("cigar")
        || uncensored.includes("cigarette") || uncensored.includes("laced") || uncensored.includes("profanity") || uncensored.includes("balls")
        || uncensored.includes("drown") || uncensored.includes("Ireland") || uncensored.includes("irish") || uncensored.includes("disabled")
        || uncensored.includes("chromosome") || uncensored.includes("murder") || uncensored.includes("fat") || uncensored.includes("erect")
        || uncensored.includes("dysfunction") || uncensored.includes("horny") || uncensored.includes("politic") || uncensored.includes("blood")
        || uncensored.includes("menstruation") || uncensored.includes("rod") || uncensored.includes("death") || uncensored.includes("die")
        || uncensored.includes("phile") || uncensored.includes("phish") || uncensored.includes("constipat") || uncensored.includes("gun")
        || uncensored.includes("knife") || uncensored.includes("nuremberg") || uncensored.includes("shoot") || uncensored.includes("nihilist")
        || uncensored.includes("dwarve") || uncensored.includes("europe") || uncensored.includes("Europe") || uncensored.includes("drugs")
        || uncensored.includes("Nagasaki") || uncensored.includes("polish") || uncensored.includes("crap") || uncensored.includes("Star Wars")
        || uncensored.includes("twink") || uncensored.includes("ching") || uncensored.includes("chan") || uncensored.includes("Chan")
        || uncensored.includes("wata") || uncensored.includes("Wata") || uncensored.includes("rape") || uncensored.includes("rapist")
        || uncensored.includes("pedo") || uncensored.includes("molest") || uncensored.includes("fondle") || uncensored.includes("grope")
        || uncensored.includes("groom") || uncensored.includes("cannibal") || uncensored.includes("anorex") || uncensored.includes("medi")
        || uncensored.includes("relationship") || uncensored.includes("date") || uncensored.includes("Date") || uncensored.includes("dating")
        || uncensored.includes("jack off") || uncensored.includes("jackoff") || uncensored.includes("pick your nose")
        || uncensored.includes("yeast infection") || uncensored.includes("capitalism") || uncensored.includes("Capitalist")
        || uncensored.includes("capital") || uncensored.includes("cotton-pick") || uncensored.includes("cotton pick")
        || uncensored.includes("cottonp") || uncensored.includes("Chinese") || uncensored.includes("Nazi") || uncensored.includes("Chi")
        || uncensored.includes("shit") || uncensored.includes("prostitute") || uncensored.includes("Hillary") || uncensored.includes("Clinton")
        || uncensored.includes("biden") || uncensored.includes("Biden") || uncensored.includes("whiskey") || uncensored.includes("vodka")
        || uncensored.includes("dirty joke") || uncensored.includes("retar") || uncensored.includes("midget") || uncensored.includes("Libyan")
        || uncensored.includes("libyan") || uncensored.includes("damn") || uncensored.includes("isis") || uncensored.includes("ISIS")
        || uncensored.includes("spanish") || uncensored.includes("watermelon") || uncensored.includes("jamal") || uncensored.includes("bury")
        || uncensored.includes("feminate") || uncensored.includes("dwarf") || uncensored.includes("effeminate") || uncensored.includes("church")
        || uncensored.includes("sermon")) {
        console.log("Contains potentially innapropriate content");
        mealList.innerHTML = `
            <div style="color:white;">
                <h3 class="meal-name">What do you call a sleeping T-Rex? A dino-snore!</h3>
                <p class="meal-sub-name">Previous joke contained potentially innapropriate content, please try again :)</p>
            </div>`;
        meal.h3.innerHTML = `<h3 class="meal-name"></h3>`;
        //fetchData();
        return;
    }
    else {
        return;
    }

}

function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        var mealItemID = e.target.parentElement.parentElement.getAttribute("data-id");
        fetch(`https://api.spoonacular.com/recipes/${mealItemID}/information?apiKey=7c24c5f6779b417a8c7f91021d764914&includeNutrition=false`)
            .then(response => response.json())
            .catch(error => {
                dataContainer.innerHTML = '<p>An error occurred while fetching data</p>';
                console.error(error);
            })
            .then(data => {
                mealRecipeModal(data);
            })
    }
}


function escapeHTML(unsafe) {
    return DOMPurify.sanitize(unsafe);
}
