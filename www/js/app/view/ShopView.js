import {$} from '../factories/SelectorsFactory';
import {View} from './View';

/**
 * View para renderização dos itens de compras
 * 
 * @class 
 */
class ShopView extends View {

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
                                    <!--Items-->
                                    ${category.itemsCategory.map(item=>`
                                    <li class="list__item-shop row">
                                        <!--Change amount-->
                                        <div class="change-amount-shop row">
                                            <span class="unit">${item.unit}</span>
                                        </div>
                                        <span class="list__item-name-shop name ">${item.name}</span>
                                        <div class="list__qtd-shop row">
                                            <span class="qtd">${item.qtd}</span><span class="measure">${item.measure}</span>
                                        </div>
                                        <div class="list__price-shop row none">
                                            <span>R$ 
                                            &nbsp</span><span class="priceText">${item.price}</span>
                                        </div>
                                        `).join('')}
                                    </li>
                                </ul>
                                </div>`).join('');

    }

}

const instance = new ShopView($('#js-list-shop'));

/**
 * Singleton ShopView
 * @function shopViewInstance
 * @returns instance
 */

Object.freeze(instance);
export function shopViewInstance() {
    return instance;
}