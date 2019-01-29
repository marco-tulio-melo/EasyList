import {$} from '../factories/SelectorsFactory';
import {View} from './View';

/**
 * View para renderização dos registros de compra
 * 
 * @class 
 */
class RecordView extends View {

    constructor(element) {
        super(element);
    }

    /**
     * Template a ser renderizada
     * 
     * @param {Array} model (Required) Dados para renderização
     */
    template(model) {

        return model.map(record => `
        <li class="record-block__record column">
        <div class="record__date row">
            <span>${record .date}</span>
        </div>
        <div class="record__data row">
            <span>${record.name}</span>
            <span>R$  &nbsp ${record.total}</span>
        </div>
    </li>`).join('');

    }

}

const instance = new RecordView($('#js-record-page__block'));

/**
 * Singleton RecordView
 * @function recordViewInstance
 * @returns instance
 */

Object.freeze(instance);
export function recordViewInstance() {
    return instance;
}