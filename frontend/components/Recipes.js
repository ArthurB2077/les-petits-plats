import DOMElementFactory from "../scripts/factory/domElementFactory.js";
import { findInput } from "../scripts/algorithms/functionalAlgoRecursive.js";
import { filters } from "./FilterByTags.js";

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

fetch('./../../api/data/recipe.json')
    .then(res => {
        return res.json();
    })
    .then(recipes => {
        const recipesToRender = new Recipes(recipes);
        recipesToRender.renderRecipeContainer();
        recipesToRender.renderRecipes();

        let recipeDisplayed = recipes;
        const selectedIngredientsArray = [];
        const selectedUtensilsArray = [];
        const selectedApplianceArray = [];

        const isArrayIncludesInAnotherArray = (arrayIncluded, arrayIncluding) => {
            if (arrayIncluded.length === 0) {
                return true;
            } else {
                return arrayIncluded.every(item => arrayIncluding.map(item => item.toLowerCase()).includes(item.toLowerCase()));
            }
        };
        const updateDropdownList = (newRecipes) => {
            const ingredientFilter = document.getElementById('ingredients-list');
            const deviceFilter = document.getElementById('devices-list');
            const utensilFilter = document.getElementById('utensils-list');
            const tags = Array.from(document.getElementById('tags').children).map(item => item.querySelector('span').textContent);
            const preventDoppelgangerIng = [];
            const preventDoppelgangerUst = [];
            const preventDoppelgangerDev = [];

            if (newRecipes.length !== 0) {
                Array.from(ingredientFilter.childNodes).forEach(child => {
                    child.remove();
                });
                Array.from(deviceFilter.childNodes).forEach(child => {
                    child.remove();
                });
                Array.from(utensilFilter.childNodes).forEach(child => {
                    child.remove();
                });

                newRecipes.forEach(recipe => {
                    recipe.ingredients.forEach(ing => {
                        if (!(preventDoppelgangerIng.includes(ing.ingredient.toLowerCase()))){preventDoppelgangerIng.push(ing.ingredient.toLowerCase());}
                    })
                    if (!preventDoppelgangerDev.includes(recipe.appliance.toLowerCase())){preventDoppelgangerDev.push(recipe.appliance.toLowerCase());}
                    recipe.ustensils.forEach(ust => {
                        if (!preventDoppelgangerUst.includes(ust.toLowerCase())){preventDoppelgangerUst.push(ust.toLowerCase());}
                    })
                });

                preventDoppelgangerIng.forEach((ing) => {
                    if (!(tags.includes(ing.replace(ing[0], ing[0].toUpperCase())))) {
                        ingredientFilter.appendChild(factory.createDOMElement('a', { class: 'dropdown-filter-item__ingredients text-white', href: '#', 'data-group-name': 'selectedIngredientsArray' }, `${ing.replace(ing[0], ing[0].toUpperCase())}`));
                    }
                });
                preventDoppelgangerDev.forEach(dev => {
                    if (!(tags.includes(dev.replace(dev[0], dev[0].toUpperCase())))) {
                        deviceFilter.appendChild(factory.createDOMElement('a', { class: 'dropdown-filter-item__devices text-white', href: '#', 'data-group-name': 'selectedApplianceArray' }, `${dev.replace(dev[0], dev[0].toUpperCase())}`));
                    }
                });
                preventDoppelgangerUst.forEach(ust => {
                    if (!(tags.includes(ust.replace(ust[0], ust[0].toUpperCase())))) {
                        utensilFilter.appendChild(factory.createDOMElement('a', { class: 'dropdown-filter-item__utensils text-white', href: '#', 'data-group-name': 'selectedUtensilsArray' }, `${ust.replace(ust[0], ust[0].toUpperCase())}`));
                    }
                });
            } else {
                Array.from(ingredientFilter.childNodes).forEach(child => {
                    child.remove();
                });
                Array.from(deviceFilter.childNodes).forEach(child => {
                    child.remove();
                });
                Array.from(utensilFilter.childNodes).forEach(child => {
                    child.remove();
                });
            }
        };
        const updateDropdownListByTags = (recipesArray) => {
            if (selectedIngredientsArray.length !== 0 || selectedUtensilsArray.length !== 0 || selectedApplianceArray.length !== 0) {
                const domRecipes = Array.from(document.getElementById('recipes').querySelectorAll('div[style="display: flex;"]'));
                const filterCriteria = domRecipes.map(item => item.id);
                updateDropdownList(recipesArray.filter(recipe => filterCriteria.includes(recipe.id.toString())));
            } else {
                updateDropdownList(recipesArray);
            }
        };
        const displayRecipes = (recipesToDisplay) => {
            Array.from(document.getElementsByClassName('recipe')).forEach(el => el.style.display = 'none');
            recipesToDisplay.forEach(recipe => document.getElementById(`${recipe.id}`).style.display = 'flex');
        };
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
        const displayTag = (tagType) => {
            const tagItemsDisplayed = Array.from(document.getElementsByClassName(`dropdown-filter-item__${tagType}`)).filter(item => item.getAttribute('style') === 'display: flex;');
            tagItemsDisplayed.forEach(tagItem => {
                tagItem.addEventListener('click', (event) => {
                    filters.tagsBuilder(event.target.textContent, tagType);
                    if (event.target.getAttribute('data-group-name') === "selectedIngredientsArray") {
                        selectedIngredientsArray.push(event.target.textContent);
                    } else if (event.target.getAttribute('data-group-name') === "selectedUtensilsArray") {
                        selectedUtensilsArray.push(event.target.textContent);
                    } else if (event.target.getAttribute('data-group-name') === "selectedApplianceArray") {
                        selectedApplianceArray.push(event.target.textContent);
                    }
                    event.target.style.display = 'none';
                    document.getElementById(`${tagType}-input`).value = '';

                    recipes.forEach(recipe => {
                        displayRecipesBySelectedTags(recipe);
                    });

                    if (event.target.getAttribute('data-group-name') === "selectedIngredientsArray") {
                        if (selectedIngredientsArray.length !== 0) {
                            const domRecipes = Array.from(document.getElementById('recipes').querySelectorAll('div[style="display: flex;"]'));
                            const filterCriteria = domRecipes.map(item => item.id);
                            updateDropdownList(recipes.filter(recipe => filterCriteria.includes(recipe.id.toString())));
                        } else {
                            updateDropdownList(recipes);
                        }
                    } else if (event.target.getAttribute('data-group-name') === "selectedUtensilsArray") {
                        if (selectedUtensilsArray.length !== 0) {
                            const domRecipes = Array.from(document.getElementById('recipes').querySelectorAll('div[style="display: flex;"]'));
                            const filterCriteria = domRecipes.map(item => item.id);
                            updateDropdownList(recipes.filter(recipe => filterCriteria.includes(recipe.id.toString())));
                        } else {
                            updateDropdownList(recipes);
                        }
                    } else if (event.target.getAttribute('data-group-name') === "selectedApplianceArray") {
                        if (selectedApplianceArray.length !== 0) {
                            const domRecipes = Array.from(document.getElementById('recipes').querySelectorAll('div[style="display: flex;"]'));
                            const filterCriteria = domRecipes.map(item => item.id);
                            updateDropdownList(recipes.filter(recipe => filterCriteria.includes(recipe.id.toString())));
                        } else {
                            updateDropdownList(recipes);
                        }
                    }
                })
            })
        };

        /**
         *
         */
        document.getElementById('searchbar-input').addEventListener('input', (event) => {
            if (event.target.value.length > 2) {
                recipeDisplayed = findInput(`${event.target.value}`, recipes);
                displayRecipes(recipeDisplayed);
                /**
                 * If a new search is initialise check if tags as already selected in a previous search. If it the case,
                 * filter the recipes depending on the selected tags
                 */
                if (selectedIngredientsArray.length !== 0 || selectedUtensilsArray.length !== 0 || selectedApplianceArray.length !== 0) {
                    recipeDisplayed.forEach(recipe => displayRecipesBySelectedTags(recipe));
                }
                updateDropdownListByTags(recipeDisplayed);
            } else {
                displayRecipes(recipes);
                if (selectedIngredientsArray.length !== 0 || selectedUtensilsArray.length !== 0 || selectedApplianceArray.length !== 0) {
                    recipes.forEach(recipe => displayRecipesBySelectedTags(recipe));
                }
                updateDropdownListByTags(recipes);
            }
        });

        document.getElementById('searchbar-input').addEventListener('blur', () => {
            document.getElementById('ingredients-list').addEventListener('mouseover', () => {
                const filterInput = document.getElementById('ingredients-input');
                filterInput.focus();
            })
            document.getElementById('utensils-list').addEventListener('mouseover', () => {
                const filterInput = document.getElementById('utensils-input');
                filterInput.focus();
            })
            document.getElementById('devices-list').addEventListener('mouseover', () => {
                const filterInput = document.getElementById('devices-input');
                filterInput.focus();
            })
        });

        Array.from(document.getElementsByClassName('dropdown-button__input')).forEach(filter => {
            filter.addEventListener('input', (event) => {
                const parentElement = event.target.parentElement.nextElementSibling.firstElementChild;
                const elementsToFilter = Array.from(parentElement.children);
                const tags = Array.from(document.getElementById('tags').children).map(item => item.querySelector("span").textContent);
                const elementsFiltered = elementsToFilter.filter(listedTag => !tags.join().includes(listedTag.textContent))

                if(event.target.value.length > 2) {
                    elementsFiltered.forEach(el => {
                        el.style.display = 'flex';
                    });
                    elementsFiltered.forEach(el => {
                        if (!(el.textContent.toLowerCase().includes(event.target.value.toLowerCase()))) {el.style.display = 'none';}
                    });
                } else {
                    elementsFiltered.forEach(el => {
                        el.style.display = 'flex';
                    });
                }
            });
            filter.addEventListener('change', (event) => {
                displayTag(event.target.getAttribute('data-name'));
            });
            filter.addEventListener('focus', (event) => {
                if (document.getElementById('searchbar-input').value.length < 3) {
                    updateDropdownListByTags(recipes);
                }

                const parentElement = event.target.parentElement.nextElementSibling.firstElementChild;
                const elementsToFilter = Array.from(parentElement.children);
                const tags = Array.from(document.getElementById('tags').children).map(item => item.querySelector("span").textContent);
                const elementsFiltered = elementsToFilter.filter(listedTag => !tags.join().includes(listedTag.textContent));

                if(event.target.value.length > 2) {
                    elementsFiltered.forEach(el => {
                        el.style.display = 'flex';
                    });
                    elementsFiltered.forEach(el => {
                        if (!(el.textContent.toLowerCase().includes(event.target.value.toLowerCase()))) {el.style.display = 'none';}
                    });
                } else {
                    elementsFiltered.forEach(el => {
                        el.style.display = 'flex';
                    });
                }
                displayTag(event.target.getAttribute('data-name'));
            });
        });

        document.getElementById('tags').addEventListener('mouseover', () => {
            const tagsCloseButtons = Array.from(document.getElementsByClassName('close-tag'));
            tagsCloseButtons.forEach(closeTag => {
                closeTag.addEventListener('click', (event) => {
                    const tagToClose = event.target.parentElement;
                    const tagGroup = event.target.getAttribute('data-group-name');
                    const tagItemsNotDisplayed = Array.from(document.getElementsByClassName(`dropdown-filter-item__${tagGroup}`)).filter(item => item.getAttribute('style') === 'display: none;');

                    tagToClose.remove();

                    if (tagGroup === 'ingredients') {
                        selectedIngredientsArray.forEach((tag, index) => {
                            if (tag === event.target.parentElement.firstElementChild.textContent) {
                                selectedIngredientsArray.splice(index, 1);
                                tagItemsNotDisplayed.forEach(tagItem => {
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
                        updateDropdownListByTags(recipeDisplayed);

                    } else if (tagGroup === 'devices') {
                        selectedApplianceArray.forEach((tag, index) => {
                            if (tag === event.target.parentElement.firstElementChild.textContent) {
                                selectedApplianceArray.splice(index, 1);
                                tagItemsNotDisplayed.forEach(tagItem => {
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
                        updateDropdownListByTags(recipeDisplayed);

                    } else if (tagGroup === 'utensils') {
                        selectedUtensilsArray.forEach((tag, index) => {
                            if (tag === event.target.parentElement.firstElementChild.textContent) {
                                selectedUtensilsArray.splice(index, 1);
                                tagItemsNotDisplayed.forEach(tagItem => {
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
                        updateDropdownListByTags(recipeDisplayed);
                    }
                })
            })
        })
    })

export default Recipe;
