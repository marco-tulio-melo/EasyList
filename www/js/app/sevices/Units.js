import {ConnectionFactory} from '../factories/ConnectionFactory';
import {Effects} from './Effects';
import {ItemsDao} from '../dao/ItemsDao';
import {Support} from '../utils/Support';
import {Transitions} from '../utils/Transitions';

let timeout,
    interval;

/**
 * @fileoverview Gerenciar alteração das unidades dos itens
 * 
 * @class
 */
export class Units {

    constructor() {
        throw new Error('Unable to Instantiate Units');
    }

    /**
     * Subtrair ou acrescentar unidade
     * @method unitClick
     * @static
     */
    static unitClick(event) {
        event.preventDefault();

        Units.modifyUnit(event);

    }

    /**
     * Subtrair ou acrescentar unidade enquanto o botao estiver pressionado
     * @method unitStart
     * @static
     */
    static unitStart(event) {

        event.cancelBubble = true;

        const target = event.target.tagName;

        Support.supportVibration();

        // Metodo para parar Timeout e Interva
        Units.unitEnd();

        // Alterar unit
        timeout = setTimeout(() => {

            interval = setInterval(() => {

                if (target === 'BUTTON') {
                    Units.unitCreateItem(event);

                } else {
                    Units.modifyUnit(event);

                }

            }, 200);

        }, 500);

    }

    /**
     * Parar Timeout e Interval
     * @method unitEnd
     * @static
     */
    static unitEnd() {

        clearTimeout(timeout);
        clearInterval(interval);

    }

    /**
     *  Modificar unidades
     * @method modifyUnit
     * @static
     */
    static modifyUnit(event) {

        (async () => {

            // Pegar dados da unidade selecionada
            const support = Support.supportUnit(event);

            // Alterar unidade
            const unitValue = this._changeUnits(support);

            // Dados do item alterado
            const itemOld = {
                name: support.itemName,
                category: support.categoryName
            }

            // Objeto com a nova unidade inserida
            const itemNew = {
                name: support.itemName,
                qtd: support.qtdItem,
                measure: support.measureItem,
                price: '00,00',
                unit: unitValue,
                category: support.categoryName
            }

            // Atualizar item
            await ConnectionFactory.getConnection()
                .then((connection) => new ItemsDao(connection)
                    .edit(itemOld, itemNew));

            // Mostrar ou ocultar botão de salvar
            Effects.SaveButtonEffects();

        })();

    }

    /**
     * Alterar unidade
     * @method _changeUnits
     * @static
     * @param {Object} support Dados do item selecionado com nome,qtd,measure e etc.
     * @returns {String}
     */
    static _changeUnits(support) {

        let unit = support.unit,
            unitValue = support.unit.textContent;

        // Subtrair valor da unidade
        if (support.target.classList.contains('minus-button')) {
            if (unitValue <= 1) {
                Transitions.fade('out', support.buttonMinus);
                Transitions.fade('out', support.unit);
                Transitions.addIsRemove(support.blockItem, 'list__item--out', 'list__item--in');
                Transitions.remove('plus--active', support.buttonPlus)

            }

            if (unitValue <= 0) {
                unit.textContent = 0;

            } else if (unitValue > 0) {
                unit.textContent = --unitValue;

            }

        }
        // Acrescentar valor a unidade
        if (support.target.classList.contains('plus-button')) {
            if (unitValue >= 999) {
                unit.textContent = unitValue;

            } else {
                unit.textContent = ++unitValue;

            }

            Transitions.fade('in', support.buttonMinus);
            Transitions.fade('in', unit);
            Transitions.add('plus--active', support.target);
            Transitions.addIsRemove(support.blockItem, 'list__item--in', 'list__item--out');

        }

        return unit.textContent;

    }

    /**
     * Alterar unidade de criação de itens
     * @method unitCreateItem
     * @static
     * @returns {String}
     */
    static unitCreateItem(event) {
        event.preventDefault();

        const target = event.target,
            changeAmount = target.closest('.change-amount-items');

        let spanUnit = changeAmount.querySelector('#js-span-unit'),
            spanUnitValue = parseInt(spanUnit.textContent);

        // Subtrair valor da unidade  
        if (Transitions.contains('minus-button', target)) {

            if (spanUnitValue <= 0) {
                spanUnit.textContent = 0;

            } else if (spanUnit.textContent > 0) {
                spanUnit.textContent = --spanUnitValue;

            }
            // Acrescentar valor a unidade
        } else if (Transitions.contains('plus-button', target)) {

            if (spanUnitValue >= 999) {
                spanUnit.textContent = 999;

            } else {
                spanUnit.textContent = ++spanUnitValue;

            }

        }

    }


}