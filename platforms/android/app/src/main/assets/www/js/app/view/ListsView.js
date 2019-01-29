import {$} from '../factories/SelectorsFactory';
import {View} from './View';

/**
 * View para renderização das listas
 * 
 * @class 
 */
class ListsView extends View {

    constructor(element) {
        super(element);
    }

    /**
     * Template a ser renderizada
     * 
     * @param {Array} model (Required) Dados para renderização
     */
    template(model) {

        return model.map(list => ` 
        <li class="list-ready__list row">

        <div class="list-ready__list-box row">
            
            <div class="list-ready__list-date column">
                <h2 class="hours">${list.date.hours}</h2>
                <h2 class="day"> ${list.date.day}</h2>
                <h2 class="month">${list.date.month}</h2>
            </div>

            <div class="list-ready__list-data-all column">

                <div class="list-ready__list-data row">

                    <div class="list-ready__list-name row">

                        <h1 class="list-name-text">${list.name}</h1>
                    </div>

                </div>

                <div class="list-ready__list-data row">

                    <div class="list-ready__list-qtd row">
                        <span>Total de itens:  &nbsp ${list.qtdItems}  </span>
                    </div>
                </div>
            </div>
        </div>
    </li>`).join('');

    }

}

const instance = new ListsView($('#js-list-full'));

/**
 * Singleton ListsView
 * @function listsViewInstance
 * @returns instance
 */

Object.freeze(instance);
export function listsViewInstance() {
    return instance;
};