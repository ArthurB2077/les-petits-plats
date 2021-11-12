/**
 * Functional algorithm using only forEach methods and recursive search
 */

/**
 * Recursive function
 */
export const searchRecursively = (searchIn, searchFor, isIncludingSearch) => {
    if (typeof searchIn === 'object' && !Array.isArray(searchIn)) {
        searchIn = Object.values(searchIn);
    } else if (typeof searchIn === 'string') {
        searchIn = [searchIn.toLowerCase()];
    } else if (typeof searchIn === 'number') {
        searchIn = [searchIn.toString()];
    }
    searchIn.some(el => {
        if (typeof el === 'string') {
            if (el.toLowerCase().includes(searchFor.toLowerCase())) {
                isIncludingSearch.push(el);
            }
        } else {
            searchRecursively(el, searchFor, isIncludingSearch);
        }
    });
}

export const findInput = (input, datas) => {
    /**
     * ForEach method: create an empty array edit and add filtered elements with the forEach method
     * @type {*[]}
     */
    if(input) {
        const filteredArray = [];
        datas.forEach(el => {
            const criteria = [el.name, el.description, el.ingredients];
            const responseSearch = [];
            searchRecursively(criteria, input, responseSearch)
            if (responseSearch.length !== 0) {
                filteredArray.push(el);
            }
        });
        return filteredArray;
    } else {
        return datas;
    }
}

