import DOMElementFactory from "../factory/domElementFactory.js";

const factory = new DOMElementFactory();

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
export const isArrayIncludesInAnotherArray = (arrayIncluded, arrayIncluding) => {
    if (arrayIncluded.length === 0) {
        return true;
    } else {
        return arrayIncluded.every(item => arrayIncluding.map(item => item.toLowerCase()).includes(item.toLowerCase()));
    }
};


/**
 * This function give the focus to the first filter search open after the main search lost focus
 */
export const giveFocusOnOver = () => {
    const openDropdown = Array.from(document.getElementsByClassName('dropdown-button__unroll'))
    if (openDropdown.length !== 0) {
        openDropdown[0].focus();
    }
};


/**
 * This function display a message if no recipes are found
 */
export const isNoResultsForSearch = () => {
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
