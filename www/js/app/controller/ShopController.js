import {$,$$} from '../factories/SelectorsFactory';
import {ClearData} from '../sevices/ClearData';
import {ConnectionFactory} from '../factories/ConnectionFactory';
import {Dialogs} from '../helpers/Dialogs';
import {FormatCoin} from '../helpers/FormatCoin';
import {FormatDate} from '../helpers/FormatDate';
import {Listener} from '../sevices/Listeners';
import {ListsDao} from '../dao/ListsDao';
import {Modal} from '../sevices/Modal';
import {RecordFactory} from '../factories/RecordFactory';
import {Render} from '../sevices/Render';
import {Sticky} from '../utils/Sticky';
import {Support} from '../utils/Support';
import {Transitions} from '../utils/Transitions';

const pageIndex = $('#js-page-index'),
    pageShop = $('#js-page-shopping'),
    pageCreateItem = $('#js-page-create-item'),
    priceTotal = $('#js-price-total');

let titlePage = $('#js-title-create'),
    name = $('#js-input-name'),
    qtd = $('#js-input-qtd'),
    measure = $('#js-select-measure'),
    category = $('#js-select-category'),
    unit = $('#js-span-unit'),
    nameSupport = null,
    categorySupport = null,
    timeout = null,
    inputPrice = null,
    nameList = null;

/**
 * @fileoverview Gerenciar as funções relacionadas os itens de compra
 * 
 * @class 
 */
export class ShopController {

    constructor() {
        throw new Error('Unable to Instantiate ShopController');
    }

    /**
     *  Abrir item de compras selecionado
     * 
     * @method open
     * @static
     */
    static open(event) {

        // Pegar dados do item selecionado
        const support = Support.supportShop(event);

        // Montar modal de acordo com o tipo passado, no caso 'modelPrice'
        Modal.mounts('modelPrice', support.model);

        // Inserir escutador de eventos nas opções do modal
        Listener.listenerModalShopPrice(support, event);

        // Inserir escutador de eventos no input de preço
        ShopController.input(support, event);

        inputPrice = $('#js-price');
        inputPrice.focus();

        // Somar todos os preços
        ShopController.priceTotal(support.listName)

    }

    /**
     *  Abrir modal com opções do item selecionado.
     * 
     * @method start
     * @static 
     */
    static start(event) {

        // Pegar dados do item selecionado
        const support = Support.supportShop(event);

        // Para contagem do timeout
        ShopController.end();

        timeout = setTimeout(() => {

            // Vibração ao pressionar o item
            Support.supportVibration();

            // Configuraçção do modal
            const model = {
                name: support.model.name,
                button: ['Editar', 'Excluir']
            }

            // Montar modal de acordo com o tipo passado, no caso 'modelSheets'
            Modal.mounts('modelSheets', model);

            // Inserir escutador de eventos nas opções do modal
            Listener.listenerModalShop(support, event);

        }, 1000);

    }


    /**
     *  Parar timeout (setTimeOut) das opçõses do modal
     * 
     * @method end
     * @static 
     */
    static end() {

        clearTimeout(timeout);

    }


    /**
     *  Deletar item de compra
     * 
     * @method delete
     * @static 
     * @param {Object} support Dados do item selecionado com nome,qtd,measure e etc.
     * @param {Event} event  Propriedades do elemeto
     */
    static delete(support, event) {
        event.preventDefault();

        // Transformar NodeList em Array
        const items = Array.prototype.slice.call($$('.list__item-shop')),
            message = 'A lista foi excluida por não conter itens.',
            title = 'Aviso';

        /* Se o item a ser excluido for o último, exibir dialogo de alerta. 
            Informando que a lista também será excluida */
        if (items.length === 1) {
            Dialogs.alert(message, () => {

                (async () => {

                    // Excluir lista
                    await ConnectionFactory.getConnection()
                        .then((connection) => new ListsDao(connection)
                            .delete(support.listName));

                    // Renderizar listas
                    await Render.renderLists();

                    Transitions.showHiddenToggle(pageIndex, pageShop);

                })();

            }, title);

        } else {

            // Adicionar class css para suavizar a saída do elemento
            Transitions.add('fade-out', support.target);

            setTimeout(() => {

                (async () => {

                    let itemsShop = null;

                    // Pegar todas as lista de compras
                    const result = await ConnectionFactory.getConnection()
                        .then((connection) => new ListsDao(connection)
                            .read());

                    // Filtra lista selecionada 
                    result.some((l) => {

                        if (l.name === support.listName) {
                            itemsShop = l.items;

                            // Filtra item de compra selecionada 
                            itemsShop.some((i, index) => {

                                if (i.name === support.model.name && i.category === support.model.category) {

                                    // Remover item do array
                                    itemsShop.splice(index, 1);

                                }

                                return;
                            });

                            return;
                        }

                    });

                    // Atualizar itens de compra
                    await ConnectionFactory.getConnection()
                        .then((connection) => new ListsDao(connection)
                            .update(support.listName, itemsShop));

                    // Somar todos os preços
                    ShopController.priceTotal(support.listName);

                    // Renderizar itens de compras
                    await Render.renderShop(support.listName);

                    // Inserir efeito Sticky nas categorias
                    Sticky.fixed('shop');

                })();

            }, 500);
        }

    }

