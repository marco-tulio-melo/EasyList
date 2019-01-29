import {$} from '../factories/SelectorsFactory';

/**
 * View para renderização do modal
 * 
 * @class 
 */
class ModalView {

    constructor(element) {
        this._element = element;
    }

    /**
     * Template modal para abrir informações sobre o EasyList
     * 
     */
    modelAbout() {

        return `
        <div class="modal-about column" id="js-modal-about">

            <div class="modal-about__header row">
                <span class="about-header__icon-back icon-small" id="js-back-about"></span>
            </div>

            <img class="modal-about__img" src="img/logo-main-blue.svg" alt="">


            <div class="modal-about-info column">
                <span class="modal-about-info__version">Versão 1.0.0</span>
                <p> Com EasyList, crie suas listas de supermercado
                    com organização e agilidade, trazendo
                    conforto na hora das compras.
                </p>

                <span>Disponível no GitHub:&nbsp;<a href="https://github.com/marco2120/EasyList" target="window">Click aqui</a> </span>

                <div class="modal-about-info__dev row">
                    <h1>Desenvolvido por: &nbsp;</h1>
                    <span>Marco Túlio Melo</span>
                </div>
                
            </div>
        </div>`;

    }

    /**
     * Template modal oara opções dos item e listas
     * 
     * @param {Object} model (Required) Dados para renderização
     */
    modelSheets(model) {

        return `<div class="modal__model column">
        <h1>${model.name}</h1>
        <div class="modal__model-main column">
         ${this._buttons(model)}
        </div>
    </div>`;

    }

    /**
     * Template modal renderização dos botões
     * 
     * @param {Object} model (Required) Dados para renderização
     */
    _buttons(model) {

        return model.button.map(name => `
         <button class="modal__options" id="js-modal${name}">${name}</button>
         `).join('');

    }

    /**
     * Template modal para inseção de preço nos itens de compra
     * 
     * @param {Object} model (Required) Dados para renderização
     */
    modelPrice(model) {

        return `
        <div class="modal__model-shop column">
            <div class="modal__model-border row">
                <span>${model.name} - ${model.qtd} ${model.measure} - ${model.unit} unidade </span>
            </div>
            <div class="modal__model-main-shop row">
                <div class="modal__price row">
                    <span>R$</span>
                </div>
                
                <input type="number" placeholder="00,00" value="${model.price}" id="js-price" />
                <div class="modal__next  row">
                    <button  class="icon-medium filter" id="js-save-price"></button>
                </div>
                
            </div>
            <div class="modal__model-border row">
                <span>Total:&nbsp R$ &nbsp </span><span id="js-total">${model.total}</span>
            </div>
        </div>`

    }

    /**
     * Template a ser renderizada
     * 
     * @param {String} type  (Required) Tipo de modal a ser renderizado 'modelSheets', 'modelPrice' e 'modelAbout' .
     * @param {Array} model (Required) Dados para renderização.
     */
    template(type, model) {
        if (type === 'modelSheets') {
            return this.modelSheets(model);

        } else if (type === 'modelPrice') {
            return this.modelPrice(model);

        } else if (type === 'modelAbout') {
            return this.modelAbout();

        } else {
            throw new Error('Tipo de modal invalido - Tente, "modelSheets" ou "modelPrice"')

        }

    }

    /**
     * Atualizar View modal
     * 
     * @param {String} type  (Required) Tipo de modal a ser renderizado 'modelSheets' ou 'modelPrice'.
     * @param {Array} model (Required) Dados para renderização. 
     */
    update(type, model) {
        if (type === null) {
            this._element.innerHTML = '';

        } else
            this._element.innerHTML = this.template(type, model);

    }

}

const instance = new ModalView($('#js-modal'));

/**
 * Singleton ModalView
 * @function modalViewInstace
 * @returns instance
 */

Object.freeze(instance);
export function modalViewInstace() {
    return instance;
}