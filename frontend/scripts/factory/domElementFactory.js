/**
 *Class that automates part of the process of creating dynamic DOM elements.
 */
class DOMElementFactory {
    constructor () {
        /**
         * Method allowing the creation of a dynamic DOM element. It takes three arguments: the type of the HTML tag
         * to create (div, span, h1 ...), a Javascript object whose key/value pairs represent the attributes/values of
         * the element to create (class: "my-class-css", aria-label: "Description" ...) and a(n) variable for the child(s)
         * or the content to be included in the tag (text, tag ...).
         * @param type
         * @param attributes
         * @param children
         * @returns {*}
         */
        this.createDOMElement = (type, attributes, ...children) => {
            /**
             * Checks if the item's type matches an svg.
             * If yes, use the appropriate method to create a vector DOM element.
             * If not, use the classic Javascript method to create a DOM element.
             */
            let element
            if (type === 'svg' || type === 'path') {
                element = document.createElementNS('http://www.w3.org/2000/svg', type)
            } else {
                element = document.createElement(type)
            }
            /**
             * Loop iterating through the key/value pairs of our object containing the attributes/value of our
             * element and appending them to it using the setAttribute("attribute", "value") method.
             */
            for (const key in attributes) {
                element.setAttribute(key, attributes[key])
            }
            /**
             * If children is a list, iterate through it and add each element as a child to the element
             * DOM being created.
             * If children is a string, add this as the content of our element.
             */
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.innerText = child
                } else {
                    element.appendChild(child)
                }
            })

            return element
        }
    }
}

export default DOMElementFactory;
