const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEl = document.getElementById('single-meal');

    //Search for a meal and fetch from the API
function searchMeal(ev) {
    ev.preventDefault();

//    Clear the single meal
    single_mealEl.innerHTML = '';

//    Get the search term
    const term = search.value;
    console.log(term);

//    Check for empty search
    if(term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`).then(res => res.json()).then(data => {
            // console.log(data);
            console.log(data.meals);
            resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`
            if (data.meals == null) {
                console.log(data.meals);
                resultHeading.innerHTML = `<p>There are no search results. Please try again!</p>`
            } else {
                mealsEl.innerHTML = data.meals.map(meal =>
                    `<div class="meal">
                                 <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                                 <div class="meal-info" data-mealID="${meal.idMeal}">
                                 <h3>${meal.strMeal}</h3>
                                 </div>
                                 </div>
                            `).join('');
            }
        });
        search.value = '';
    } else {
                    alert('Please enter a search term');
            }
}

//get each meal by its id that is returned from the API
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
    });
}

//fetch a random meal from the API
function getRandomMeal() {
// clear meals and heading
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
    })

}


    //add the meal to the DOM
function addMealToDOM(meal) {
    const ingredients = [];
    for (let i = 1; i<= 20; i++) {
        if(meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    single_mealEl.innerHTML = `
    <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class=""single-meal-info">
    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
    ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
</div>
<div class="main">
<p>${meal.strInstructions}</p>
<h2>Ingredients</h2>
<ul>
${ingredients.map(ing => `<li>${ing}</li>`).join('')}
</ul>
</div>
</div>`
}

    //Event Listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);
mealsEl.addEventListener('click', ev => {
    const mealInfo = ev.path.find(item => {
        if(item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });
    console.log(mealInfo);
    if(mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
})
