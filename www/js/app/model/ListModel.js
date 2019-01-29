/**
 * Modelo para criação de nova lista
 * 
 * @class 
 */
export class ListModel {

    constructor(name, qtdItems, date, items, categories) {
        this._name = name;
        this._qtdItems = qtdItems;
        this._date = date;
        this._items = items;
        this._categories = categories;
    }

    get name() {
        return this._name;

    }

    get qtdItems() {
        return this._qtdItems;

    }

    get date() {
        return this._date;

    }

    get items() {
        return this._items;

    }
    get categories() {
        return this._categories;

    }

}