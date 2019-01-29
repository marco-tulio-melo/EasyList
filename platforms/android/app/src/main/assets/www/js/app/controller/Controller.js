import {$,$$} from '../factories/SelectorsFactory';
import {CategoryFactory} from '../factories/CategoryFactory';
import {ClearData} from '../sevices/ClearData';
import {ConnectionFactory} from '../factories/ConnectionFactory';
import {Dialogs} from '../helpers/Dialogs';
import {ItemFactory} from '../factories/ItemFactory';
import {itemsViewInstance} from '../view/ItemsView';
import {Listener} from '../sevices/Listeners';
import {ListsDao} from '../dao/ListsDao';
import {listsViewInstance} from '../view/ListsView';
import {Menu} from '../sevices/Menu';
import {Modal} from '../sevices/Modal';
import {Render} from '../sevices/Render';
import {Save} from '../sevices/Save';
import {Scroll} from '../utils/Scroll';
import {ShopController} from './ShopController';
import {Sticky} from '../utils/Sticky';
import {Support} from '../utils/Support';
import {Transitions} from '../utils/Transitions';

let clickSave = false;

/**
 * @fileoverview Gerenciar as funções dos botões principais do app.
 * 
 * @class 
 */
class Controller {

    constructor() {

        //Input Create item
        this._inputs = {
            name: $('#js-input-name'),
            qtd: $('#js-input-qtd'),
            measure: $('#js-select-measure'),
            unit: $('#js-span-unit'),
            category: $('#js-select-category'),
            price: '00,00'
        }

        //Pages
        this._pageIndex = $('#js-page-index');
        this._pageList = $('#js-page-list');
        this._pageShopping = $('#js-page-shopping');
        this._pageCreateItem = $('#js-page-create-item');

        // Page List Elements
        this._titlePageList = $('#title-page-list');
        this._headerSave = $('#js-save-list');

        // Page Shopping Elements
        this._titlePageShopping = $('#js-title-shop');

        // Page Create List Elements
        this._titlePageCreateItems = $('#js-title-create');

        // Class
        this._listView = listsViewInstance();
        this._itemsView = itemsViewInstance();

        //Run
        this.init();

    }

    /**
     *  Inicialização da aplicação
     * 
     * @method init
     */
    init(event) {

        // Popular banco de dados items caso esteja vazio
        ItemFactory.init();

        // Carregar listas prontas
        Render.renderLists();

        // Verificar se a registros 
        Render.renderRecord();

        // Escutar evento para sair do modal
        Listener.listenerModal();

        // Escutar evento acrecentar ou decrementar unidades
        Listener.listenerUnitCreateItem();

        // Escutar evento para limitar caracteres
        Listener.listenerCustomQtd();

        // Escutar evento alterar tema
        Listener.listenerSettingVibration();

        // Verificar vibração
        Save.saveSettingVibration(event);

        // Escutar evento do menu
        Menu.selectMenuListiner();

    }

    ////////////////////////////////////////////////////////////////////////////
    //
    //                             Device
    //
    ////////////////////////////////////////////////////////////////////////////

    /** 
     * Método responsável pela ação do botão de voltar nativo do dispositivo
     * 
     * @method backButtonDevice
     * */
    backButtonDevice(event) {

        const containers = $$('.container');

        containers.forEach((e) => {

            if (!Transitions.contains('none', e)) {
                const attr = e.getAttribute('id');

                if (attr === 'js-page-index') {
                    navigator.app.exitApp();

                } else if (attr === 'js-page-list') {
                    this.buttonBackList(event)

                } else if (attr === 'js-page-shopping') {
                    this.buttonBackShop(event)

                } else if (attr === 'js-page-create-item') {
                    this.buttonBackCreateItem(event)
                }

            }
        });

    }

    ////////////////////////////////////////////////////////////////////////////
    //
    //                             PageIndex
    //
    ////////////////////////////////////////////////////////////////////////////

    /** 
     * Abrir informações sobre o app
     * 
     * @method buttonAbout
     * */
    buttonAbout(event) {
        event.preventDefault();

        // Montar modal
        Modal.mounts('modelAbout');

        // Escutar evento para voltar a pagina inicial
        Listener.listenerBackAbout();

    }

    /** 
     * Método responsável de abrir a pagina de criação de listas e 
     * renderizar os itens salvos no banco  de dados.
     * 
     * @method buttonCreateList
     * */
    buttonCreateList(event) {
        event.preventDefault();

        //Aplicar vibração
        Support.supportVibration();

        (async () => {

            //Ativar loader
            Transitions.loader(true);

            // Alterar titulo da pagina
            this._titlePageList.textContent = 'Nova Lista';

            // Renderizar itens
            await Render.renderItems(true);

            // Trocar de pagina
            Transitions.showHiddenToggle(this._pageIndex, this._pageList);

            // Inserir efeito Sticky nas categorias
            Sticky.fixed('list');

            // Fazer a rolagem até o primeiro item
            Scroll.scrolling('fisrt');

            //Desativer loader
            Transitions.loader(false);

        })();

    }