    /**
     *  Editar item de compras selecionado
     * @method edit
     * @static
     * @param {Object} support Dados do item selecionado com nome,qtd,measure e etc.
     * @param {Event} event  Propriedades do elemeto
     */
    static edit(support, event) {
        event.preventDefault();

        // Alterar titulo da pagina
        titlePage.textContent = 'Editar item';

        // Preencher inputs para edição
        name.value = support.model.name;
        measure.value = support.model.measure;
        unit.textContent = support.model.unit;

        if (support.model.qtd <= 0) {
            qtd.value = '';

        } else {
            qtd.value = support.model.qtd;

        }

        (async () => {

            //Renderizar categorias
            await Render.renderSelectShop(support.listName);

            category.value = support.model.category;

        })();

        //Trocar de pagina
        Transitions.showHiddenToggle(pageCreateItem, pageShop);

        //Atribuir nome e categoria as variaveis
        nameSupport = support.model.name;
        categorySupport = support.model.category;

        ShopController.listSelected('set', support.listName);

        this.loadEdit();

    }

    /**
     *  Carregar e retornar dados do item de compras
     * 
     * @method loadEdit
     * @static 
     * @param {Object} support Dados do item selecionado com nome,qtd,measure e etc.
     * @returns {Object}
     */
    static loadEdit() {

        const data = {
            name: nameSupport,
            category: categorySupport
        }

        return data;
    }


    /**
     *  Adicionar preço no item e atualizar lista de comptras
     * 
     * @method addPrice
     * @static 
     * @param {String} listName (Required) Nome da lista 
     * @param {String} nameItem (Required) Nome do item
     * @param {String} categoryItem (Required) Nome da categoria do item
     * @param {Object} objectUpdate (Required) Nove objeto como o preço acrescentado
     */
    static addPrice(listName, nameItem, categoryItem, objectUpdate) {

        (async () => {

            // Pegar todas as listas no banco de dados
            const result = await ConnectionFactory.getConnection()
                .then((connection) => new ListsDao(connection)
                    .read());

            let items = null;

            // Filtrar lista selecionada
            result.some((lists) => {

                if (lists.name === listName) {
                    items = lists.items;
                    items.some((e, index) => {

                        if (e.name === nameItem && e.category === categoryItem) {

                            // Atualizar item
                            items.splice(index, 1, objectUpdate);

                        }

                        return;
                    });

                    return;
                }

            });

            // Atualizar lista com item com preço acrescentado
            await ConnectionFactory.getConnection()
                .then((connection) => new ListsDao(connection)
                    .update(listName, items));

            // Atualizar preço total da compra       
            ShopController.priceTotal(listName);

        })();

    }

    /**
     *  Atualizar preço total da compra
     * 
     * @method priceTotal
     * @static 
     * @param {String} listName (Required) Nome da lista 
     */
    static priceTotal(listName) {

        (async () => {

            let items = 0;

            //Pegar todas as listas de compras
            const result = await ConnectionFactory.getConnection()
                .then((connection) => new ListsDao(connection)
                    .read());

            // Filtrar lista selecionada       
            result.some((e) => {

                if (e.name === listName) {
                    e.items.forEach((i) => {

                        // Somar preços dos itens
                        items = FormatCoin.price(i.price) + items

                    });

                    // Atualizar preço
                    priceTotal.textContent = items.toFixed(2);
                }

            });

        })();

    }

    /**
     * Guardar nome da lista para adicionar itens
     * 
     * @method listSelected
     * @static
     * @param {String} manipulate (Required) Tipo de manipulação
     * @param {String} name (Required) Nome da lista
     */
    static listSelected(manipulate, name) {

        if (manipulate === 'set') {
            nameList = name;
            return nameList;

        } else if (manipulate === 'get') {
            return nameList;

        }

    }

