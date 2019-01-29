import {$} from '../factories/SelectorsFactory';
import {View} from './View';

/**
 * View para renderização dos itens
 * 
 * @class 
 */
class ItemsView extends View {

    constructor(element) {
        super(element);
    }

    /**
     * Template a ser renderizada
     * 
     * @param {Array} model (Required) Dados para renderização
     */
    template(model) {

        return model.map(category => `
        <div class="list__items-category">
        <h1>${category.name}</h1>
        <ul class="list__items column">
            <!--Itens-->
               ${category.itemsCategory.map(item =>`
               <li class="list__item row">
                <span class="list__item-name">${item.name}</span>
                <div class="list__qtd row">
                    <span class="qtd">${item.qtd}</span><span class="measure">${item.measure}</span>
                </div>
                <!--Change amount-->
                <div class="change-amount row">
                    <a class="amount minus icon-amount change-buttons minus-button opacity"></a>
                        <span  class="change-amount-span unit opacity ">${item.unit}</span>
                    <a class="amount plus icon-amount change-buttons plus-button"></a>
                </div>`).join('')}
                </li> 
            </ul>
            </div>`).join('');

    }

}

const instance = new ItemsView($('#js-list'));

/**
 * Singleton ItemsView
 * @function itemsViewInstance
 * @returns instance
 */

Object.freeze(instance);
export function itemsViewInstance() {
    return instance;
}