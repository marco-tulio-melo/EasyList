import {$,$$} from '../factories/SelectorsFactory';
import {ConnectionFactory} from '../factories/ConnectionFactory';
import {Dialogs} from '../helpers/Dialogs';
import {ItemsDao} from '../dao/ItemsDao';
import {Listener} from '../sevices/Listeners';
import {Modal} from '../sevices/Modal';
import {Render} from '../sevices/Render';
import {Sticky} from '../utils/Sticky';
import {Support} from '../utils/Support';
import {Transitions} from '../utils/Transitions';

const pageList = $('#js-page-list'),
    pageCreateItem = $('#js-page-create-item');

let titlePage = $('#js-title-create'),
    name = $('#js-input-name'),
    qtd = $('#js-input-qtd'),
    measure = $('#js-select-measure'),
    category = $('#js-select-category'),
    unit = $('#js-span-unit'),
    nameSupport = null,
    categorySupport = null,
    timeout = null;

/**
 * @fileoverview Gerenciar as funções relacionadas aos items para criação das listas
 * 
 * @class 
 */
export class ItemsController {

    constructor() {
        throw new Error('Unable to Instantiate ItemsController');
    }

    /**
     *  Abrir modal com opções do item selecionado.
     * 
     * @method start
     * @static 
     */
    static start(event) {

        // Pegar dados do item selecionado
        const support = Support.supportItems(event);

        // Para contagem do timeout
        ItemsController.end();

        timeout = setTimeout(() => {

            // Vibração ao pressionar o item
            Support.supportVibration();

            // Configuraçção do modal
            const model = {
                name: support.name,
                button: ['Editar', 'Excluir']
            }

            // Montar modal de acordo com o tipo passado, no caso 'modelSheets'
            Modal.mounts('modelSheets', model);

            // Inserir escutador de eventos nas opções do modal
            Listener.listenerModalItems(support, event);

        }, 1000);

    }

    /**
     *  Parar timeout (setTimeOut) das opçõses do modal
     * 
     * @method end
     * @static 
     */
    static end() {

        // Para contagem o setTimeOut do método start
        clearTimeout(timeout);

    }

    /**
     * Editar item selecionado
     * 
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
        name.value = support.name;
        measure.value = support.measure;
        unit.textContent = support.unit;

        if (support.qtd <= 0) {
            qtd.value = '';
        } else {
            qtd.value = support.qtd;
        }

        (async () => {

            await Render.renderSelect();

            // Selecionar categoriado item
            category.value = support.category;

        })();

        //Trocar de pagina
        Transitions.showHiddenToggle(pageCreateItem, pageList);

        //Atribuir nome e categoria as variaveis
        nameSupport = support.name;
        categorySupport = support.category;

        this.loadEdit();
    }

    /**
     *  Carregar e retornar dados do item
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
     *  Deletar item
     * 
     * @method delete
     * @static 
     * @param {Object} support Dados do item selecionado com nome,qtd,measure e etc.
     * @param {Event} event  Propriedades do elemeto
     */
    static delete(support, event) {
        event.preventDefault();

        // Transformar NodeList em Array
        const items = Array.prototype.slice.call($$('.list__item')),
            message = 'O item não pode ser excluido.',
            title = 'Aviso';

        /* Se o item a ser excluido for o último, exibir dialogo de alerta. 
        Informando que o item não pode ser excluido */
        if (items.length === 1) {
            Dialogs.alert(message, () => {}, title);
        } else {

            // Adicionar class css para suavizar a saída do elemento
            Transitions.add('fade-out', support.target);

            setTimeout(() => {

                (async () => {

                    // Excluir item do banco de dados
                    await ConnectionFactory.getConnection()
                        .then((connection) => new ItemsDao(connection)
                            .delete(support.name, support.category));

                    // Renderizar itens
                    await Render.renderItems(false);

                    // Inserir efeito Sticky nas categorias
                    Sticky.fixed('list');

                })();

            }, 500);
        }

    }


}