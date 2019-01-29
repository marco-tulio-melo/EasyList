import {$} from '../factories/SelectorsFactory';
import {CategoryFactory} from '../factories/CategoryFactory';
import {ConnectionFactory} from '../factories/ConnectionFactory';
import {Effects} from './Effects';
import {ItemFactory} from '../factories/ItemFactory';
import {ItemsDao} from '../dao/ItemsDao';
import {itemsViewInstance} from '../view/ItemsView';
import {Listener} from '../sevices/Listeners';
import {ListsDao} from '../dao/ListsDao';
import {listsViewInstance} from '../view/ListsView';
import {RecordDao} from '../dao/RecordDao';
import {recordViewInstance} from '../view/RecordView';
import {selectViewInstance} from '../view/SelectView';
import {ShopController} from '../controller/ShopController';
import {shopViewInstance} from '../view/ShopView';
import {Transitions} from '../utils/Transitions';

const listEmpty = $('#js-list-empty'),
    homeBox = $('#js-home-box'),
    recordBox = $('#js-record-box'),
    recordEmpty = $('#js-record-empty'),
    listsView = listsViewInstance(),
    listView = shopViewInstance(),
    selectView = selectViewInstance(),
    itemsView = itemsViewInstance(),
    recordView = recordViewInstance();

/**
 * @fileoverview Gerenciar as funções de renderização
 * 
 * @class
 */
export class Render {

    constructor() {
        throw new Error('Unable to Instantiate Render');
    }

    /**
     * Renderizar Listas
     * 
     * @method renderLists
     * @static
     **/
    static renderLists() {
        return new Promise(resolve => {

            (async () => {

                // Pegar todas as listas
                const result = await ConnectionFactory.getConnection()
                    .then((connection) => new ListsDao(connection)
                        .read());

                // Inverte o array
                if (result.length > 0) {

                    listsView.update(result.reverse());
                   
                    // Inserir eventos nas listas
                    Listener.listenerLists();
                    
                    /* Esconder bloco com listas e adicionar bloco de 
                     não encontrados */
                    Transitions.showHiddenAll(homeBox, listEmpty);
                    
                } else {

                    // Limpar view
                    listsView.update(null);

                    /* Esconder bloco de não encontrados e adicionar bloco de 
                     listas */
                    Transitions.showHiddenAll(listEmpty, homeBox);
                }

                resolve(result);

            })();

        });

    }

    /**
     * Renderizar categorias para novos itens
     * 
     * @method renderSelect
     * @static
     **/
    static renderSelect() {
        return new Promise(resolve => {

            (async () => {

                // Pegar todos os itens para extrair as categorias
                const result = await ConnectionFactory.getConnection()
                    .then((connection) => new ItemsDao(connection)
                        .read());

                // Montar estrutura de categorias
                const categories = CategoryFactory.mountsCategories(result).nameCategories;

                // Renderizar select com categorias
                selectView.update(categories);

                resolve();

            })();

        });

    }

    /**
     * Renderizar categorias para novos itens
     * 
     * @method renderSelectShop
     * @static
     **/
    static renderSelectShop(nameList) {
        return new Promise(resolve => {

            (async () => {

                // Pegar todos os itens para extrair as categorias
                const result = await ConnectionFactory.getConnection()
                    .then((connection) => new ListsDao(connection)
                        .read());

                result.some((l) => {
                    if (l.name === nameList) {
                        const categories = CategoryFactory.mountsCategories(l.items).nameCategories;

                        // Renderizar select com categorias
                        selectView.update(categories);

                        return true

                    }

                });

                resolve();

            })();

        });

    }


    /**
     * Renderizar itens
     * 
     * @method renderItems
     * @static
     * @param {Boolean} isClear (Required) Zerar as unidades dos itens
     **/
    static renderItems(isClear) {
        return new Promise(resolve => {

            (async () => {

                // Carregar items de Db
                const result = await ItemFactory.mountsItems(isClear);
                itemsView.update(result.categories);

                // Adicionar evento nos botoes de unidade
                Listener.listenerUnitItems();

                // Ativar a esculta do botao de salvar
                Effects.SaveButtonEffects();

                // Inserir ouvintes aos itens
                Listener.listenerItems();

                // Efeito nos itens selecionados
                Effects.itemEffects();

                resolve();

            })();

        });

    }

    /**
     * Renderizar Registros
     * 
     * @method renderRecord
     * @static
     **/
    static renderRecord() {
        return new Promise(resolve => {

            (async () => {

                // Pegar todos os registros 
                const result = await ConnectionFactory.getConnection()
                    .then((connection) => new RecordDao(connection)
                        .read());

                // Verificar se registros salvos e renderizar
                if (result.length > 0) {

                    // Renderizar registros
                    recordView.update(result);

                    /* Esconder bloco com registros e adicionar bloco de 
                    registros não encontrados */
                    Transitions.showHiddenAll(recordBox, recordEmpty);

                } else {

                    // Excluir registros
                    recordView.update(null);

                    /* Esconder bloco com registros e adicionar bloco de 
                    registros não encontrados */
                    Transitions.showHiddenAll(recordEmpty, recordBox);

                }

                resolve();

            })();

        });

    }

    /**
     *  Renderizar lista de compras
     * 
     * @method renderShop
     * @static
     **/
    static renderShop(nameList) {
        return new Promise(resolve => {

            (async () => {

                // Pegar todos as listas
                const result = await ConnectionFactory.getConnection()
                    .then((connection) => new ListsDao(connection)
                        .read());

                // Comparar nome das listas   
                result.some((list) => {
                    if (list.name === nameList) {

                        // Montar estrutura de categorias
                        const categories = CategoryFactory.mountsCategories(list.items).categories;

                        // Renderizar lista decompras
                        listView.update(categories);

                        // Mudar cor nos items com preco
                        Effects.itemsShopEffects();

                        // Inserir eventos nas listas de compras
                        Listener.listenerShop();

                        // Calcular preço total da compra
                        ShopController.priceTotal(nameList);

                        return true;
                    }

                });

                resolve(nameList);

            })();

        });
    }

}