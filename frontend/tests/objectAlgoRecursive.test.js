const recipes = require('../../api/data/recipe.json')

function searchRecursivelyTest(searchIn, searchFor, isIncludingSearch){
    if (typeof searchIn === 'object' && !Array.isArray(searchIn)) {
        searchIn = Object.values(searchIn)
    } else if (typeof searchIn === 'string') {
        searchIn = [searchIn.toLowerCase()]
    } else if (typeof searchIn === 'number') {
        searchIn = [searchIn.toString()]
    }

    for (let i = 0; i < searchIn.length; i++) {
        if (typeof searchIn[i] === 'string') {
            if (searchIn[i].toLowerCase().includes(searchFor.toLowerCase())) {
                isIncludingSearch.push(searchIn[i]);
            }
        } else {
            searchRecursivelyTest(searchIn[i], searchFor, isIncludingSearch);
        }
    }
}

const findInputTest = () => {
    const input = 'saumon'
    /**
     * For in method: iterate through each element of the array and add element if they are filtered
     * @type {*[]}
     */
    const filteredArray = []
    for (let i = 0; i < recipes.length; i++) {
        const criteria = [recipes[i].name, recipes[i].description, recipes[i].ingredients]
        const responseSearch = []
        searchRecursivelyTest(criteria, input, responseSearch)
        if (responseSearch.length !== 0) {
            filteredArray.push(recipes[i])
        }
    }
    return filteredArray;
}

test('find 1 recipe for saumon', () => {
    expect(findInputTest('saumon')).toEqual(expect.arrayContaining([{
        "id": 33,
        "name": "Sandwich au saumon fumé",
        "servings": 4,
        "ingredients": [
            {
                "ingredient": "Pain de mie",
                "quantity": 8,
                "unit": "tranches"
            },
            {
                "ingredient": "Saumon Fumé",
                "quantity": 4,
                "unit": "tranches"
            },
            {
                "ingredient": "Feuilles de laitue",
                "quantity": 4
            },
            {
                "ingredient": "Fromage blanc",
                "quantity": 4,
                "unit":"cuillères à soupe"
            },
            {
                "ingredient": "Jus de citron",
                "quantity": 1,
                "unit": "cuillères à soupe"
            }
        ],
        "time": 5,
        "description":"Mélanger le fromage blanc avec le citron. Ajouter un peu de sel et poivre à votre gout. Faire dorer le pain de mie. Puis étaler le mélange. Ajouter une feuille de salade puis le saumon fumé. C'est prêt.",
        "appliance": "Four",
        "ustensils":["couteau", "cuillère en bois"]
    }]))
})
