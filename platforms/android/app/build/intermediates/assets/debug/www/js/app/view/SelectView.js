import {$} from '../factories/SelectorsFactory';
import {View} from './View';

/**
 * View para renderização das categorias no select 
 * 
 * @class 
 */
class SelectView extends View {

    constructor(element) {
        super(element);
    }

    /**
     * Template a ser renderizada
     * 
     * @param {Array} model (Required) Dados para renderização
     */
    template(model) {

        return model.map(option => `<option value="${option}">${option}</option>`).join('');

    }

}

const instance = new SelectView($('#js-select-category'));

/**
 * Singleton SelectView
 * @function selectViewInstance
 * @returns instance
 */

Object.freeze(instance);
export function selectViewInstance() {
    return instance;
}