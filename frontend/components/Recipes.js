import DOMElementFactory from "../scripts/factory/domElementFactory.js";
import {findInput} from "../scripts/algorithms/functionalAlgoRecursive.js";
import {filters} from "./FilterByTags.js";

const factory = new DOMElementFactory();

class Recipe {
    constructor(id, ingredients, description, time, name) {
        this.id = id;
        this.ingredients = ingredients;
        this.description = description;
        this.time = time;
        this.name = name;
    }

    get oneRecipe() {
        return this.renderOneRecipe;
    }

    renderOneRecipe() {
        /**
         * List of ingredients and quantity in recipes
         * @type {*}
         */
        const ingList = factory.createDOMElement('ul', { class: 'recipe-ingredients-list ps-0' });
        this.ingredients.forEach((ing) => {
            if (ing.quantity) {
                const strong = factory.createDOMElement('strong', {}, `${ing.ingredient}`);
                const span = factory.createDOMElement('span', {}, `: ${ing.quantity}`);
                const ingItem = factory.createDOMElement('li', {}, strong, span);
                ingList.appendChild(ingItem);
            } else if (ing.quantite){
                const strong = factory.createDOMElement('strong', {}, `${ing.ingredient}`);
                const span = factory.createDOMElement('span', {}, `: ${ing.quantite}`);
                const ingItem = factory.createDOMElement('li', {}, strong, span);
                ingList.appendChild(ingItem);
            } else {
                const strong = factory.createDOMElement('strong', {}, `${ing.ingredient}`);
                const ingItem = factory.createDOMElement('li', {}, strong);
                ingList.appendChild(ingItem);
            }
        })
        const ingListContainer = factory.createDOMElement('div', { class: 'recipe-ingredients w-50' }, ingList);
        /**
         * Preparation instructions in recipes
         */
        const instructions = factory.createDOMElement('p', { class: 'recipe-instructions w-50' }, this.description);
        /**
         * Container for preparation instructions and list of ingredients in recipes
         */
        const recipePreparation = factory.createDOMElement('div', { class: 'recipe-method d-flex justify-content-between mt-3' },  ingListContainer, instructions);

        /**
         * Preparation time in the recipe
         * @type {*}
         */
        const preparationTime = factory.createDOMElement('span', {}, `${this.time}`);
        /**
         * Time icon belong preparation time
         */
        const svgPath = factory.createDOMElement('path', { d: 'M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10.5 5H9V11L14.2 14.2L15 12.9L10.5 10.2V5Z', fill: 'black' });
        const timeSvg = factory.createDOMElement('svg', { width: '20', height: '20', viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, svgPath);
        /**
         * Container for time icon and time duration
         */
        const timeContainer = factory.createDOMElement('div', { class: 'recipe-time' }, timeSvg, preparationTime);
        /**
         * Recipe name
         */
        const recipeName = factory.createDOMElement('span', { class: 'recipe-name' }, this.name);
        /**
         * Container for recipe name and preparation time
         */
        const nameAndTimeContainer = factory.createDOMElement('div', { class: 'recipe-title d-flex justify-content-between mt-1' }, recipeName, timeContainer);

        /**
         * Global description of the recipe with all information
         */
        const recipeDescription = factory.createDOMElement('div', { class: 'recipe-description h-50 p-3' }, nameAndTimeContainer, recipePreparation);

        /**
         * Recipe blank space for image
         */
        const recipeImage = factory.createDOMElement('div', { class: 'recipe-img h-50' });

        /**
         * Recipe
         */
        const recipeContainer = factory.createDOMElement('div', { id: this.id, class: 'recipe flex-column' }, recipeImage, recipeDescription);

        return (
            /**
             * Adding each recipe in the recipes section of the HTML document body
             */
            document.getElementById('recipes').appendChild(recipeContainer)
        )
    }
}

const recipesSection = factory.createDOMElement('section', { id: 'recipes', 'aria-label': 'Section recettes' });
document.getElementById('root').appendChild(recipesSection);

fetch('./../../api/data/recipe.json')
    .then(res => {
        return res.json();
    })
    .then(recipes => {
        recipes.forEach(recipe => {
            const recipeToRender = new Recipe(recipe.id, recipe.ingredients, recipe.description, recipe.time, recipe.name);
            recipeToRender.oneRecipe();
        });

        let recipeDisplayed = recipes;

        const renderDisplayedRecipes = (recipesToDisplay) => {
            Array.from(document.getElementsByClassName('recipe')).forEach(el => el.style.display = 'none');
            recipesToDisplay.forEach(recipe => {
                document.getElementById(`${recipe.id}`).style.display = 'flex';
            });
        };
        const renderRecipesTags = (filteredRecipes) => {
            const ingredientFilter = document.getElementById('ingredients-list');
            const preventDoppelgangerIng = [];

            filteredRecipes.forEach(recipe => {
                recipe.ingredients.forEach(ing => {
                    if (!(preventDoppelgangerIng.includes(ing.ingredient.toLowerCase()))){preventDoppelgangerIng.push(ing.ingredient.toLowerCase());}
                })
            });

            preventDoppelgangerIng.forEach((ing) => {
                ingredientFilter.appendChild(factory.createDOMElement('a', { class: 'dropdown-filter-item text-white', href: '#' }, `${ing.replace(ing[0], ing[0].toUpperCase())}`));
            });

        };
        const displayRecipeTags = (filteredRecipes) => {
            const ingredientList = document.getElementById('ingredients-list');
            const ingredientsFiltered =[];
            const preventDoppelgangerIng = [];

            Array.from(ingredientList.children).forEach(ingredient => {
                ingredient.style.display = 'none';
            })

            filteredRecipes.forEach(recipe => {
                recipe.ingredients.forEach(ing => {
                    if (!(preventDoppelgangerIng.includes(ing.ingredient.toLowerCase()))){preventDoppelgangerIng.push(ing.ingredient.toLowerCase());}
                })
            });

            preventDoppelgangerIng.forEach((ing) => {
                ingredientsFiltered.push(ing.replace(ing[0], ing[0].toUpperCase()));
            });

            Array.from(ingredientList.children).forEach(ingredient => {
                ingredientsFiltered.forEach(filteredIngredient => {
                    if (filteredIngredient === ingredient.textContent) {
                        ingredient.style.display = 'flex';
                    }
                })
            })
        }

        /**
         * Listen the global search bar and display recipes and tags associated by the input
         */
        renderRecipesTags(recipeDisplayed);
        document.getElementById('searchbar-input').addEventListener('input', (event) => {
            if (event.target.value.length > 2) {
                recipeDisplayed = findInput(`${event.target.value}`, recipes);
                renderDisplayedRecipes(recipeDisplayed);
                displayRecipeTags(recipeDisplayed);
            } else {
                renderDisplayedRecipes(recipes);
                displayRecipeTags(recipes);
            }
        });

        /**
         * Allow the filtering of ingredients, utensils and devices in function of inputs values in tags search bars
         */
        Array.from(document.getElementsByClassName('dropdown-button__input')).forEach(filter => {
            filter.addEventListener('input', (event) => {
                const parentElement = event.target.parentElement.nextElementSibling.firstElementChild;
                const elementsToFilter = Array.from(parentElement.children);

                if(event.target.value.length > 2) {
                    elementsToFilter.forEach(el => {
                        el.style.display = 'flex';
                    });
                    elementsToFilter.forEach(el => {
                        if (!(el.textContent.toLowerCase().includes(event.target.value.toLowerCase()))) {el.style.display = 'none';}
                    });
                } else {
                    elementsToFilter.forEach(el => {
                        el.style.display = 'flex';
                    });
                }

                const tagItemsDisplayed = Array.from(document.getElementsByClassName('dropdown-filter-item')).filter(item =>
                    item.getAttribute('style') === 'display: flex;'
                )
                console.log("Array of tags items displayed: ", tagItemsDisplayed)
                tagItemsDisplayed.forEach(tagItem => {
                    tagItem.addEventListener('click', (event) => {
                        console.log("On tag item click event: ", event);
                    })
                })
            })
            filter.addEventListener('focus', (event) => {
                const parentElement = event.target.parentElement.nextElementSibling.firstElementChild;
                const elementsToFilter = Array.from(parentElement.children);

                elementsToFilter.forEach(el => {
                    el.style.display = 'flex';
                });
            })
            filter.addEventListener('blur', (event) => {
                event.target.value = '';
                const parentElement = event.target.parentElement.nextElementSibling.firstElementChild;
                const elementsToFilter = Array.from(parentElement.children);

                elementsToFilter.forEach(el => {
                    el.style.display = 'flex';
                });
            })
        })
    })

export default Recipe;
