import DOMElementFactory from "../scripts/factory/domElementFactory.js";

const factory = new DOMElementFactory();
const filtersSection = factory.createDOMElement('section', { id: 'dropdown-filters', class: 'mb-4', 'aria-label': 'Section filtres' }, factory.createDOMElement('div', { id: 'tags', class: 'mb-3', 'aria-label': 'Section tags' }));
document.getElementById('root').appendChild(filtersSection);
const filterProperties = [
    { id: 'ingredients', title: 'Ingrédient', 'bg-color': 'bg-primary', 'btn-color': 'btn-primary', toggle: 'toggle-ing' },
    { id: 'devices', title: 'Appareil', 'bg-color': 'bg-success', 'btn-color': 'btn-success', toggle: 'toggle-dev' },
    { id: 'utensils', title: 'Ustensile', 'bg-color': 'bg-danger', 'btn-color': 'btn-danger', toggle: 'toggle-lis' }
];

class FilterByTags {
    constructor() {
        this.domInsertTags = (contentToInsert) => {
            document.getElementById('tags').appendChild(contentToInsert);
        };
        this.domInsertFilters = (contentToInsert) => {
            document.getElementById('dropdown-filters').appendChild(contentToInsert);
        };
    }

    get renderFilters() {
        this.filtersBuilder();
    }

    get handleRollingDropdown() {
        this.changeDropdownStyle();
    }

    tagsBuilder(tagName, tagGroup) {
        const selectedTags = Array.from(document.getElementById('tags').children).map(item => item.querySelector("span").textContent);

        if (!(selectedTags.includes(tagName))) {
            const deleteIcon = factory.createDOMElement('svg', { class: 'close-tag me-2', width: '20', height: '20', viewBox: '0 0 20 20', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', 'data-group-name': `${tagGroup}` }, factory.createDOMElement('path', { d: 'M12.59 6L10 8.59L7.41 6L6 7.41L8.59 10L6 12.59L7.41 14L10 11.41L12.59 14L14 12.59L11.41 10L14 7.41L12.59 6ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z', fill: 'white', 'pointer-events': 'none' }));
            const tagTitle = factory.createDOMElement('span', { class: 'me-2 ms-2' }, `${tagName}`);
            const tag = factory.createDOMElement('button', { id: `${tagName.toLowerCase()}-tag`, type: 'button', class: 'btn btn-primary p-1' }, tagTitle, deleteIcon);

            return (
                this.domInsertTags(tag)
            )
        }
    }

    filtersBuilder() {
        const dropDownButtonContainer = factory.createDOMElement('div', { class: 'btn-group-container' });

        filterProperties.forEach(filter => {
            const dropdownListContainer = factory.createDOMElement('div',  { class: 'dropdown-list-container' });
            const dropdownList = factory.createDOMElement('div',  { id: `${filter.id}-list`, class: `dropdown-list ${filter['bg-color']}` })
            dropdownListContainer.appendChild(dropdownList)

            const buttonTitle = factory.createDOMElement('input', { id: `${filter.id}-input`, class: 'dropdown-button__input', placeholder: `${filter.title}`, disabled: '', 'data-name': `${filter.id}` });
            const buttonSpinner = factory.createDOMElement('svg', { id: `${filter.toggle}`, class: 'dropdown-spinner', 'data-toggle': 'rolled', width:'20px', height: '20px', padding: '10px', viewBox: '0 0 16 11', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, factory.createDOMElement('path', { d: 'M14.12 0.453369L8 6.56004L1.88 0.453369L0 2.33337L8 10.3334L16 2.33337L14.12 0.453369Z', fill: 'white' }));
            const dropdownButton = factory.createDOMElement('button', { type: 'button', class: `dropdown-button btn ${filter['btn-color']} btn-lg pt-3 pb-3`, 'aria-expanded': 'false' }, buttonTitle, buttonSpinner);
            dropDownButtonContainer.appendChild(factory.createDOMElement('div', { id: `${filter.title.toLowerCase()}-group`, class: 'dropdown-btn-group me-3' }, dropdownButton, dropdownListContainer));
        })

        return (
            this.domInsertFilters(dropDownButtonContainer)
        )
    }

    changeDropdownStyle() {
        filterProperties.forEach(filter => {
            document.getElementById(`${filter.toggle}`).addEventListener('click', (event) => {
                event.stopPropagation();
                const parentGroup = document.getElementById(`${filter.title.toLowerCase()}-group`);
                const dropdownContainer = parentGroup.childNodes[1];
                const dropdownButton = parentGroup.childNodes[0];
                const dropdownInput = dropdownButton.childNodes[0];
                const dropdownIcon = document.getElementById(filter.toggle);

                if (event.target.getAttribute('data-toggle') === 'rolled') {
                    dropdownContainer.classList.replace('dropdown-list-container', 'dropdown-list-container__unroll');
                    dropdownButton.classList.replace('dropdown-button', 'dropdown-button__unroll');
                    dropdownIcon.style.transform = 'rotate(180deg)';
                    dropdownInput.setAttribute('placeholder', `Rechercher un ${filter.title.toLowerCase()}`);
                    dropdownInput.removeAttribute('disabled');
                    event.target.setAttribute('data-toggle', 'unrolled');
                    document.getElementById(`${filter.id}-input`).focus()
                } else if (event.target.getAttribute('data-toggle') === 'unrolled') {
                    dropdownContainer.classList.replace('dropdown-list-container__unroll', 'dropdown-list-container');
                    dropdownButton.classList.replace('dropdown-button__unroll', 'dropdown-button');
                    dropdownIcon.style.transform = 'rotate(0deg)';
                    dropdownInput.setAttribute('placeholder', `${filter.title}s`);
                    dropdownInput.setAttribute('disabled', '');
                    event.target.setAttribute('data-toggle', 'rolled')
                }
            })
        })

    }
}

export const filters = new FilterByTags();

filters.renderFilters;
filters.handleRollingDropdown;

export default FilterByTags;
