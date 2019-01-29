import {$} from '../factories/SelectorsFactory';
import {Listener} from '../sevices/Listeners';
import {Transitions} from './Transitions';

const pageShopping = $('#js-page-shopping'),
    pageList = $('#js-page-list');

/**
 * Gerenciar comportamento das categorias com diplay fixed
 * 
 * @class
 */
export class Sticky {

    constructor() {
        throw new Error('Unable to Instantiate Sticky');
    }

    /**
     * Inserir comportamento nas cartegorias
     * 
     * @param {page} page (Required) Pageina que vai receber o comportamento 
     * 'list' - Pagina criar lista
     * 'shop' - Pagina lista de compras
     */
    static fixed(page) {

        let headerHeight = 0,
            elements = null,
            elementsSizes = [];

        if (page === 'list') {

            // Pegar altura do titulo
            headerHeight = pageList.querySelector('.header-list').offsetHeight;

            // Elementos que receberam o comportamento
            elements = pageList.querySelectorAll('.list__items-category');

        } else if (page === 'shop') {

            // Pegar altura do titulo
            headerHeight = pageShopping.querySelector('.header-list').offsetHeight;

            // Elementos que receberam o comportamento
            elements = pageShopping.querySelectorAll('.list__items-category');

        }

        elements.forEach((e) => {

            // Pegar medidas dos elementos
            let elementHeighMin = e.offsetTop - (headerHeight * 2),
                elementHeighMax = e.offsetHeight + elementHeighMin,
                elementCategory = e.querySelector('h1');

            // Array com a medida de todos os elementos
            elementsSizes.push([elementHeighMin, elementHeighMax, elementCategory]);
        });

        // Adicionar classe fixed no primeiro elemento
        let elementFirstFixed = elementsSizes[0];

        Transitions.add('fixed', elementFirstFixed[2])

        Listener.listenSticky(elementsSizes);

    }

}