    /**
     * Método responsável por excluir todos os registros de compras 
     * do banco de dados e renderizar a pagina novamente.
     * 
     * @method buttonClearRecord
     */
    buttonClearRecord(event) {
        event.preventDefault();

        //Aplicar vibração
        Support.supportVibration();

        const message = 'Deseja excluir todos os registros?',
            title = 'Excluir registros:';

        // Dialogo para confirmar se os registros podem ser apagado
        Dialogs.confirm(message, (results) => {

            if (results === 1) {
                ClearData.clearRecord();
            }

        }, title, 'Sim', 'Não');

    }

    /**
     * Método responsável por restaurar o app.
     * 
     * @method buttonRestoreApp
     */
    buttonRestoreApp(event) {
        event.preventDefault();

        //Aplicar vibração
        Support.supportVibration();

        const message = 'Todas as listas e registros serão apagados. Deseja restaurar o Easylist?',
            title = 'Restaurar EasyList:';

        // Dialogo para confirmar se os registros podem ser apagado
        Dialogs.confirm(message, (results) => {

            if (results === 1) {
                ClearData.clearDataApp();
            }

        }, title, 'Sim', 'Não');

    }

    ////////////////////////////////////////////////////////////////////////////
    //
    //                             PageList
    //
    ////////////////////////////////////////////////////////////////////////////

    /** 
     * Método responsável abrir a pagina para criação de novos itens,
     * e renderizar select com o nome das categorias
     * 
     * @method buttonOpenCreateItem
     * */
    buttonOpenCreateItem(event) {
        event.preventDefault();

        //Aplicar vibração
        Support.supportVibration();

        const target = event.srcElement;

        // Alterar titulo da pagina
        this._titlePageCreateItems.textContent = 'Criar item';

        if (target.id === 'js-add-item') {

            // Renderizar categorias
            Render.renderSelect();

            // Trocar de pagina
            Transitions.showHiddenToggle(this._pageCreateItem, this._pageList);

        } else if (target.id === 'js-add-item-shop') {

            // Guardar nome da lista
            const list = ShopController.listSelected('set', this._titlePageShopping.textContent);

            // Renderizar categorias
            Render.renderSelectShop(list);

            // Trocar de pagina
            Transitions.showHiddenToggle(this._pageCreateItem, this._pageShopping);
        }

    }

    /** 
     * Método responsável por salvar as listas,
     * 
     * @method buttonSaveLis
     *  */
    buttonSaveList(event) {
        event.preventDefault();

        //Aplicar vibração
        Support.supportVibration();

        (async () => {

            /* Pegar todas as listas salvas no banco de dados para a validação 
            de nome */
            const result = await ConnectionFactory.getConnection()
                .then((connection) => new ListsDao(connection)
                    .read());

            /* Validar o nome da nova lista e chamar metodo para gravar
            no banco de dados */
            await Save.openModalNameList(this._titlePageList, result);

        })();

    }

    /** 
     * Voltar para pagina inicial ou salvar lista
     * 
     * @method buttonSaveList
     *  */
    buttonBackList(event) {
        event.preventDefault();

        const message = 'A lista não foi salva. Deseja salvar?',
            title = 'Lista não salva:';

        /* Se a nova lista não conter itens selecionados, 
        voltara para a pagina inicial*/

        if (this._headerSave.classList.contains('fade-out')) {

            // Renderizar listas
            Render.renderLists();

            // Trocar de pagina
            Transitions.showHiddenToggle(this._pageIndex, this._pageList);

            // Limpar pagina de itens
            this._itemsView.update(null);

        } else {

            /* Caso a nova lista tiver items adicionados, abrir dialogo 
            para a confirmação se deseja salvar a lista ou não*/
            Dialogs.confirm(message, (results) => {
                if (results === 1) {

                    // Metodo para salvar lista
                    this.buttonSaveList(event);

                } else if (results === 2) {

                    // Esconder botão salvar
                    Transitions.addIsRemove(this._headerSave, 'fade-out', 'fade-in');

                    // Trocar de pagina
                    Transitions.showHiddenToggle(this._pageIndex, this._pageList);

                    // Limpar pagina de itens
                    this._itemsView.update(null);

                }

            }, title, 'Sim', 'Não');
        }

    }

