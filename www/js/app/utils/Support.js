import {$} from '../factories/SelectorsFactory';
import {FormatCoin} from '../helpers/FormatCoin';
import {Save} from '../sevices/Save';

let isVibration = null;

/**
 * @fileoverview Gerenciar as funções de suporte
 * 
 * @class
 */
export class Support {

    constructor() {
        throw new Error('Unable to Instantiate Support');
    }

    /**
     * Suporte as listas
     * 
     * @method supportLists
     * @static
     * @returns {Object}
     */
    static supportLists(event) {

        const target = event.target.closest('.list-ready__list'),
            element = target.querySelector('.list-ready__list-modal'),
            name = target.querySelector('.list-name-text').textContent,
            support = {
                target: target,
                element: element,
                name: name
            }

        return support;

    }

    /**
     * Suporte aos itens
     * 
     * @method supportItems
     * @static
     * @returns {Object}
     */
    static supportItems(event) {

        const target = event.currentTarget,
            blockItem = target.closest('.list__item'),
            box = target.closest('.list__items-category'),
            name = blockItem.querySelector('.list__item-name').textContent,
            qtd = blockItem.querySelector('.qtd').textContent,
            measure = blockItem.querySelector('.measure').textContent,
            unit = blockItem.querySelector('.unit').textContent,
            category = box.querySelector('h1').textContent;

        let data = {
            target: target,
            name: name,
            qtd: qtd,
            measure: measure,
            unit: unit,
            category: category
        }

        return data;

    }

    /**
     * Suporte as unidades
     * 
     * @method supportUnit
     * @static
     * @returns {Object}
     */
    static supportUnit(event) {

        const target = event.target,
            box = target.closest('.change-amount'),
            boxItem = target.closest('.list__items-category'),
            categoryName = boxItem.querySelector('h1').textContent,
            buttonMinus = box.querySelector('.minus-button'),
            buttonPlus = box.querySelector('.plus-button'),
            unit = box.querySelector('span'),
            blockItem = box.closest('.list__item'),
            qtdItem = blockItem.querySelector('.qtd').textContent,
            measureItem = blockItem.querySelector('.measure').textContent,
            itemName = blockItem.querySelector('.list__item-name').textContent;

        const data = {
            target: target,
            box: box,
            boxItem: boxItem,
            categoryName: categoryName,
            qtdItem: qtdItem,
            measureItem: measureItem,
            buttonMinus: buttonMinus,
            buttonPlus: buttonPlus,
            unit: unit,
            blockItem: blockItem,
            itemName: itemName
        }

        return data;

    }

    /**
     * Suporte aos itens de compras
     * 
     * @method supportShop
     * @static
     * @returns {Object}
     */
    static supportShop(event) {

        const target = event.currentTarget,
            listName = $('#js-title-shop').textContent,
            box = target.closest('.list__items-category'),
            name = target.querySelector('.list__item-name-shop'),
            qtd = target.querySelector('.qtd'),
            measure = target.querySelector('.measure'),
            unit = target.querySelector('.unit'),
            category = box.querySelector('h1'),
            priceBlock = target.querySelector('.list__price-shop'),
            price = priceBlock.querySelector('.priceText');

        let data = {
            target: target,
            listName: listName,
            name: name,
            qtd: qtd,
            measure: measure,
            unit: unit,
            category: category,
            priceBlock: priceBlock,
            price: price,
            model: {
                name: name.textContent,
                qtd: qtd.textContent,
                measure: measure.textContent,
                unit: parseInt(unit.textContent),
                category: category.textContent,
                price: (FormatCoin.price(price.textContent) / parseInt(unit.textContent)).toFixed(2),
                total: price.textContent
            }
        }

        return data;

    }


    /**
     * Aplicar vibração
     * 
     * @method supportVibration
     * @static
     */
    static supportVibration() {

        isVibration = Save.getVibration();

        if (isVibration) {
            navigator.vibrate(50);

        }

    }


}