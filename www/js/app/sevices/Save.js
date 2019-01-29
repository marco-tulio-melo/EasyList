import {$} from '../factories/SelectorsFactory';
import {ClearData} from './ClearData';
import {ConnectionFactory} from '../factories/ConnectionFactory';
import {Dialogs} from '../helpers/Dialogs';
import {ItemFactory} from '../factories/ItemFactory';
import {ItemsController} from '../controller/ItemsController';
import {ItemsDao} from '../dao/ItemsDao';
import {ListFactory} from '../factories/ListFactory';
import {ListsDao} from '../dao/ListsDao';
import {Render} from './Render';
import {SettingDao} from '../dao/SettingDao';
import {ShopController} from '../controller/ShopController';
import {Transitions} from '../utils/Transitions';
import {ValidationNames} from '../helpers/ValidationNames';

const pageIndex = $('#js-page-index'),
    pageList = $('#js-page-list'),
    headerSave = $('#js-header__save'),
    on = $('#js-vibration-on'),
    off = $('#js-vibration-off');

let isVibration = null;

/**
 * @fileoverview Gerenciar as funções de para savar lista e itens
 * 
 * @class
 */
export class Save {

    constructor() {
        throw new Error('Unable to Instantiate Save');
    }

    /**
     * Abrir modal com validação de nome
     * 
     * @method openModalNameList
     * @static
     * @param {String} titlePage (Required) Titulo da pagina
     * @param {Array} elements (Required) Array com listas para comparação
     */
    static openModalNameList(titlePage, elements) {
        return new Promise(resolve => {

            const message = 'Nome da lista:',
                title = 'Salvar:';

            // Validar nome dp titulo da pagina
            if (titlePage.textContent === 'Nova Lista') {

                // Dialogo para inserção de nome para nova lista
                Dialogs.prompt(message, (results) => {

                    // Validar nome da nova lista
                    ValidationNames.validation(results, elements, 'list', this.saveList.bind(this));

                }, title);

            } else {
                // Salvar lista
                this.saveList(titlePage.textContent);

            }

            resolve();

        });

    }

    /**
     * Adicionar nova lista no banco de dados e renderizar pagina
     * 
     * @method saveList
     * @static
     * @param {String} nameList (Required) Nome da lista
     */
    static saveList(nameList) {

        (async () => {

            // Monsta lista
            const list = await ListFactory.mountsList(nameList),
                message = 'Lista Salva com sucesso.',
                title = 'Sucesso';
      
            // Adicionar lista
            await ConnectionFactory.getConnection()
                .then((connection) => new ListsDao(connection)
                    .add(list));

            //Rendezirar listas
            await Render.renderLists();

            // Dialogo de alerta para informar que lista foi salva
            Dialogs.alert(message, () => {

                //Troca de pagina
                Transitions.showHiddenToggle(pageList, pageIndex);

                // Esconder botão salvar
                Transitions.addIsRemove(headerSave, 'fade-out', 'fade-in');

           }, title);

        })();

    }

    /**
     * Salvar itens
     * 
     * @method saveList
     * @static
     * @param {Object} inputs (Required) Elementos input
     * @param {String} type (Required) Tipo de salvamento - create ou edit
     */
    static saveItem(inputs, type) {
        return new Promise(resolve => {

            let item = null;

            (async () => {

                // CallBack chamado após a validação de nomes
                const callBack = (name) => {

                    item = ItemFactory.create(
                        inputs.name.value,
                        inputs.qtd.value,
                        inputs.measure.value,
                        inputs.unit.textContent,
                        inputs.category.value,
                        inputs.price
                    )

                    // Caso for editar o item
                    if (type === 'edit') {

                        // Retornar dados do item as ser editado
                        ItemsController.loadEdit();

                        // Editar item
                        ItemFactory.editItems(item);

                        // Caso for criar um item 
                    } else if (type === 'create') {

                        // Adicionar item no banco de dados
                        ItemFactory.addItems(item);

                    }

                    const res = {
                        name: item.name,
                        category: item.category
                    }

                    // Apagar campos de input
                    ClearData.emptyInputs();

                    resolve(res);

                }

                const itemValidation = {
                    name: inputs.name.value,
                    category: inputs.category.value
                }

                // Pegar todos os itens para comparação de nomes
                const result = await ConnectionFactory.getConnection()
                    .then((connection) => new ItemsDao(connection)
                        .read());

                // Validar nome do item 
                ValidationNames.validation(itemValidation, result, 'item', callBack.bind(this));

            })();

        });

    }

    /**
     * Salvar ou editar itens de compras
     * 
     * @method saveItemShop
     * @static
     * @param {Object} inputs (Required) Elementos input
     * @param {String} type (Required) Tipo de salvamento - create ou edit
     * @param {String} listName (Required) Nome da lista
     */
    static saveItemShop(inputs, type, listName) {
        return new Promise(resolve => {

            const oldItems = ShopController.loadEdit(),
                nameItem = oldItems.name,
                category = oldItems.category;

            let item = null,
                items = null;

            (async () => {

                const callBack = (name) => {

                    (async () => {

                        if (type === 'edit') {

                            items.some((e, index) => {
                                if (e.name === nameItem && e.category === category) {
                                    item['price'] = e.price;
                                    items.splice(index, 1, item);

                                }

                                return;

                            });

                        } else if (type === 'create') {
                            items.push(item);

                        }

                        await ConnectionFactory.getConnection()
                            .then((connection) => new ListsDao(connection)
                                .update(listName, items));

                        const res = {
                            name: item.name,
                            category: item.category
                        }

                        // Apagar campos de input
                        ClearData.emptyInputs();

                        resolve(res);

                    })();

                }

                const result = await ConnectionFactory.getConnection()
                    .then((connection) => new ListsDao(connection)
                        .read());

                item = ItemFactory.create(
                    inputs.name.value,
                    inputs.qtd.value,
                    inputs.measure.value,
                    inputs.unit.textContent,
                    inputs.category.value,
                    inputs.price
                )

                const results = result.filter((lists) => {
                    return lists.name === listName

                });

                items = results[0].items;

                const itemValidation = {
                    name: inputs.name.value,
                    category: inputs.category.value
                }

                // Validar nome do item 
                ValidationNames.validation(itemValidation, results[0].items, 'item', callBack.bind(this));

            })();

        });

    }


    /**
     * Salvar opção de vibração
     * 
     * @method SaveSettingVibration
     * @static
     **/
    static saveSettingVibration(event) {
        return new Promise(resolve => {

            let input = null;

            (async () => {

                const result = await ConnectionFactory.getConnection()
                    .then((connection) => new SettingDao(connection)
                        .read());

                if (result.length === 0) {
                    on.checked = true;
                    isVibration = true

                } else {

                    try {
                        input = event.target.id;

                    } catch (error) {
                        input = null;

                    }

                    switch (input) {

                        case 'js-vibration-on':
                            isVibration = true;
                            break;
                        case 'js-vibration-off':
                            isVibration = false;
                            break;
                        default:
                            if (result[0]) {
                                on.checked = true;
                                isVibration = true;

                            } else {
                                off.checked = true;
                                isVibration = false;

                            }
                            break;

                    }

                }

                await ConnectionFactory.getConnection()
                    .then((connection) => new SettingDao(connection)
                        .delete());

                await ConnectionFactory.getConnection()
                    .then((connection) => new SettingDao(connection)
                        .add(isVibration));

                resolve(isVibration);

            })();

        });

    }

    /**
     * Verificar opção de vibração
     * 
     * @method getVibration
     * @static
     * @returns {Boolean}
     */
    static getVibration() {

        return isVibration;

    }




}