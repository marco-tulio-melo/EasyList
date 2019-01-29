import {$,$$} from '../factories/SelectorsFactory';
import {ConnectionFactory} from '../factories/ConnectionFactory';
import {ItemsDao} from '../dao/ItemsDao';
import {Transitions} from '../utils/Transitions';

const buttonSave = $('#js-save-list');

/**
 * @fileoverview Gerenciar os efeitos de mudança de estado
 * 
 * @class
 */
export class Effects {

    constructor() {
        throw new Error('Unable to Instantiate Menu');
    }

    /**
     * Mudar cor nos items com preco
     * 
     * @method itemsShopEffects
     * @static
     **/
    static itemsShopEffects() {

        // Pegar todos os itens
        const items = document.querySelectorAll('.priceText');

        // Inserir efeito em todos os itens com preço maior que 00,00
        items.forEach((e) => {

            const priceBlock = e.closest('.list__price-shop'),
                target = e.closest('.list__item-shop');

            if (e.textContent != '00,00' || parseFloat(e.textContent) != '') {
                Transitions.remove('none', priceBlock);
                Transitions.add('list__item-shop--active', target);

            } else {
                Transitions.add('none', priceBlock);
                Transitions.remove('list__item-shop--active', target);

            }

        });

    }

    /**
     *  Mudar cor nos items com unidade superior a 0
     * @method itemEffects
     * @static
     */
    static itemEffects() {

        let unit = null,
            unitText = null,
            buttonPlus = null,
            blockItem = null,
            buttonMinus = null;

        // Pegar todos os blocos de unidades
        const changeAmount = $$('.change-amount');

        // Inserir efeito em todos os blocos com unidades
        changeAmount.forEach((e) => {

            unit = e.querySelector('span');
            unitText = parseInt(unit.textContent)

            if (unitText > 0) {
                buttonPlus = e.querySelector('.plus-button');
                blockItem = e.closest('.list__item');
                buttonMinus = e.querySelector('.minus-button');

                Transitions.add('plus--active', buttonPlus);
                Transitions.fade('in', buttonMinus);
                Transitions.fade('in', unit);
                Transitions.addIsRemove(blockItem, 'list__item--in', 'list__item--out')

            }

        });

    }

    /**
     *  Mudar estado do botão quanto as unidades forem superior a 0
     * @method SaveButtonEffects
     * @static
     */
    static SaveButtonEffects() {

        (async () => {

            // Pegar todas os items para extrair as unidades
            const result = await ConnectionFactory.getConnection()
                .then((connection) => new ItemsDao(connection)
                    .read());


            // Verificar se a unidades superior a 0       
            let activeSave = result.some((element) => {
                return parseInt(element.unit) >= 1;

            });

            // Inserir efeito 
            if (activeSave) {
                Transitions.fade('in', buttonSave);

            } else {
                Transitions.fade('out', buttonSave);

            }

        })();

    }

}