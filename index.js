import DOMElementFactory from "./frontend/scripts/factory/domElementFactory.js";
import Header from "./frontend/components/Header.js";
import Search from "./frontend/components/Search.js";
import FilterByTags from "./frontend/components/FilterByTags.js";
import Recipes from "./frontend/components/Recipes.js";
import {findInput} from "./frontend/scripts/algorithms/functionalAlgoRecursive.js";
import {giveFocusOnOver, isNoResultsForSearch} from "./frontend/scripts/utils/utils.js";

const header = new Header();
header.renderHeader();

const search = new Search('root');
search.renderSearch();

const filters = new FilterByTags();
const factory = new DOMElementFactory();
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
    const recipesToRender = new Recipes(retrievedRecipes, filters, [], [], []);
    recipesToRender.recipeContainerBuilder();
    recipesToRender.recipesBuilder();

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
            recipesToRender.displayRecipes(recipeDisplayed);
            if (recipesToRender.selectedIngredientsArrayLength !== 0 || recipesToRender.selectedUtensilsArrayLength !== 0 ||recipesToRender.selectedApplianceArrayLength !== 0) {
                recipeDisplayed.forEach(recipe => recipesToRender.displayRecipesBySelectedTags(recipe));
            }
            recipesToRender.updateFiltersChildrenByTags(recipeDisplayed);
            isNoResultsForSearch();
        } else {
            recipesToRender.displayRecipes(retrievedRecipes);
            if (recipesToRender.selectedIngredientsArrayLength !== 0 || recipesToRender.selectedUtensilsArrayLength !== 0 ||recipesToRender.selectedApplianceArrayLength !== 0) {
                retrievedRecipes.forEach(recipe => recipesToRender.displayRecipesBySelectedTags(recipe));
            }
            recipesToRender.updateFiltersChildrenByTags(retrievedRecipes);
            isNoResultsForSearch();
        }
    });
    /**
     * Handle each type of events that the filters input can receive. Depending of the event types, it's updating
     * the content of the dropdown list depending on the input value, display a tag if one dropdown list item is
     * clicked and update them if a tag is selected
     */
    Array.from(document.getElementsByClassName('dropdown-button__input')).forEach(filter => {
        filter.addEventListener('input', (event) => {
            filters.updateFilterChildrenByInputValue(event.target);
        });
        filter.addEventListener('change', (event) => {
            recipesToRender.displayTag(event.target.getAttribute('data-name'), retrievedRecipes, recipeDisplayed);
        });
        filter.addEventListener('focus', (event) => {
            if (document.getElementById('searchbar-input').value.length < 3) {
                recipesToRender.updateFiltersChildrenByTags(retrievedRecipes);
            }
            filters.updateFilterChildrenByInputValue(event.target);
            recipesToRender.displayTag(event.target.getAttribute('data-name'), retrievedRecipes, recipeDisplayed);
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
                        recipesToRender.removeTag('ingredients', event.target, tagItemsNotDisplayed, recipeDisplayed, retrievedRecipes);
                        break;
                    }
                    case 'devices': {
                        recipesToRender.removeTag('devices', event.target, tagItemsNotDisplayed, recipeDisplayed, retrievedRecipes);
                        break;
                    }
                    case 'utensils': {
                        recipesToRender.removeTag('utensils', event.target, tagItemsNotDisplayed, recipeDisplayed, retrievedRecipes);
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
