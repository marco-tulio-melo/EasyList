import {CategoryFactory} from '../factories/CategoryFactory';
import {ConnectionFactory} from './ConnectionFactory';
import {FormatDate} from '../helpers/FormatDate';
import {ItemsDao} from '../dao/ItemsDao';
import {ListModel} from '../model/ListModel';

/**
 * @fileoverview Gerenciar as funções relacionadas com a criação das lista
 * 
 * @class 
 */
export class ListFactory {

    constructor() {
        throw new Error('Unable to Instantiate ListFactory')
    }

    /**
     *  Montar estrutura de lista
     * @method mountsList
     * @static
     * @param {String} nameList (Required) Nome da nova da lista
     */
    static mountsList(nameList) {
        return new Promise(resolve => {

            (async () => {

                // Pegar todos os itens do banco de dados
                const result = await ConnectionFactory.getConnection()
                    .then((connection) => new ItemsDao(connection)
                        .read());

                // Filtrar todos os item com mais de uma unidade 
                const items = result.filter((item) => {
                    return item.unit > 0;

                });

                // Contar itens e limitar quantidade
                let countItems = items.length;
                if (countItems > 999) countItems = '> 999';

                //  Montar estrutura de categorias
                const categories = CategoryFactory.mountsCategories(items);

                // Criar nova lista 
                const list = this._create(nameList, countItems, FormatDate.dateSeparate(), items, categories.nameCategories);

                resolve(list);

            })();

        });

    }

    /**
     * Criar nova lista
     * 
     * @param {String} name (Required) Nome da lista
     * @param {Number} countItems (Required) Número de itens
     * @param {String} date (Required) Data de decriação da lista
     * @param {Array} items (Required) Itens das lista
     * @param {Array} nameCategories (Required) Categoria da lista
     * @returns {Object}
     */
    static _create(name, countItems, date, items, nameCategories) {

        const l = new ListModel(name,
            countItems,
            date,
            items,
            nameCategories);

        const list = {
            name: l.name,
            qtdItems: l.qtdItems,
            date: l.date,
            items: l.items,
            categories: l.categories
        }

        return list;

    }

}