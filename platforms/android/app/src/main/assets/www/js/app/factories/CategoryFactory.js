import {CategoryModel} from '../model/CategoryModel';
import {ConnectionFactory} from '../factories/ConnectionFactory';
import {Dialogs} from '../helpers/Dialogs';
import {ItemsDao} from '../dao/ItemsDao';
import {ValidationNames} from '../helpers/ValidationNames';


/**
 * @fileoverview Gerenciar as funções relacionadas as categorias
 * 
 * @class 
 */
export class CategoryFactory {

    constructor() {
        throw new Error('Unable to Instantiate CategoryFactory')
    }

    /**
     *  Montar estrutura de categorias
     * @method mountsCategories
     * @static
     * @param {Array} result (Required) Array com todos os itens para montar as categorias
     * @returns {Object}
     */
    static mountsCategories(result) {

        let elementCategory = [],
            categoriesAll = [],
            category = null,
            items = null,
            model = null,
            data = null;

        // Remover categorias duplicadas
        elementCategory = this._removeDuplicates(result);

        // Colocar categorias em ordem alfabética
        elementCategory.sort();

        // Filtrar os itens e montar as categorias
        elementCategory.map((c) => {

            // Filtra itens
            items = result.filter((element) => {

                return element.category === c;

            });

            // Montar categoria
            model = new CategoryModel(c, items);

            category = {
                name: model.name,
                itemsCategory: model.itemsCategory,
            }

            // Inserir em um array com todas as categorias montadas
            categoriesAll.push(category);
        });

        // Retorna todas as categorias
        data = {
            nameCategories: elementCategory,
            categories: categoriesAll
        }

        return data;

    }

    /**
     *  Adicionar categoria no select 
     * @method add
     * @static
     * @param {Object} select (Required) Select de categorias
     */
    static add(select) {

        const message = 'Nome da categoria:',
            title = 'Adicionar categoria';

        // Dialogo para inserção do nome da categoria
        Dialogs.prompt(message, (results) => {

            // Validar nome da categoria
            this._validationCategory(results, select);

        }, title);

    }

    /**
     *  Adicionar categoria no select 
     * @method _validationCategory
     * @static
     * @param {String} results (Required) Nome da nova categoria
     * @param {Object} select (Required) Select de categorias
     */
    static _validationCategory(results, select) {

        let categories = null;

        (async () => {

            // Pegar todos os itens para extrair as categorias
            const result = await ConnectionFactory.getConnection()
                .then((connection) => new ItemsDao(connection)
                    .read());

            // Montar categorias 
            categories = this.mountsCategories(result).nameCategories;

            // Calback passado como resposta da caixa de dialogo
            const callBack = (newName) => {
                const option = document.createElement("option");
                option.text = newName;
                select.add(option, select[0]);
                select.selectedIndex = '0';
            }

            // Compara o nome da categoria com o banco de dados
            ValidationNames.validation(results, categories, 'category', callBack.bind(this));

        })();
    }

    /**
     *  Remover duplicatas das categorias
     * @method _removeDuplicates
     * @static
     * @param {Array} result (Required) Array com itens para extração das categorias
     * @returns {Array}
     */
    static _removeDuplicates(result) {

        const elementCategory = [];

        // Remover duplicatas
        result.forEach((element) => {
            if (!elementCategory.includes(element.category)) {
                elementCategory.push(element.category);
            }
        });

        return elementCategory;

    }

}