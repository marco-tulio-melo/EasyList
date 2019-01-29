import {$,$$} from '../factories/SelectorsFactory';
import {FormatCharacter} from '../helpers/FormatCharacter';
import {ItemsController} from '../controller/ItemsController';
import {ListsController} from '../controller/ListsController';
import {Modal} from './Modal';
import {Save} from './Save';
import {ShopController} from '../controller/ShopController';
import {Transitions} from '../utils/Transitions';
import {Units} from './Units';

/**
 * @fileoverview Gerenciar todas as escultas de eventos
 * 
 * @class
 */
export class Listener {

    constructor() {
        throw new Error('Unable to Instantiate Units');
    }

    /**
     * Inserir eventos nas listas
     * 
     * @method listenerLists
     * @static
     **/
    static listenerLists() {

        const lists = $$('.list-ready__list');

        lists.forEach((l) => {

            l.addEventListener('click', ListsController.open, false);

            l.addEventListener('touchstart', ListsController.start, {
                passive: true
            });

            l.addEventListener('touchmove', ListsController.end, {
                passive: true
            });

            l.addEventListener('touchend', ListsController.end, {
                passive: true
            });

        });

    }

    /**
     * Inserir eventos nos itens
     * 
     * @method listenerItems
     * @static
     **/
    static listenerItems() {

        const items = $$('.list__item');

        items.forEach((i) => {

            i.addEventListener('touchstart', ItemsController.start, {
                passive: true
            });

            i.addEventListener('touchmove', ItemsController.end, {
                passive: true
            });

            i.addEventListener('touchend', ItemsController.end, {
                passive: true
            });

        });

    }

    /**
     * Inserir eventos nas unidades
     * 
     * @method listenerUnitItems
     * @static
     **/
    static listenerUnitItems() {

        const buttons = $$('.amount');

        buttons.forEach((b) => {

            b.addEventListener('click', Units.unitClick.bind(this), false);

            b.addEventListener('touchstart', Units.unitStart.bind(this), {
                passive: true
            });

            b.addEventListener('touchmove', Units.unitEnd.bind(this), {
                passive: true
            });

            b.addEventListener('touchend', Units.unitEnd.bind(this), {
                passive: true
            });

        });

    }

    /**
     * Inserir eventos nos itens de compras
     * 
     * @method listenerShop
     * @static
     **/
    static listenerShop() {

        const items = $$('.list__item-shop');

        items.forEach((i) => {

            i.addEventListener('click', ShopController.open, false);

            i.addEventListener('touchstart', ShopController.start, {
                passive: true
            });

            i.addEventListener('touchmove', ShopController.end, {
                passive: true
            });

            i.addEventListener('touchend', ShopController.end, {
                passive: true
            });

        });

    }

    /**
     * Inserir eventos nas unidades para criação de itens
     * 
     * @method listenerUnitCreateItem
     * @static
     **/
    static listenerUnitCreateItem() {

        const buttons = $$('.amount-items');

        buttons.forEach((b) => {
            b.addEventListener('click', Units.unitCreateItem.bind(this), false);

            b.addEventListener('touchstart', Units.unitStart.bind(this), {
                passive: true
            });

            b.addEventListener('touchmove', Units.unitEnd.bind(this), {
                passive: true
            });

            b.addEventListener('touchend', Units.unitEnd.bind(this), {
                passive: true
            });

        });

    }

    /**
     * Inserir eventos no select de temas
     * 
     * @method listenerSettingVibration
     * @static
     **/
    static listenerSettingVibration() {

        const inputOn = $('#js-vibration-on'),
            inputOff = $('#js-vibration-off');

        inputOn.addEventListener('click', (event) => {
            Save.saveSettingVibration(event);
        }, false);

        inputOff.addEventListener('click', (event) => {
            Save.saveSettingVibration(event);
        }, false);

    }

    /**
     * Inserir eventos no input de quantidade
     * 
     * @method listenerCustomQtd
     * @static
     **/
    static listenerCustomQtd() {

        const input = $('#js-input-qtd'),
            number = 3;

        input.addEventListener('input', (event) => {
            FormatCharacter.limit(number, event);
        }, false);

    }

    /**
     * Inserir eventos no modal
     * 
     * @method listenerModal
     * @static
     **/
    static listenerModal() {

        const modal = $('#js-modal');

        modal.addEventListener('click', (event) => {
            Modal.disappear(event);
        }, false);

    }

    /**
     * Inserir eventos no modal das listas
     * 
     * @method listenerModalList
     * @static
     **/
    static listenerModalList(support) {

        const clear = $('#js-modalLimpar'),
            rename = $('#js-modalRenomear'),
            del = $('#js-modalExcluir');

        clear.addEventListener('click', (event) => {
            ListsController.clear(support, event)
        }, false);

        rename.addEventListener('click', (event) => {
            ListsController.rename(support, event)
        }, false);

        del.addEventListener('click', (event) => {
            ListsController.delete(support, event)
        }, false);

    }

    /**
     * Inserir eventos no modal dos itens
     * 
     * @method listenerModalItems
     * @static
     **/
    static listenerModalItems(support) {
        const edit = $('#js-modalEditar'),
            del = $('#js-modalExcluir');

        edit.addEventListener('click', (event) => {
            ItemsController.edit(support, event);
        }, false);

        del.addEventListener('click', (event) => {
            ItemsController.delete(support, event);
        }, false);

    }

    /**
     * Inserir eventos no modal dos itens de compra
     * 
     * @method listenerModalShop
     * @static
     **/
    static listenerModalShop(support) {
        const edit = $('#js-modalEditar'),
            del = $('#js-modalExcluir');

        edit.addEventListener('click', (event) => {
            ShopController.edit(support, event);
        }, false);

        del.addEventListener('click', (event) => {
            ShopController.delete(support, event);
        }, false);

    }

    /**
     * Inserir eventos no modal de preços
     * 
     * @method listenerModalShopPrice
     * @static
     **/
    static listenerModalShopPrice(support) {
        const save = $('#js-save-price');

        save.addEventListener('click', (event) => {
            ShopController.save(support, event);
        }, false);

    }

    /**
     * Inserir eventos no botão de voltar do about
     * 
     * @method listenerBackAbout
     * @static
     **/
    static listenerBackAbout() {

        const button = $('#js-back-about'),
            about = $('#js-modal-about');


        button.addEventListener('click', () => {
            Modal.disappear();
        }, false);

        about.addEventListener('click', (event) => {
            event.cancelBubble = true;
        }, false);

    }

    /**
     * Inserir eventos no bloco de categorias  
     * 
     * @method listenSticky
     * @static
     * @param {Array} arrayElements (Required) Array com todos os elementos a receber o comportamento
     **/
    static listenSticky(arrayElements) {

        window.addEventListener('scroll', (e) => {

            //Determinar elemento com sticky
            arrayElements.forEach((r) => {
                if (window.scrollY >= r[0] && window.scrollY < r[1]) {
                    Transitions.add('fixed', r[2]);

                } else {
                    Transitions.remove('fixed', r[2]);

                }

            });

        }, {passive: true});

    }

}