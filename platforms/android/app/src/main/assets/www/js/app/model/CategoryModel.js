/**
 * Modelo para criação de nova categoria
 * 
 * @class 
 */
export class CategoryModel {

    constructor(name, itemsCategory) {
        this._name = name;
        this._itemsCategory = itemsCategory;
    }

    get name() {
        return this._name;

    }

    get itemsCategory() {
        return this._itemsCategory;

    }

}