    /////////////////////////////////////////////////////////////////////////////
    //
    //                             PageCreateItem
    //
    ////////////////////////////////////////////////////////////////////////////

    /** 
     * Voltar para pagina de criação de lista 
     * 
     * @method buttonBackCreateItem
     *  */
    buttonBackCreateItem(event) {
        event.preventDefault();

        return new Promise(resolve => {

            (async () => {

                // Validar se o item será salvo em uma lista já existete
                const validation = ShopController.listSelected('get');

                if (validation === null) {

                    // if (titlePage === 'Criar item') {

                    // Renderizar itens
                    await Render.renderItems(false);

                    //Trocar de pagina
                    Transitions.showHiddenToggle(this._pageCreateItem, this._pageList)

                    // Inserir efeito Sticky na categorias
                    Sticky.fixed('list');

                    // Excluir campos
                    ClearData.emptyInputs();

                    // Fazer a rolagem até o último item salvo
                    if (clickSave) {

                        await Scroll.scrolling('last');

                        clickSave = false;
                    }

                    resolve();

                } else {

                    // Renderizar itens de compras
                    await Render.renderShop(validation);

                    //Trocar de pagina
                    Transitions.showHiddenToggle(this._pageCreateItem, this._pageShopping)

                    // Inserir efeito Sticky na categorias
                    Sticky.fixed('shop');

                    // Excluir campos
                    ClearData.emptyInputs();

                    ShopController.listSelected('set', null);

                    resolve();
                }
            })();

        });

    }

    /** 
     * Adicionar nova categoria
     * 
     * @method buttonAddCategory
     *  */
    buttonAddCategory(event) {
        event.preventDefault();

        //Aplicar vibração
        Support.supportVibration();

        //Validar nome da nova categoria e adiconar
        CategoryFactory.add(this._inputs.category);

    }

    /** 
     * Salvar novo item
     * 
     * @method buttonSaveItem
     **/
    buttonSaveItem(event) {
        event.preventDefault();

        //Aplicar vibração
        Support.supportVibration();

        // Validar se o item será salvo em uma lista já existete
        const validation = ShopController.listSelected('get'),
            titlePage = this._titlePageCreateItems.textContent;

        if (validation === null) {

            //Verificar o titulo da pagina
            if (titlePage === 'Criar item') {

                (async () => {

                    //Validar nome do novo item e salvar
                    await Save.saveItem(this._inputs, 'create');

                    clickSave = true;
                })();

            } else if (titlePage === 'Editar item') {

                (async () => {

                    //Editar item selecionado
                    const items = await Save.saveItem(this._inputs, 'edit');

                    await this.buttonBackCreateItem(event);

                    // Alterar varivel para acionar rolagem áte o último item salve
                    await Scroll.scrolling('medium', items);

                })();
            }

        } else {

            //Verificar o titulo da pagina
            if (titlePage === 'Criar item') {

                (async () => {

                    //Validar nome do novo item e salvar
                    await Save.saveItemShop(this._inputs, 'create', validation);

                })();

            } else if (titlePage === 'Editar item') {

                (async () => {

                    //Editar item selecionado
                    await Save.saveItemShop(this._inputs, 'edit', validation);

                    await this.buttonBackCreateItem(event);

                })();
            }
        }

    }

    /////////////////////////////////////////////////////////////////////////////
    //
    //                             PageShopping
    //
    ////////////////////////////////////////////////////////////////////////////

    /** 
     * Voltar para pagina inicial
     * 
     * @method buttonBackShop
     **/
    buttonBackShop(event) {
        event.preventDefault();

        // Renderizar listas
        Render.renderLists();

        // Trocar de pagina
        Transitions.showHiddenToggle(this._pageIndex, this._pageShopping);

    }

    /** 
     * Adicionar item a lista selecionada
     * 
     * @method buttonAddShop
     **/
    buttonAddShop(event) {
        event.preventDefault();

        //Aplicar vibração
        Support.supportVibration();

        this.buttonOpenCreateItem(event);

    }

    /** 
     * Metodo responsável por finalizar a compra
     * 
     * @method buttonFinalizeShop
     **/
    buttonFinalizeShop(event) {
        event.preventDefault();

        //Aplicar vibração
        Support.supportVibration();

        (async () => {

            // Finalizar a compra e informar se a items sem o preço
            await ShopController.finalize();

            // Trocar de pagina
            Transitions.showHiddenToggle(this._pageShopping, this._pageIndex);
        })();
    }

}

const instance = new Controller();
Object.freeze(instance);

/**
 * Singleton Controller
 * @function controllerInstancie
 * @returns {Object}
 */
export function controllerInstancie() {
    return instance;
}