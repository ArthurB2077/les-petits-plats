import DOMElementFactory from "../scripts/factory/domElementFactory.js";

const factory = new DOMElementFactory();

class Search {
    constructor(input, icon, whereInsert) {
        this.input = input;
        this.icon = icon;
        this.domInsert = (whoInsert) => document.getElementById(whereInsert).appendChild(whoInsert)
    }

    get search() {
        this.renderSearch();
    }

    renderSearch() {
        /**
         * Container for input and his icon
         */
        const searchContainer = factory.createDOMElement('div', { id: 'searchbar', class: 'input-group input-group-lgd-flex align-items-center', role: 'searchbox' }, this.input, this.icon);
        /**
         * Search section of the document
         * @type {*}
         */
        const searchSection = factory.createDOMElement('section', { id: 'search', class: 'mb-4', 'aria-label': 'Section de recherche' }, searchContainer);

        return (
            this.domInsert(searchSection)
        )
    }
}
const input = factory.createDOMElement('input', { id: 'searchbar-input', class: 'searchbar-input form-control me-2', type: 'search', placeholder: 'Rechercher un ingrédient, appareil, ustensiles ou une recette', 'aria-label': 'Barre de recherche' });
const icon = factory.createDOMElement('svg', { class: 'me-3', 'aria-label': 'Loupe', width: '33', height: '33', viewBox: '0 0 33 33', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, factory.createDOMElement('path', {d: 'M23.4167 20.6667H21.9683L21.455 20.1717C23.2517 18.0817 24.3333 15.3683 24.3333 12.4167C24.3333 5.835 18.9983 0.5 12.4167 0.5C5.835 0.5 0.5 5.835 0.5 12.4167C0.5 18.9983 5.835 24.3333 12.4167 24.3333C15.3683 24.3333 18.0817 23.2517 20.1717 21.455L20.6667 21.9683V23.4167L29.8333 32.565L32.565 29.8333L23.4167 20.6667ZM12.4167 20.6667C7.85167 20.6667 4.16667 16.9817 4.16667 12.4167C4.16667 7.85167 7.85167 4.16667 12.4167 4.16667C16.9817 4.16667 20.6667 7.85167 20.6667 12.4167C20.6667 16.9817 16.9817 20.6667 12.4167 20.6667Z', fill: 'black'}));
const search = new Search(input, icon, 'root');
search.renderSearch();

export default Search;
