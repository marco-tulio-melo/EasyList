/**
 * Modelo para criação de novo item
 * 
 * @class 
 */
export class ItemModel {

    constructor(name, qtd, measure, unit, category, price) {
        this._name = name;
        this._qtd = qtd;
        this._measure = measure;
        this._unit = unit;
        this._category = category;
        this._price = price;
    }

    get name() {
        return this._name;

    }

    get qtd() {
        return this._qtd;

    }

    get measure() {
        return this._measure;

    }

    get unit() {
        return this._unit;

    }

    get category() {
        return this._category;

    }
    get price() {
        return this._price;

    }

}