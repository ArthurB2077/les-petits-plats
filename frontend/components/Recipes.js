import DOMElementFactory from "../scripts/factory/domElementFactory.js";
import { isArrayIncludesInAnotherArray } from "../scripts/utils/utils.js";
import { findInput } from "../scripts/algorithms/functionalAlgoRecursive.js";

const factory = new DOMElementFactory();

class Recipes {
    constructor(recipes, instanceOfFilters) {
        this.recipes = recipes;
        this.instanceOfFilters = instanceOfFilters;
    }

    get renderRecipes() {
        return this.recipesBuilder;
    }

    recipesBuilder() {
        this.recipes.forEach(recipe => {
            /**
             * List of ingredients and quantity in recipes
             * @type {*}
             */
            const ingList = factory.createDOMElement('ul', { class: 'recipe-ingredients-list ps-0' });
            recipe.ingredients.forEach((ing) => {
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
            const instructions = factory.createDOMElement('p', { class: 'recipe-instructions w-50' }, recipe.description);
            /**
             * Container for preparation instructions and list of ingredients in recipes
             */
            const recipePreparation = factory.createDOMElement('div', { class: 'recipe-method d-flex justify-content-between mt-3' },  ingListContainer, instructions);

            /**
             * Preparation time in the recipe
             * @type {*}
             */
            const preparationTime = factory.createDOMElement('span', {}, `${recipe.time}`);
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
            const recipeName = factory.createDOMElement('span', { class: 'recipe-name' }, recipe.name);
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
            const recipeContainer = factory.createDOMElement('div', { id: recipe.id, class: 'recipe flex-column' }, recipeImage, recipeDescription);

            /**
             * Adding each recipe in the recipes section of the HTML document body
             */
            document.getElementById('recipes').appendChild(recipeContainer);
        })
    }

    get renderRecipeContainer() {
        return this.recipeContainerBuilder;
    }

    recipeContainerBuilder() {
        const recipesSection = factory.createDOMElement('section', { id: 'recipes', 'aria-label': 'Section recettes' });
        document.getElementById('root').appendChild(recipesSection);
    }

    /**
     * This function hide all recipes and, after that, display only those it had receive in input
     * @param recipesToDisplay => Array of recipes to be display
     */
    displayRecipes(recipesToDisplay) {
        Array.from(document.getElementsByClassName('recipe')).forEach(el => el.style.display = 'none');
        recipesToDisplay.forEach(recipe => document.getElementById(`${recipe.id}`).style.display = 'flex');
    };

    /**
     * This function filters recipes by selected tags. If the recipes have properties that matching the selected
     * tags, those recipes are display
     * @param recipeToFilter => Array holding the recipes to be filtered
     * @param selectedIngredientsArray => List of the selected ingredients
     * @param selectedUtensilsArray => List of the selected utensils
     * @param selectedApplianceArray => List of the selected devices
     */
    displayRecipesBySelectedTags(recipeToFilter, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray) {
        const ingredients = [];
        const appliance = [];
        recipeToFilter.ingredients.forEach(ing => {
            ingredients.push(ing.ingredient)
        });
        appliance.push(recipeToFilter.appliance);
        if (isArrayIncludesInAnotherArray(selectedIngredientsArray, ingredients) &&
            isArrayIncludesInAnotherArray(selectedUtensilsArray, recipeToFilter.ustensils) &&
            isArrayIncludesInAnotherArray(selectedApplianceArray, appliance))
        {
            document.getElementById(`${recipeToFilter.id}`).style.display = 'flex';
        } else {
            document.getElementById(`${recipeToFilter.id}`).style.display = 'none';
        }
    };

    /**
     * This function listen all the dropdown list items. If a item is clicked, it's building the tag and add it's
     * value to the global variable of corresponding selected tags array. It also withdraw the item from the list,
     * filter the recipes and refresh the dropdown list depending on the new selected tag.
     * @param tagType => Ingredients, devices or utensils
     * @param selectedIngredientsArray => List of the selected ingredients
     * @param selectedUtensilsArray => List of the selected utensils
     * @param selectedApplianceArray => List of the selected devices
     * @param recipes => Array of the recipes from the fetch retrieved
     * @param recipeDisplayed => Array of recipes displayed in the dom
     */
    displayTag(tagType, recipes, recipeDisplayed, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray) {
        const tagItemsDisplayed = Array.from(document.getElementsByClassName(`dropdown-filter-item__${tagType}`)).filter(item => item.getAttribute('style') === 'display: flex;');
        tagItemsDisplayed.forEach(tagItem => {
            tagItem.addEventListener('click', (event) => {
                this.instanceOfFilters.tagsBuilder(event.target.textContent, tagType);
                switch (event.target.getAttribute('data-group-name')) {
                    case 'selectedIngredientsArray':
                        selectedIngredientsArray.push(event.target.textContent);
                        break;
                    case 'selectedUtensilsArray':
                        selectedUtensilsArray.push(event.target.textContent);
                        break;
                    case 'selectedApplianceArray':
                        selectedApplianceArray.push(event.target.textContent);
                        break;
                    default:
                        break;
                }
                event.target.style.display = 'none';
                document.getElementById(`${tagType}-input`).value = '';
                if (document.getElementById("searchbar-input").value.length === 0) {
                    recipes.forEach(recipe => {
                        this.displayRecipesBySelectedTags(recipe, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray);
                    });
                } else {
                    recipeDisplayed.forEach(recipe => {
                        this.displayRecipesBySelectedTags(recipe, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray);
                    });
                }
                switch (event.target.getAttribute('data-group-name')) {
                    case 'selectedIngredientsArray': {
                        if (selectedIngredientsArray.length !== 0) {
                            const domRecipes = Array.from(document.getElementById('recipes').querySelectorAll('div[style="display: flex;"]'));
                            const filterCriteria = domRecipes.map(item => item.id);
                            this.instanceOfFilters.updateFiltersChildren(recipes.filter(recipe => filterCriteria.includes(recipe.id.toString())));
                        } else {
                            this.instanceOfFilters.updateFiltersChildren(recipes);
                        }
                        break;
                    }
                    case 'selectedUtensilsArray': {
                        if (selectedUtensilsArray.length !== 0) {
                            const domRecipes = Array.from(document.getElementById('recipes').querySelectorAll('div[style="display: flex;"]'));
                            const filterCriteria = domRecipes.map(item => item.id);
                            this.instanceOfFilters.updateFiltersChildren(recipes.filter(recipe => filterCriteria.includes(recipe.id.toString())));
                        } else {
                            this.instanceOfFilters.updateFiltersChildren(recipes);
                        }
                        break;
                    }
                    case 'selectedApplianceArray': {
                        if (selectedApplianceArray.length !== 0) {
                            const domRecipes = Array.from(document.getElementById('recipes').querySelectorAll('div[style="display: flex;"]'));
                            const filterCriteria = domRecipes.map(item => item.id);
                            this.instanceOfFilters.updateFiltersChildren(recipes.filter(recipe => filterCriteria.includes(recipe.id.toString())));
                        } else {
                            this.instanceOfFilters.updateFiltersChildren(recipes);
                        }
                        break;
                    }
                    default:
                        break;
                }
            });
        });
    };

    /**
     * This function remove tag by withdraw it from the corresponding selected tags array, refresh filtered recipes
     * and refresh content of the dropdown filter list
     * @param selectedTagArray => Array holding the actual selected tags
     * @param element => The tags DOM element which will receive the close event
     * @param tagsNotDisplayed => Array holding the actual tags hide in the dropdown list because they're selected
     * @param selectedIngredientsArray => List of the selected ingredients
     * @param selectedUtensilsArray => List of the selected utensils
     * @param selectedApplianceArray => List of the selected devices
     * @param recipeDisplayed => Array of recipes displayed in the dom
     * @param recipes => Array of the recipes from the fetch retrieved

     */
    removeTag(selectedTagArray, element, tagsNotDisplayed, recipeDisplayed, recipes, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray) {
        selectedTagArray.forEach((tag, index) => {
            if (tag === element.parentElement.firstElementChild.textContent) {
                selectedTagArray.splice(index, 1);
                tagsNotDisplayed.forEach(tagItem => {
                    if (tagItem.textContent === tag) {
                        tagItem.style.display = 'flex';
                    }
                })
            }
        });
        if (selectedApplianceArray.length === 0 && selectedUtensilsArray.length === 0 && selectedIngredientsArray.length === 0) {
            recipeDisplayed = findInput(`${document.getElementById('searchbar-input').value}`, recipes);
            this.displayRecipes(recipeDisplayed);
        } else {
            recipeDisplayed = findInput(`${document.getElementById('searchbar-input').value}`, recipes);
            recipeDisplayed.forEach(recipe => {
                this.displayRecipesBySelectedTags(recipe, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray);
            })
        }
        this.instanceOfFilters.updateFiltersChildrenByTags(recipeDisplayed, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray);
    };
}

export default Recipes;
