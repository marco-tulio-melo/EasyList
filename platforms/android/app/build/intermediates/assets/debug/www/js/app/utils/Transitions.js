import {$} from '../factories/SelectorsFactory';

const loader = $('#js-modal-loader');

/**
 * @fileoverview Gerenciar transições de estilos css
 * 
 * @class
 */
export class Transitions {

    constructor() {
        throw new Error('Unable to Instantiate Transitions');
    }

    /**
     * Adiciona classe
     * 
     * @method add
     * @static
     * @param {String} add (Required) Nome da class
     * @param {(Array|Object)} element (Required) Elementos
     */
    static add(add, element) {

        if (element === undefined || element === null) {
            return;

        } else {
            const elem = this.converter(element)
            elem.classList.add(add);

        }

    }

    /**
     * Remover classe
     * 
     * @method remove
     * @static
     * @param {String} remove (Required) Nome da class
     * @param {(Array|Object)} element (Required) Elementos
     */
    static remove(remove, element) {

        if (element === undefined || element === null) {
            return;

        } else {
            const elem = this.converter(element)
            elem.classList.remove(remove);

        }

    }

    /**
     * Procurar classe
     * 
     * @method contains
     * @static
     * @param {String} contains (Required) Nome da class ou id
     * @param {Object} element (Required) Elementos
     * @returns {Boolean}
     */
    static contains(contains, element) {

        const elem = this.converter(element)
        return elem.classList.contains(contains);

    }

    /**
     * Mosta ou oculta elemento de acordo com o estado atual
     * 
     * @method showHiddenToggle
     * @static
     * @param {(Array|Object)} element (Required) Elementos
     */
    static showHiddenToggle(...elements) {

        elements.forEach((element) => {
            const e = this.converter(element);
            e.classList.contains('none') ?
                this.remove('none', e) :
                this.add('none', e);

        });

    }

    /**
     * Converter atributos para aceitar classe, id e objetos
     * 
     * @method converter
     * @static
     * @param {Object} element (Required) Elemento
     * @returns {Object}
     */
    static converter(element) {

        const char = String(element).substring(0, 1);

        if (char === '#' || char === '.') {
            return $(element);

        } else {
            return element;

        }

    }

    /**
     * Adiciona um elemento e remover o outro.
     * 
     * @method showHiddenAll
     * @static
     * @param {Object} show  (Required) Elemento as ser mostrado.
     *  @param {Object} hidden  (Required) Elementos as serem ocultados.
     */
    static showHiddenAll(show, hidden) {

        const execute = (s, h) => {

            const ss = this.converter(s),
                hh = this.converter(h);

            this.add('none', hh)
            this.remove('none', ss)
        }

        if (!Array.isArray(hidden)) {
            execute(show, hidden);

        } else {
            hidden.forEach((e) => {
                execute(show, e);

            });

        }
        
    }

    /**
     * Remove e adiciona classes distintas.
     * 
     * @method addIsRemove
     * @static
     * @param {Object} element  (Required) Elemento.
     * @param {String} add  (Required) classe adicionada.
     * @param {String} remove  (Required) classes removidas.
     */
    /* Remove e adiciona classes */
    static addIsRemove(element, add, ...remove) {

        const elem = this.converter(element)

        remove.forEach((cls) => {
            this.remove(cls, elem)
        })

        this.add(add, elem)
    }

    /**
     * Remove e adiciona suavemente.
     * 
     * @method fade
     * @static
     * @param {String} type  (Required) Suavização de entrada (in) ou saida (out)
     *  @param {Object} element  (Required) Elementos.
     */
    static fade(type, ...element) {

        const elements = [...element]

        elements.forEach((e) => {

            if (type === 'in') {
                if (this.contains('fade-out', e) || this.contains('opacity', e)) {
                    this.addIsRemove(e, 'fade-in', 'fade-out', 'opacity');

                }
            } else if (type === 'out') {
                if (this.contains('fade-in', e) || this.contains('opacity', e)) {
                    this.addIsRemove(e, 'fade-out', 'fade-in', 'opacity');

                }
            }

        });

    }

    /**
     * Ativer ou desativer spiner.
     * 
     * @method loader
     * @static
     * @param {Boolean} state  (Required) 
     */
    static loader(state) {

        if (state) {
            setTimeout(() => {
                this.remove('none', loader);
            }, 20);

        } else {
            setTimeout(() => {
                this.add('none', loader);
            }, 500);

        }

    }

}