    /**
     *  Formatar preços do input
     * 
     * @method input
     * @static 
     * @param {Object} support Dados do item selecionado com nome,qtd,measure e etc.
     * @param {Event} event  Propriedades do elemeto
     */
    static input(support, event) {
        event.preventDefault();

        const inputPrice = $('#js-price'),
            totalPrice = $('#js-total'),
            buttonSave = $('#js-save-price'),
            inputPriceValue = inputPrice.value;

        // Callback para tratar se o preços por <=0   
        const callback = () => {
            if (inputPrice.value <= 0 || inputPrice.value === '') {
                totalPrice.textContent = '00,00';
                Transitions.add('filter', buttonSave);

            } else {
                let unit = support.unit.textContent,
                    t = parseFloat(inputPrice.value * unit.replace(',', '.')).toFixed(2);
                totalPrice.textContent = t.replace('.', ',');
                Transitions.remove('filter', buttonSave);

            }

        }

        // Escutar evento do input de preço
        inputPrice.addEventListener('keypress', (event) => {

            // Formatar valor inserido
            FormatCoin.coin(inputPrice, inputPriceValue, '.', '.', event);

            callback();

        }, false);

    }

    /**
     *  Salve preço e atualizar lista
     * 
     * @method save
     * @static 
     * @param {Object} support Dados do item selecionado com nome,qtd,measure e etc.
     * @param {Event} event  Propriedades do elemeto
     */
    static save(support, event) {
        event.preventDefault();

        const nameItem = support.name.textContent,
            categoryItem = support.category.textContent,
            totalPrice = $('#js-total'),
            price = support.price,
            objectUpdate = {
                category: support.category.textContent,
                measure: support.measure.textContent,
                name: support.name.textContent,
                price: totalPrice.textContent,
                qtd: support.qtd.textContent,
                unit: support.unit.textContent
            };

        // Adicionar preço
        ShopController.addPrice(support.listName, nameItem, categoryItem, objectUpdate);

        // Alterar cor do item com o praço
        if (totalPrice.textContent <= 0 || totalPrice.textContent === '00,00' || totalPrice.textContent === '') {
            price.textContent = totalPrice.textContent;
            Transitions.add('none', support.priceBlock);
            Transitions.remove('list__item-shop--active', support.target);
            return;

        } else {
            price.textContent = totalPrice.textContent
            Transitions.remove('none', support.priceBlock);
            Transitions.add('list__item-shop--active', support.target);

        }

    }

    /**
     *  Finalizar compras
     * 
     * @method finalize
     * @static 
     */
    static finalize() {

        return new Promise(resolve => {

            let nameList = $('#js-title-shop').textContent,
                priceTotal = $('#js-price-total').textContent;

            (async () => {

                // Pegar todos as listas de compras
                const result = await ConnectionFactory.getConnection()
                    .then((connection) => new ListsDao(connection)
                        .read());

                let rest = false;

                // Objeto com dados da lista oara salvar em registro
                let register = {
                    date: FormatDate.date(),
                    name: nameList,
                    total: priceTotal
                }

                // Filtrar lista
                result.some((e) => {

                    if (e.name === nameList) {

                        // Verificar se o preço é maior que 0
                        e.items.forEach((t) => {
                            if (t.price === '00,00') {
                                rest = true;

                            }

                        });

                        // Salvar registro
                        const callback = () => {

                            // Adicionar registro
                            RecordFactory.add(register);

                            // Renderizar registros
                            Render.renderRecord();

                            // Apagar todos os preços da lista de compras
                            ClearData.clearPrice(register);

                            resolve();
                        }

                        // Tratativas
                        if (priceTotal === '0.00') {

                            Dialogs.alert('Não é possivel salvar a lista, todos os items estão sem preços.', () => {}, 'Aviso');

                        } else if (rest) {

                            Dialogs.confirm('Ainda a itens sem preço definido. Realmente deseja finalizar a compra?', (results) => {

                                if (results === 1) {

                                    callback();

                                }

                            }, 'Finalizar compra', 'Sim', 'Não');

                        } else {

                            Dialogs.alert('Compra fianlizada com sucesso.', () => {

                                callback();

                            }, 'Parabens');
                        }
                        return true;
                    }

                });

            })();

        });

    }


}