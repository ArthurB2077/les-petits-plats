import DOMElementFactory from "../scripts/factory/domElementFactory.js";
import { isArrayIncludesInAnotherArray } from "../scripts/utils/utils.js";
import { findInput } from "../scripts/algorithms/objectOrientedAlgoRecursive.js";

const factory = new DOMElementFactory();

class Recipes {
    constructor(recipes, instanceOfFilters, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray) {
        this.recipes = recipes;
        this.instanceOfFilters = instanceOfFilters;
        /**
         * This 3 global variables will hold the state of selected tags per family (ingredients, devices, utensils).
         * @type {Array, Array, Array}
         */
        this.selectedIngredientsArray = selectedIngredientsArray;
        this.selectedUtensilsArray = selectedUtensilsArray;
        this.selectedApplianceArray = selectedApplianceArray;
    }

    /**
     * @returns {number} => Length of the ingredients selected tag array
     */
    get selectedIngredientsArrayLength() {
        return this.selectedIngredientsArray.length;
    }

    /**
     * @returns {number} => Length of the utensils selected tag array
     */
    get selectedUtensilsArrayLength() {
        return this.selectedUtensilsArray.length;
    }

    /**
     * @returns {number} => Length of the devices selected tag array
     */
    get selectedApplianceArrayLength() {
        return this.selectedApplianceArray.length;
    }

    /**
     * Build each recipes in the DOM with the associated style
     */
    recipesBuilder() {
        for ( let recipe of this.recipes) {
            /**
             * List of ingredients and quantity in recipes
             * @type {*}
             */
            const ingList = factory.createDOMElement('ul', { class: 'recipe-ingredients-list ps-0' });
            for (let ing of recipe.ingredients) {
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
            }
            const ingListContainer = factory.createDOMElement('div', { class: 'recipe-ingredients w-50' }, ingList);
            /**
             * Preparation instructions in recipes
             */
            let instructions;
            if (recipe.description.length > 380) {
                instructions = factory.createDOMElement('p', { class: 'recipe-instructions recipe-instructions__overflow w-50' }, recipe.description);
            } else {
                instructions = factory.createDOMElement('p', { class: 'recipe-instructions w-50' }, recipe.description);
            }

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
        }
    }

    /**
     * Build a dom element container for the recipes in the DOM
     */
    recipeContainerBuilder() {
        const recipesSection = factory.createDOMElement('section', { id: 'recipes', 'aria-label': 'Section recettes' });
        document.getElementById('root').appendChild(recipesSection);
    }

    /**
     * This function hide all recipes and, after that, display only those it had receive in input
     * @param recipesToDisplay => Array of recipes to be display
     */
    displayRecipes(recipesToDisplay) {
        for (let el of Array.from(document.getElementsByClassName('recipe'))) {
            el.style.display = 'none'
        }
        for (let recipe of recipesToDisplay) {
            document.getElementById(`${recipe.id}`).style.display = 'flex'
        }
    }

    /**
     * This function filters recipes by selected tags. If the recipes have properties that matching the selected
     * tags, those recipes are display
     * @param recipeToFilter => Array holding the recipes to be filtered
     */
    displayRecipesBySelectedTags(recipeToFilter) {
        const ingredients = [];
        const appliance = [];
        for (let ing of recipeToFilter.ingredients) {
            ingredients.push(ing.ingredient)
        }
        appliance.push(recipeToFilter.appliance);
        if (isArrayIncludesInAnotherArray(this.selectedIngredientsArray, ingredients) &&
            isArrayIncludesInAnotherArray(this.selectedUtensilsArray, recipeToFilter.ustensils) &&
            isArrayIncludesInAnotherArray(this.selectedApplianceArray, appliance))
        {
            document.getElementById(`${recipeToFilter.id}`).style.display = 'flex';
        } else {
            document.getElementById(`${recipeToFilter.id}`).style.display = 'none';
        }
    }

    /**
     * This function help displayTag to handle the updating of the filters childrens depending on if there is tags
     * selected and what's recipes are actually display in the dom
     @param selectedTagArray => Array holding the value of the selected tags
     * @param filteringRecipes => The actual recipes display in the DOM filtered by the tags or not and will help to
     * update the filters children
     */
    handleUpdatingFiltersChildren(selectedTagArray, filteringRecipes) {
        if (selectedTagArray.length !== 0) {
            const domRecipes = Array.from(document.getElementById('recipes').querySelectorAll('div[style="display: flex;"]'));
            const filterCriteria = domRecipes.map(item => item.id);
            this.instanceOfFilters.updateFiltersChildren(filteringRecipes.filter(recipe => filterCriteria.includes(recipe.id.toString())));
        } else {
            this.instanceOfFilters.updateFiltersChildren(filteringRecipes);
        }
    }

