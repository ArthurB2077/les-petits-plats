import DOMElementFactory from "./frontend/scripts/factory/domElementFactory.js";
import Header from "./frontend/components/Header.js";
import Search from "./frontend/components/Search.js";
import Filters from "./frontend/components/Filters.js";
import Recipes from "./frontend/components/Recipes.js";
import {findInput} from "./frontend/scripts/algorithms/functionalAlgoRecursive.js";
import {giveFocusOnOver, isNoResultsForSearch} from "./frontend/scripts/utils/utils.js";

const factory = new DOMElementFactory();

const header = new Header();
header.renderHeader();

const search = new Search('root');
search.renderSearch();

const filters = new Filters();
const filtersSection = factory.createDOMElement('section', { id: 'dropdown-filters', class: 'mb-4', 'aria-label': 'Section filtres' }, factory.createDOMElement('div', { id: 'tags', class: 'mb-3', 'aria-label': 'Section tags' }));
document.getElementById('root').appendChild(filtersSection);
filters.filtersBuilder();
filters.handleDropdownStyle();

(async () => (await fetch('./api/data/recipe.json')).json())().then(retrievedRecipes => {
    /**
     * This instance allow to create all the recipes from the retrieved json. After that, the following methods
     * allow to create a container for recipes and the recipes themself.
     * @type {Recipes}
     */
    const recipes = new Recipes(retrievedRecipes, filters, [], [], []);

    recipes.recipeContainerBuilder();
    recipes.recipesBuilder();

    /**
     * Global variable that will hold the state of display recipes.
     * @type {Array}
     */
    let recipeDisplayed = retrievedRecipes;

    /**
     * On load give the focus to the main search bar
     */
    document.getElementById('searchbar-input').focus();

    /**
     * When the main searchbar lost focus, this event give it to the first open searchbar filter open
     */
    document.getElementById('searchbar-input').addEventListener('blur', () => {
        giveFocusOnOver();
    });

    /**
     * Event listener that filter the displayed recipes depending on the user input value. It has a condition to
     * handle the case where a new search is initialise and a tag or more are already selected
     */
    document.getElementById('searchbar-input').addEventListener('input', (event) => {
        if (event.target.value.length > 2) {
            recipeDisplayed = findInput(`${event.target.value}`, retrievedRecipes);
            recipes.displayRecipes(recipeDisplayed);
            if (recipes.selectedIngredientsArrayLength !== 0 || recipes.selectedUtensilsArrayLength !== 0 ||recipes.selectedApplianceArrayLength !== 0) {
                recipeDisplayed.forEach(recipe => recipes.displayRecipesBySelectedTags(recipe));
            }
            recipes.updateFiltersChildrenByTags(recipeDisplayed);
            isNoResultsForSearch();
        } else {
            recipes.displayRecipes(retrievedRecipes);
            if (recipes.selectedIngredientsArrayLength !== 0 || recipes.selectedUtensilsArrayLength !== 0 ||recipes.selectedApplianceArrayLength !== 0) {
                retrievedRecipes.forEach(recipe => recipes.displayRecipesBySelectedTags(recipe));
            }
            recipes.updateFiltersChildrenByTags(retrievedRecipes);
            isNoResultsForSearch();
        }
    });

    /**
     * This function display a tag when the user click on an element in the dropdown listed tag name. This list items
     * are add and suppressed depending on the user input. In that case, a simple addeventlistner like for a static
     * element would not fire. In order to accomplish that, a mouseover event listen the parent container and if there
     * is listed items in in, it add a on click event listener which will fire in any case and display the tag
     */
    Array.from(document.getElementsByClassName("btn-group-container")[0].children).forEach(cont => {
        cont.addEventListener('mouseover', (event) => {
            if (event.target.tagName === 'A') {
                Array.from(document.getElementsByClassName('filter-item')).forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.stopImmediatePropagation();
                        recipes.displayTag(e.target, e.target.getAttribute('data-name'), retrievedRecipes, recipeDisplayed);
                    })
                })
            }
        })
    })

    /**
     * Handle each type of events that the filters input can receive. Depending of the event types, it's updating
     * the content of the dropdown list depending on the input value, display a tag if one dropdown list item is
     * clicked and update them if a tag is selected
     */
    Array.from(document.getElementsByClassName('dropdown-button__input')).forEach(filter => {
        filter.addEventListener('input', (event) => {
            filters.updateFilterChildrenByInputValue(event.target);
        });
        filter.addEventListener('focus', (event) => {
            if (document.getElementById('searchbar-input').value.length < 3) {
                recipes.updateFiltersChildrenByTags(retrievedRecipes);
            }
            filters.updateFilterChildrenByInputValue(event.target);
        });
    });

    /**
     * Handle the close of a tag and call the appropriate functions for remove it
     */
    document.getElementById('tags').addEventListener('mouseover', () => {
        const tagsCloseButtons = Array.from(document.getElementsByClassName('close-tag'));
        tagsCloseButtons.forEach(closeTag => {
            closeTag.addEventListener('click', (event) => {
                const tagToClose = event.target.parentElement;
                const tagGroup = event.target.getAttribute('data-group-name');
                const tagItemsNotDisplayed = Array.from(document.getElementsByClassName(`dropdown-filter-item__${tagGroup}`)).filter(item => item.getAttribute('style') === 'display: none;');
                tagToClose.remove();
                switch (tagGroup) {
                    case 'ingredients': {
                        recipes.removeTag('ingredients', event.target, tagItemsNotDisplayed, recipeDisplayed, retrievedRecipes);
                        break;
                    }
                    case 'devices': {
                        recipes.removeTag('devices', event.target, tagItemsNotDisplayed, recipeDisplayed, retrievedRecipes);
                        break;
                    }
                    case 'utensils': {
                        recipes.removeTag('utensils', event.target, tagItemsNotDisplayed, recipeDisplayed, retrievedRecipes);
                        break;
                    }
                    default:
                        break;
                }
                document.getElementById(`${tagGroup}-input`).focus();
            });
        });
    });

}).catch((error) => console.log(error))
