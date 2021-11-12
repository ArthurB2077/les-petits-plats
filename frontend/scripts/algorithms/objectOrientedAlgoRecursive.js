/**
 * Object oriented algorithm using only for in methods and recursive search
 */

/**
 * Recursive function
 */
export const searchRecursively = (searchIn, searchFor, isIncludingSearch) => {
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
                break;
            }
        } else {
            searchRecursively(searchIn[i], searchFor, isIncludingSearch);
        }
    }
}

export const findInput = (input, datas) => {
    /**
     * For in method: iterate through each element of the array and add element if they are filtered
     * @type {*[]}
     */
    if(input) {
        const filteredArray = [];
        for (let i = 0; i < datas.length; i++) {
            const criteria = [datas[i].name, datas[i].description, datas[i].ingredients]
            const responseSearch = []
            searchRecursively(criteria, input, responseSearch)
            if (responseSearch.length !== 0) {
                filteredArray.push(datas[i])
            }
        }
        return filteredArray;
    } else {
        return datas;
    }
}

