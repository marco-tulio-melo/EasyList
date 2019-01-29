/**
 * Atualizar Views
 * 
 * @class 
 */
export class View {

    constructor(element) {
        this._element = element;
    }

    update(model) {
        if (model === null) {
            this._element.innerHTML = '';

        } else
            this._element.innerHTML = this.template(model);

    }

}