const recipes = require('../../api/data/recipe.json')

const searchByLoopingTest = (searchIn, searchFor, isIncludingSearch) => {
    searchIn.forEach(el => {
        if (typeof el === 'number') {
            el = el.toString()
        }
        if (typeof el === 'string') {
            if (el.toLowerCase().includes(searchFor.toLowerCase())) {
                isIncludingSearch.push(el)
            }
        } else if (Array.isArray(el)) {
            el.forEach(obj => {
                const values = Object.values(obj)
                values.forEach(str => {
                    if (typeof str === 'string') {
                        if (str.toLowerCase().includes(searchFor.toLowerCase())) {
                            isIncludingSearch.push(str)
                        }
                    }
                })
            })
        }
    })
}

const findInputTest = () => {
    const input = 'saumon';

    return recipes.map(el => {
        const criteria = [el.name, el.description, el.ingredients];
        const responseSearch = [];
        searchByLoopingTest(criteria, input, responseSearch);
        if (responseSearch.length !== 0) {
            return el;
        }
    })
}

test('find 1 recipe for saumon', () => {
    expect(findInputTest('saumon')).toEqual(expect.arrayContaining([undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, {"appliance": "Four", "description": "Mélanger le fromage blanc avec le citron. Ajouter un peu de sel et poivre à votre gout. Faire dorer le pain de mie. Puis étaler le mélange. Ajouter une feuille de salade puis le saumon fumé. C'est prêt.", "id": 33, "ingredients": [{"ingredient": "Pain de mie", "quantity": 8, "unit": "tranches"}, {"ingredient": "Saumon Fumé", "quantity": 4, "unit": "tranches"}, {"ingredient": "Feuilles de laitue", "quantity": 4}, {"ingredient": "Fromage blanc", "quantity": 4, "unit": "cuillères à soupe"}, {"ingredient": "Jus de citron", "quantity": 1, "unit": "cuillères à soupe"}], "name": "Sandwich au saumon fumé", "servings": 4, "time": 5, "ustensils": ["couteau", "cuillère en bois"]}, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]))
})

