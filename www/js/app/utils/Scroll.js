import {$$} from '../factories/SelectorsFactory';
import {ItemsDao} from "../dao/ItemsDao";
import {ConnectionFactory} from "../factories/ConnectionFactory";

/**
 * @fileoverview Gerenciar rolagem do scroll
 * 
 * @class
 */
export class Scroll {

    constructor() {
        throw new Error('Unable to Instantiate Scroll');
    }

    /**
     * Scroll áte a prosição indicada
     * 
     * @param {String} position (Required) Determinar a posição do scroll
     * 'fisrt' - Rolar para o incio da pagina 
     * 'medium' - Rolar para o objeto passado em data
     * 'last' - Rolar para o último item salvo     
     * @param {Object} data 
     */
    static scrolling(position, data) {
        return new Promise(resolve => {

            // Rolar para o incio da pagina 
            if (position === 'fisrt') {

                // Calcular scroll
                this._calcScroll(null);
                resolve();

                // Rolar para elemento passado
            } else if (position === 'medium') {
                const dataName = data.name,
                    dataCategory = data.category;

                // Calcular scroll
                this._calcScroll(dataName, dataCategory);

                resolve();

                // Rolar para elemento passado 
            } else if (position === 'last') {

                // Pegar todos os itens
                ConnectionFactory.getConnection()
                    .then((connection) => new ItemsDao(connection)
                        .read().then((e) => {

                            // Pegar o ultimo item criado
                            if (e.length > 0) {
                                const last = e.pop();

                                // Calcular scroll
                                this._calcScroll(last.name, last.category)

                                resolve();
                            }

                        }));

            }

        });

    }

    /**
     * Calcular rolagem do scroll
     *
     * @param {String} item (Required) Nome do item alvo
     *  @param {String} category (Required) Categoria do item alvo
     */
    static _calcScroll(item, category) {

        if (item === undefined || item === null) {
            window.scroll(0, 0);

        } else {

            // Trasformar NodeList para Array
            const categories = Array.prototype.slice.call($$('.list__items-category h1'));

            // Filtrar categoria
            categories.some((c) => {

                if (c.textContent === category) {
                    const currentItem = c.parentElement.querySelectorAll('.list__item-name');

                    // Filtrar nome e fazer a rolagem
                    currentItem.forEach((r) => {
                        if (r.textContent === item) {
                            const top = r.offsetTop,
                                height = r.offsetHeight,
                                total = top - (height * 25);

                            window.scroll(0, total);

                        }
                    });

                    return true;
                }

            });

        }

    }

}