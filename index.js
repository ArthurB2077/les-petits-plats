import DOMElementFactory from "./frontend/scripts/factory/domElementFactory.js";
import Header from "./frontend/components/Header.js";
import Search from "./frontend/components/Search.js";
import FilterByTags from "./frontend/components/FilterByTags.js";
import Recipes from "./frontend/components/Recipes.js";
import { findInput } from "./frontend/scripts/algorithms/functionalAlgoRecursive.js";
import { overFlowDescription, giveFocusOnOver, isNoResultsForSearch } from "./frontend/scripts/utils/utils.js";

const header = new Header();
header.header;

const search = new Search('root');
search.search;

const filters = new FilterByTags();
const factory = new DOMElementFactory();
const filtersSection = factory.createDOMElement('section', { id: 'dropdown-filters', class: 'mb-4', 'aria-label': 'Section filtres' }, factory.createDOMElement('div', { id: 'tags', class: 'mb-3', 'aria-label': 'Section tags' }));
document.getElementById('root').appendChild(filtersSection);
filters.renderFilters;
filters.handleRollingDropdown;

fetch('./../../api/data/recipe.json')
    .then(res => {
        return res.json();
    })
    .then(recipes => {
        /**
         * This instance allow to create all the recipes from the retrieved json. After that, the following methods
         * allow to create a container for recipes and the recipes themself.
         * @type {Recipes}
         */
        const recipesToRender = new Recipes(recipes, filters);
        recipesToRender.renderRecipeContainer();
        recipesToRender.renderRecipes();
        overFlowDescription();

        /**
         * Global variable that will hold the state of display recipes.
         * @type {Array}
         */
        let recipeDisplayed = recipes;
        /**
         * This 3 global variables will hold the state of selected tags per family (ingredients, devices, utensils).
         * @type {Array, Array, Array}
         */
        const selectedIngredientsArray = [];
        const selectedUtensilsArray = [];
        const selectedApplianceArray = [];

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
                recipeDisplayed = findInput(`${event.target.value}`, recipes);
                recipesToRender.displayRecipes(recipeDisplayed);
                if (selectedIngredientsArray.length !== 0 || selectedUtensilsArray.length !== 0 || selectedApplianceArray.length !== 0) {
                    recipeDisplayed.forEach(recipe => recipesToRender.displayRecipesBySelectedTags(recipe, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray));
                }
                filters.updateFiltersChildrenByTags(recipeDisplayed, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray);
                isNoResultsForSearch();
            } else {
                recipesToRender.displayRecipes(recipes);
                if (selectedIngredientsArray.length !== 0 || selectedUtensilsArray.length !== 0 || selectedApplianceArray.length !== 0) {
                    recipes.forEach(recipe => recipesToRender.displayRecipesBySelectedTags(recipe, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray));
                }
                filters.updateFiltersChildrenByTags(recipes, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray);
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
                recipesToRender.displayTag(event.target.getAttribute('data-name'), recipes, recipeDisplayed, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray);
            });
            filter.addEventListener('focus', (event) => {
                if (document.getElementById('searchbar-input').value.length < 3) {
                    filters.updateFiltersChildrenByTags(recipes, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray);
                }
                filters.updateFilterChildrenByInputValue(event.target);
                recipesToRender.displayTag(event.target.getAttribute('data-name'), recipes, recipeDisplayed, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray);
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
                            recipesToRender.removeTag(selectedIngredientsArray, event.target, tagItemsNotDisplayed, recipeDisplayed, recipes, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray);
                            break;
                        }
                        case 'devices': {
                            recipesToRender.removeTag(selectedApplianceArray, event.target, tagItemsNotDisplayed, recipeDisplayed, recipes, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray);
                            break;
                        }
                        case 'utensils': {
                            recipesToRender.removeTag(selectedUtensilsArray, event.target, tagItemsNotDisplayed, recipeDisplayed, recipes, selectedIngredientsArray, selectedUtensilsArray, selectedApplianceArray);
                            break;
                        }
                        default:
                            break;
                    }
                    document.getElementById(`${tagGroup}-input`).focus();
                });
            });
        });
    });