    /**
     * This function listen all the dropdown list items. If a item is clicked, it's building the tag and add it's
     * value to the global variable of corresponding selected tags array. It also withdraw the item from the list,
     * filter the recipes and refresh the dropdown list depending on the new selected tag.
     * @param eventTarget => Tag element which receive the click to be display
     * @param tagType => Ingredients, devices or utensils
     * @param recipes => Array of the recipes from the fetch retrieved
     * @param recipeDisplayed => Array of recipes displayed in the dom
     */
    displayTag(eventTarget, tagType, recipes, recipeDisplayed) {
        // Build a tag element in the DOM
        this.instanceOfFilters.tagsBuilder(eventTarget.textContent, tagType);

        // Depending on the family tag (ingredients, utensils, devices), push the value of the tags in the corresponding
        // selected tags array
        switch (eventTarget.getAttribute('data-group-name')) {
            case 'selectedIngredientsArray':
                this.selectedIngredientsArray.push(eventTarget.textContent);
                break;
            case 'selectedUtensilsArray':
                this.selectedUtensilsArray.push(eventTarget.textContent);
                break;
            case 'selectedApplianceArray':
                this.selectedApplianceArray.push(eventTarget.textContent);
                break;
            default:
                break;
        }

        // Remove the filter child who receive the user click from the filters lis
        eventTarget.style.display = 'none';

        // Reset the filters search bar input to empty after adding the tag
        document.getElementById(`${tagType}-input`).value = '';

        // If the main search bar is empty and no recipes are filtered before adding the tag, filter all the recipes
        // on by the tags selected. Else, filter the recipes already filtered by the input in the main search bar also
        // by the selected tags
        if (document.getElementById("searchbar-input").value.length === 0) {
            recipes.forEach(recipe => {
                this.displayRecipesBySelectedTags(recipe);
            });
        } else {
            recipeDisplayed.forEach(recipe => {
                this.displayRecipesBySelectedTags(recipe);
            });
        }

        // Update the filters children depending on the actual selected tag
        switch (eventTarget.getAttribute('data-group-name')) {
            case 'selectedIngredientsArray': {
                this.handleUpdatingFiltersChildren(this.selectedIngredientsArray, recipes);
                break;
            }
            case 'selectedUtensilsArray': {
                this.handleUpdatingFiltersChildren(this.selectedUtensilsArray, recipes);
                break;
            }
            case 'selectedApplianceArray': {
                this.handleUpdatingFiltersChildren(this.selectedApplianceArray, recipes);
                break;
            }
            default:
                break;
        }
    }

    /**
     * This function help removeTag to remove closed tags from the selected array and display them in the filters
     * children list
     * @param selectedTagsArray => Array holding the value of the selected tags
     * @param tagsHiddenInFiltersList => Array of the filters children not displayed
     * @param closeElement => SVG close icon who receive the event click for closing the tag
     * @param index => Index used to do operation on element over iterating the array with for of loop
     */
    removeTagFromSelectedArray(selectedTagsArray, tagsHiddenInFiltersList, closeElement, index) {
        for (let tag of this.selectedIngredientsArray) {
            if (tag === closeElement.parentElement.firstElementChild.textContent) {
                selectedTagsArray.splice(index, 1);
                tagsHiddenInFiltersList.forEach(tagItem => {
                    if (tagItem.textContent === tag) {
                        tagItem.style.display = 'flex';
                    }
                })
            }
            index++
        }
    }

    /**
     * This function remove tag by withdraw it from the corresponding selected tags array, refresh filtered recipes
     * and refresh content of the dropdown filter list
     * @param selectedTagArrayName => Name of the array holding the actual selected tags
     * @param element => The tags DOM element which will receive the close event
     * @param tagsNotDisplayed => Array holding the actual tags hide in the dropdown list because they're selected
     * @param recipeDisplayed => Array of recipes displayed in the dom
     * @param recipes => Array of the recipes from the fetch retrieved
     */
    removeTag(selectedTagArrayName, element, tagsNotDisplayed, recipeDisplayed, recipes) {
        switch (selectedTagArrayName) {
            case 'ingredients': {
                let index = 0;
                this.removeTagFromSelectedArray(this.selectedIngredientsArray, tagsNotDisplayed, element, index);
                break;
            }
            case 'devices': {
                let index = 0;
                this.removeTagFromSelectedArray(this.selectedApplianceArray, tagsNotDisplayed, element, index);
                break;
            }
            case 'utensils': {
                let index = 0;
                this.removeTagFromSelectedArray(this.selectedUtensilsArray, tagsNotDisplayed, element, index);
                break;
            }
            default:
                break;
        }

        if (this.selectedApplianceArray.length === 0 && this.selectedUtensilsArray.length === 0 && this.selectedIngredientsArray.length === 0) {
            recipeDisplayed = findInput(`${document.getElementById('searchbar-input').value}`, recipes);
            this.displayRecipes(recipeDisplayed);
        } else {
            recipeDisplayed = findInput(`${document.getElementById('searchbar-input').value}`, recipes);
            for (let recipe of recipeDisplayed) {
                this.displayRecipesBySelectedTags(recipe);
            }
        }
        this.updateFiltersChildrenByTags(recipeDisplayed);
    }

    /**
     * This function handle the refresh of the tags items in the dropdown list depending of the tags selected
     * and the recipes
     * @param recipesArray => Array of display recipes which allow dropdown list children to be filtered
     */
    updateFiltersChildrenByTags(recipesArray) {
        if (this.selectedIngredientsArray.length !== 0 || this.selectedUtensilsArray.length !== 0 || this.selectedApplianceArray.length !== 0) {
            const domRecipes = Array.from(document.getElementById('recipes').querySelectorAll('div[style="display: flex;"]'));
            let filterCriteria = [];
            for (let item of domRecipes) {
                filterCriteria.push(item.id)
            }
            let filteredRecipes = [];
            for (let i = 0; i < recipesArray.length; i++) {
                if (filterCriteria.includes(recipesArray[i].id.toString())) {
                    filteredRecipes.push(recipesArray[i])
                }
            }
            this.instanceOfFilters.updateFiltersChildren(filteredRecipes);
        } else {
            this.instanceOfFilters.updateFiltersChildren(recipesArray);
        }
    }
}

export default Recipes;
