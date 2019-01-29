import {$} from '../factories/SelectorsFactory';
import {ConnectionFactory} from '../factories/ConnectionFactory';
import {Dialogs} from '../helpers/Dialogs';
import {Listener} from '../sevices/Listeners';
import {ListsDao} from '../dao/ListsDao';
import {Modal} from '../sevices/Modal';
import {Render} from '../sevices/Render';
import {Sticky} from '../utils/Sticky';
import {Support} from '../utils/Support';
import {Transitions} from '../utils/Transitions';
import {ValidationNames} from '../helpers/ValidationNames';

const pageShopping = $('#js-page-shopping'),
    pageIndex = $('#js-page-index'),
    titlePage = $('#js-title-shop');

let timeout;

/**
 * @fileoverview Gerenciar as funções relacionadas as Listas
 * 
 * @class 
 */
export class ListsController {

    constructor() {
        throw new Error('Unable to Instantiate ListsController');
    }

    /**
     *  Abrir lista de compras selecionada
     * 
     * @method open
     * @static
     */
    static open(event) {

        (async () => {

            const nameList = Support.supportLists(event).name;

            // Renderizar lista para compras
            const result = await Render.renderShop(nameList);

            // Alterar titulo da pagina
            titlePage.textContent = result;

            // Trocar de pagina
            Transitions.showHiddenAll(pageShopping, pageIndex);

            // Inserir efeito Sticky nas categorias
            Sticky.fixed('shop');

            // Escutar evento dos itens de compra
            Listener.listenerShop();

        })();

    }

    /**
     *  Abrir modal com opções da lista selecionada, 
     * 
     * @method start
     * @static 
     */
    static start(event) {

        // Pegar dados da lista selecionada
        const support = Support.supportLists(event);

        // Para contagem do timeout
        ListsController.end();

        timeout = setTimeout(() => {

            // Vibração ao pressionar o item
            Support.supportVibration();

            // Configuraçção do modal
            const model = {
                name: support.name,
                button: ['Limpar', 'Renomear', 'Excluir']
            }

            // Montar modal de acordo com o tipo passado, no caso 'modelSheets'
            Modal.mounts('modelSheets', model);

            // Inserir escutador de eventos nas opções do modal
            Listener.listenerModalList(support);

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
     * Confirmar a limpeza dos preços da lista selecionada
     * 
     * @method clear
     * @static 
     * @param {Object} support Dados do item selecionado com nome,qtd,measure e etc.
     * @param {Event} event  Propriedades do elemeto
     */
    static clear(support, event) {
        event.preventDefault();

        // Ocultar Modal
        Modal.disappear();

        const message = 'Todos os peços cadastrados serão apagados.Deseja continuar?',
            title = 'Limpar preços:';

        Dialogs.confirm(message, (results) => {

            if (results === 1) {
                ClearData.clearPrice(support);

            }

        }, title, 'Sim', 'Não');

    }

    /**
     *  Deletar Lista
     * 
     * @method delete
     * @static 
     * @param {Object} support Dados do item selecionado com nome,qtd,measure e etc.
     * @param {Event} event  Propriedades do elemeto
     */
    static delete(support, event) {
        event.preventDefault();

        // Ocultar Modal
        Modal.disappear();

        // CallBack passado após o retorno do dialogo de confirmação
        const callBack = (results) => {
            if (results == 1) {

                Transitions.add('fade-out', support.target);

                setTimeout(() => {
                    (async () => {

                        // Pegar todas as listas
                        const result = await ConnectionFactory.getConnection()
                            .then((connection) => new ListsDao(connection)
                                .read())

                        // Filtra lista selecionada 
                        result.some((l) => {
                            if (l.name === support.name) {
                                (async () => {

                                    // Excluir lista
                                    await ConnectionFactory.getConnection()
                                        .then((connection) => new ListsDao(connection)
                                            .delete(l.name));

                                })();
                                return true;
                            }

                        });

                        // Renderizar listas
                        Render.renderLists();

                    })();

                }, 500)
            }

        }

        const message = `Deseja excluir ${support.name} permanentemente?`,
            title = 'Excluir lista:';

        // Abrir dialogo para confirmação, se dejesa excluir a lista
        Dialogs.confirm(message, (results) => {

            callBack(results);

        }, title, 'Ok', 'Cancelar');

    }

    /**
     *  Renomear Lista
     * 
     * @method rename
     * @static 
     * @param {Object} support Dados do item selecionado com nome,qtd,measure e etc.
     * @param {Event} event  Propriedades do elemeto
     */
    static rename(support, event) {
        event.preventDefault();

        // Ocultar Modal
        Modal.disappear();

        // CallBack passado após o retorno do dialogo de confirmação
        const callBack = (results) => {

            if (results.buttonIndex === 1) {
                (async () => {

                    const result = await ConnectionFactory.getConnection()
                        .then((connection) => new ListsDao(connection)
                            .read());

                    const renameList = (name) => {

                        // Renomear lista no banco de dado
                        ConnectionFactory.getConnection()
                            .then((connection) => new ListsDao(connection)
                                .rename(support.name, name));

                        // Renderizar listas 
                        Render.renderLists();

                    }

                    // Validar nome da nova lista
                    ValidationNames.validation(results, result, 'list', renameList.bind(this));

                })();

            }

        }

        const message = 'Novo nome:',
            title = 'Renomear lista';

        // Abrir dialogo para inserir o nome da lista
        Dialogs.prompt(message, (results) => {

            callBack(results);

        }, title)

    }


}