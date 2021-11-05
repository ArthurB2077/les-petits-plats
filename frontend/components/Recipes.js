import DOMElementFactory from "../scripts/factory/domElementFactory.js";

const factory = new DOMElementFactory();

class Recipes {
    constructor(recipes) {
        this.recipes = recipes;
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
}

export default Recipes;
