import {$} from '../factories/SelectorsFactory';;
import {modalViewInstace} from '../view/ModalView';
import {Transitions} from '../utils/Transitions';

const modalView = modalViewInstace(),
    modal = $('#js-modal');

/**
 * @fileoverview Gerenciar as funções do modal
 * 
 * @class
 */
export class Modal {

    constructor() {
        throw new Error('Unable to Instantiate Modal');
    }

    /**
     * Montar e mostrar modal
     * 
     * @method mounts
     * @static
     * @param {String} type  (Required) Tipo de modal a ser renderizado 'modelSheets', 'modelPrice' e 'modelAbout'.
     * @param {Array} model (Required) Dados para renderização.
     **/
    static mounts(type, model) {

        Transitions.remove('none', modal);
        modalView.update(type, model);

    }

    /**
     * Ocultar modal
     * 
     * @method mounts
     * @static
     **/
    /* Ocultar modal */
    static disappear() {

        Transitions.add('none', modal);
        modalView.update(null);

    }

}