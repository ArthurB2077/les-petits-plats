import DOMElementFactory from "../scripts/factory/domElementFactory.js";

const factory = new DOMElementFactory();

class FilterByTags {
    constructor(whereInsert) {
        this.domInsert = (whoInsert) => document.getElementById(whereInsert).appendChild(whoInsert);
    }

    get filters() {
        this.renderFilters();
    }

    renderFilters() {
        const deleteIcon = factory.createDOMElement('svg', { class: 'me-2', width: '20', height: '20', viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, factory.createDOMElement('path', { d: 'M12.59 6L10 8.59L7.41 6L6 7.41L8.59 10L6 12.59L7.41 14L10 11.41L12.59 14L14 12.59L11.41 10L14 7.41L12.59 6ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z', fill: 'white' }));
        const tagName = factory.createDOMElement('span', { class: 'me-2 ms-2' }, 'Coco')
        const tag = factory.createDOMElement('button', { type: 'button', class: 'btn btn-primary p-1' }, tagName, deleteIcon);
        const tagsContainer = factory.createDOMElement('div', { id: 'tags', class: 'mb-3', 'aria-label': 'Section tags' }, tag);

        const filtersSection = factory.createDOMElement('section', { id: 'dropdown-filters', class: 'mb-4', 'aria-label': 'Section filtres' }, tagsContainer);
        for (let i = 0; i < 3; i++) {
            const dropdownList = factory.createDOMElement('ul',  { class: 'dropdown-menu bg-primary' });
            for (let i = 0; i < 3; i++) {
                dropdownList.appendChild(factory.createDOMElement('li', {}, factory.createDOMElement('a', { class: 'dropdown-item text-white', href: '#' }, 'Action')))
            }
            const buttonTitle = factory.createDOMElement('span', { class: 'dropdown-text' }, 'Ingrédients');
            const buttonSpinner = factory.createDOMElement('svg', { width:'16', height: '11', viewBox: '0 0 16 11', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, factory.createDOMElement('path', { d: 'M14.12 0.453369L8 6.56004L1.88 0.453369L0 2.33337L8 10.3334L16 2.33337L14.12 0.453369Z', fill: 'white' }));
            const dropdownButton = factory.createDOMElement('button', { type: 'button', class: 'btn btn-primary btn-lg dropdown-toggle pt-3 pb-3', 'data-bs-toggle': 'dropdown', 'aria-expanded': 'false' }, buttonTitle, buttonSpinner);
            filtersSection.appendChild(factory.createDOMElement('div', { class: 'btn-group me-3' }, dropdownButton, dropdownList))
        }

        return (
            this.domInsert(filtersSection)
        )
    }
}

const filters = new FilterByTags('root');
filters.renderFilters()

export default FilterByTags;
