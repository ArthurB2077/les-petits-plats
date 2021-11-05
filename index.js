import DOMElementFactory from "./frontend/scripts/factory/domElementFactory.js";
import Header from "./frontend/components/Header.js";
import Search from "./frontend/components/Search.js";
import FilterByTags from "./frontend/components/FilterByTags.js";
import Recipes from "./frontend/components/Recipes.js";
import { findInput } from "./frontend/scripts/algorithms/functionalAlgoRecursive.js";

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
         * This function check the size of each description paragraph and if it's exceed a maximum length add a style
         * to notify that is hidden
         */
        const overFlowDescription = () => {
            Array.from(document.getElementsByClassName('recipe-instructions')).forEach((p) => {
                if (p.textContent.length > 380) {
                    p.style.position = 'relative';
                }
            })
        };
        /**
         * This instance allow to create all the recipes from the retrieved json. After that, the following methods
         * allow to create a container for recipes and the recipes themself.
         * @type {Recipes}
         */
        const recipesToRender = new Recipes(recipes);
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
         * This function take two array in input and check if the elements of the first array are include in the
         * second array and return if it's true or false. If the first array is empty return true. Why that ? Because
         * we want to display recipes that contains filter in the first and second and third array. So, if the first
         * array is empty it has to return true for the triple logical "and" will return true when we want to check if
         * all the content of the selected arrays are including in the content of recipes properties
         * @param arrayIncluded => Array that will receive selected tags
         * @param arrayIncluding => Array that will receive the recipes properties corresponding to selected tags
         * @returns {boolean|*} => Boolean that validate or not if the recipe contain selected tags
         */
        const isArrayIncludesInAnotherArray = (arrayIncluded, arrayIncluding) => {
            if (arrayIncluded.length === 0) {
                return true;
            } else {
                return arrayIncluded.every(item => arrayIncluding.map(item => item.toLowerCase()).includes(item.toLowerCase()));
            }
        };
        /**
         * This function give the focus to the first filter search open after the main search lost focus
         */
        const giveFocusOnOver = () => {
            const openDropdown = Array.from(document.getElementsByClassName('dropdown-button__unroll'))
            if (openDropdown.length !== 0) {
                openDropdown[0].focus();
            }
        };
        /**
         * This function display a message if no recipes are found
         */
        const isNoResultsForSearch = () => {
            const recipesDisplay = Array.from(document.getElementsByClassName('recipe')).filter(rec => rec.getAttribute('style') === 'display: flex;');
            if (recipesDisplay.length === 0) {
                if (!document.getElementById('recipe-not-found')) {
                    document.getElementById('recipes').appendChild(factory.createDOMElement('p', { id: 'recipe-not-found', class: 'text-center' }, '« Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.'));
                }
            } else {
                if (document.getElementById('recipe-not-found') !== null) {
                    document.getElementById('recipe-not-found').remove();
                }
            }
        };

        /**
         * This function remove the children of a DOM element. It's use for update the filter children in the dropdown
         * filter list
         * @param filters => The dropdown list in which his children need to be remove
         */
        const removeFilterChildren = (...filters) => {
            filters.forEach(filter => Array.from(filter.childNodes).forEach(child => child.remove()));
        };
        /**
         * This function take in input all the informations to create the children of a dropdown list and create all his
         * children
         * @param noDuplicateFilters => Arrays of tags with no duplicates to insert in dropdown list
         * @param filter => The dropdown list which will receive the tags to display
         * @param tagsArray => Array of the actual selected tags to prevent to insert in the dropdown list selected tags
         * @param filterType => Family of the tags (ingredients, devices, utensils)
         * @param selectedTagsArrayName => Selected tags array corresponding to the family tag
         */
        const createFilterChildren = (noDuplicateFilters, filter, tagsArray, filterType, selectedTagsArrayName) => {
            noDuplicateFilters.forEach((tag) => {
                if (!(tagsArray.includes(tag.replace(tag[0], tag[0].toUpperCase())))) {
                    filter.appendChild(factory.createDOMElement('a', { class: `dropdown-filter-item__${filterType} text-white`, href: '#', 'data-group-name': `${selectedTagsArrayName}` }, `${tag.replace(tag[0], tag[0].toUpperCase())}`));
                }
            });
        }
        /**
         * This function handle the refresh of the tag items in the dropdown list depending of the recipes display
         * @param newRecipes => Array containing the recipes display
         */
        const updateFiltersChildren = (newRecipes) => {
            const ingredientFilter = document.getElementById('ingredients-list');
            const deviceFilter = document.getElementById('devices-list');
            const utensilFilter = document.getElementById('utensils-list');
            const tags = Array.from(document.getElementById('tags').children).map(item => item.querySelector('span').textContent);
            const preventDoppelgangerIng = [];
            const preventDoppelgangerUst = [];
            const preventDoppelgangerDev = [];

            if (newRecipes.length !== 0) {
                removeFilterChildren(ingredientFilter, deviceFilter, utensilFilter);
                newRecipes.forEach(recipe => {
                    recipe.ingredients.forEach(ing => {
                        if (!(preventDoppelgangerIng.includes(ing.ingredient.toLowerCase()))){preventDoppelgangerIng.push(ing.ingredient.toLowerCase());}
                    });
                    if (!preventDoppelgangerDev.includes(recipe.appliance.toLowerCase())){preventDoppelgangerDev.push(recipe.appliance.toLowerCase());}
                    recipe.ustensils.forEach(ust => {
                        if (!preventDoppelgangerUst.includes(ust.toLowerCase())){preventDoppelgangerUst.push(ust.toLowerCase());}
                    });
                });
                createFilterChildren(preventDoppelgangerIng, ingredientFilter, tags, 'ingredients', 'selectedIngredientsArray');
                createFilterChildren(preventDoppelgangerDev, deviceFilter, tags, 'devices', 'selectedApplianceArray');
                createFilterChildren(preventDoppelgangerUst, utensilFilter, tags, 'utensils', 'selectedUtensilsArray');
            } else {
                removeFilterChildren(ingredientFilter, deviceFilter, utensilFilter);
            }
        };
        /**
         * This function handle the refresh of the tags items in the dropdown list depending of the tags selected
         * and the recipes
         * @param recipesArray => Array of display recipes which allow dropdown list children to be filtered
         */
        const updateFiltersChildrenByTags = (recipesArray) => {
            if (selectedIngredientsArray.length !== 0 || selectedUtensilsArray.length !== 0 || selectedApplianceArray.length !== 0) {
                const domRecipes = Array.from(document.getElementById('recipes').querySelectorAll('div[style="display: flex;"]'));
                const filterCriteria = domRecipes.map(item => item.id);
                updateFiltersChildren(recipesArray.filter(recipe => filterCriteria.includes(recipe.id.toString())));
            } else {
                updateFiltersChildren(recipesArray);
            }
        };
        /**
         * This function handle the refresh of the tags items in the dropdown list depending on what the user is typing
         * in the filter input (ingredients, devices, utensils)
         * @param element
         */
        const updateFilterChildrenByInputValue = (element) => {
            const parentElement = element.parentElement.nextElementSibling.firstElementChild;
            const elementsToFilter = Array.from(parentElement.children);
            const tags = Array.from(document.getElementById('tags').children).map(item => item.querySelector("span").textContent);
            const elementsFiltered = elementsToFilter.filter(listedTag => !tags.join().includes(listedTag.textContent))

            if(element.value.length > 2) {
                elementsFiltered.forEach(el => {
                    el.style.display = 'flex';
                });
                elementsFiltered.forEach(el => {
                    if (!(el.textContent.toLowerCase().includes(element.value.toLowerCase()))) {el.style.display = 'none';}
                });
            } else {
                elementsFiltered.forEach(el => {
                    el.style.display = 'flex';
                });
            }
        };

        /**
         * This function hide all recipes and, after that, display only those it had receive in input
         * @param recipesToDisplay => Array of recipes to be display
         */
        const displayRecipes = (recipesToDisplay) => {
            Array.from(document.getElementsByClassName('recipe')).forEach(el => el.style.display = 'none');
            recipesToDisplay.forEach(recipe => document.getElementById(`${recipe.id}`).style.display = 'flex');
        };
        /**
         * This function filters recipes by selected tags. If the recipes have properties that matching the selected
         * tags, those recipes are display
         * @param recipeToFilter => Array holding the recipes to be filtered
         */
        const displayRecipesBySelectedTags = (recipeToFilter) => {
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
         */
        const displayTag = (tagType) => {
            const tagItemsDisplayed = Array.from(document.getElementsByClassName(`dropdown-filter-item__${tagType}`)).filter(item => item.getAttribute('style') === 'display: flex;');
            tagItemsDisplayed.forEach(tagItem => {
                tagItem.addEventListener('click', (event) => {
                    filters.tagsBuilder(event.target.textContent, tagType);
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
                    recipes.forEach(recipe => {
                        displayRecipesBySelectedTags(recipe);
                    });
                    switch (event.target.getAttribute('data-group-name')) {
                        case 'selectedIngredientsArray': {
                            if (selectedIngredientsArray.length !== 0) {
                                const domRecipes = Array.from(document.getElementById('recipes').querySelectorAll('div[style="display: flex;"]'));
                                const filterCriteria = domRecipes.map(item => item.id);
                                updateFiltersChildren(recipes.filter(recipe => filterCriteria.includes(recipe.id.toString())));
                            } else {
                                updateFiltersChildren(recipes);
                            }
                            break;
                        }
                        case 'selectedUtensilsArray': {
                            if (selectedUtensilsArray.length !== 0) {
                                const domRecipes = Array.from(document.getElementById('recipes').querySelectorAll('div[style="display: flex;"]'));
                                const filterCriteria = domRecipes.map(item => item.id);
                                updateFiltersChildren(recipes.filter(recipe => filterCriteria.includes(recipe.id.toString())));
                            } else {
                                updateFiltersChildren(recipes);
                            }
                            break;
                        }
                        case 'selectedApplianceArray': {
                            if (selectedApplianceArray.length !== 0) {
                                const domRecipes = Array.from(document.getElementById('recipes').querySelectorAll('div[style="display: flex;"]'));
                                const filterCriteria = domRecipes.map(item => item.id);
                                updateFiltersChildren(recipes.filter(recipe => filterCriteria.includes(recipe.id.toString())));
                            } else {
                                updateFiltersChildren(recipes);
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
         */
        const removeTag = (selectedTagArray, element, tagsNotDisplayed) => {
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
                displayRecipes(recipeDisplayed);
            } else {
                recipeDisplayed = findInput(`${document.getElementById('searchbar-input').value}`, recipes);
                recipeDisplayed.forEach(recipe => {
                    displayRecipesBySelectedTags(recipe);
                })
            }
            updateFiltersChildrenByTags(recipeDisplayed);
        };

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
                displayRecipes(recipeDisplayed);
                if (selectedIngredientsArray.length !== 0 || selectedUtensilsArray.length !== 0 || selectedApplianceArray.length !== 0) {
                    recipeDisplayed.forEach(recipe => displayRecipesBySelectedTags(recipe));
                }
                updateFiltersChildrenByTags(recipeDisplayed);
                isNoResultsForSearch();
            } else {
                displayRecipes(recipes);
                if (selectedIngredientsArray.length !== 0 || selectedUtensilsArray.length !== 0 || selectedApplianceArray.length !== 0) {
                    recipes.forEach(recipe => displayRecipesBySelectedTags(recipe));
                }
                updateFiltersChildrenByTags(recipes);
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
                updateFilterChildrenByInputValue(event.target);
            });
            filter.addEventListener('change', (event) => {
                displayTag(event.target.getAttribute('data-name'));
            });
            filter.addEventListener('focus', (event) => {
                if (document.getElementById('searchbar-input').value.length < 3) {
                    updateFiltersChildrenByTags(recipes);
                }
                updateFilterChildrenByInputValue(event.target);
                displayTag(event.target.getAttribute('data-name'));
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
                            removeTag(selectedIngredientsArray, event.target, tagItemsNotDisplayed);
                            break;
                        }
                        case 'devices': {
                            removeTag(selectedApplianceArray, event.target, tagItemsNotDisplayed);
                            break;
                        }
                        case 'utensils': {
                            removeTag(selectedUtensilsArray, event.target, tagItemsNotDisplayed);
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
