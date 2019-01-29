import {$} from '../factories/SelectorsFactory';
import {ConnectionFactory} from '../factories/ConnectionFactory';
import {Dialogs} from '../helpers/Dialogs';
import {ItemFactory} from '../factories/ItemFactory';
import {ItemsDao} from '../dao/ItemsDao';
import {ListsDao} from '../dao/ListsDao';
import {Menu} from './Menu';
import {RecordDao} from '../dao/RecordDao';
import {Render} from './Render';
import {Transitions} from '../utils/Transitions';

const recordBox = $('#js-record-box'),
    recordEmpty = $('#js-record-empty'),
    inputs = {
        name: $('#js-input-name'),
        qtd: $('#js-input-qtd'),
        unit: $('#js-span-unit'),
    };

/**
 * @fileoverview Gerenciar as funções relacionadas aos inputs
 * 
 * @class 
 */
export class ClearData {

    constructor() {
        throw new Error('Unable to Instantiate  ClearData ');
    }

    /**
     *  Apagar os inputs
     * 
     * @method emptyInputs
     * @static 
     */
    static emptyInputs() {

        inputs.name.value = '';
        inputs.qtd.value = '';
        inputs.unit.textContent = '1';
        inputs.name.focus();

    }

    /**
     * Excluir todos os registros de compras 
     * 
     * @method clearRecord
     */
    static clearRecord() {

        // Excluir registro do banco de dados
        ConnectionFactory.getConnection()
            .then((connection) => new RecordDao(connection)
                .deleteAll());

        // Renderizar pagina        
        Render.renderRecord();

        /* Esconder bloco com registros e adicionar bloco de 
        registros não encontrados */
        Transitions.showHiddenToggle(recordBox, recordEmpty);

    }

    /**
     * Excluir todas as lista e restaurar itens 
     * 
     * @method clearRecord
     */
    static clearDataApp() {
        const message = 'EasyList foi restaurado com sucesso.',
            title = 'Restauração:';

        (async () => {

            Transitions.loader(true);

            // Apagar refistros
            await ConnectionFactory.getConnection()
                .then((connection) => new RecordDao(connection)
                    .deleteAll());

            // Apagar listas
            await ConnectionFactory.getConnection()
                .then((connection) => new ListsDao(connection)
                    .deleteAll());

            // Apagar Itens
            await ConnectionFactory.getConnection()
                .then((connection) => new ItemsDao(connection)
                    .deleteAll());

            // Renderizar paginas        
            await Render.renderRecord();
            await Render.renderLists();
            await Render.renderItems();

            // Popular Db items caso esteja vazio
            ItemFactory.init();

            Transitions.loader(false);

            // Dialogo de aviso
            Dialogs.alert(message, Menu.selectMenuListiner(), title);

        })();

    }

    /**
     * Limpar os preços da lista selecionada
     * 
     * @method clearPrice
     * @static 
     * @param {String} list Nome da lista selecionada.
     * */
    static clearPrice(list) {

        (async () => {

            const lists = await ConnectionFactory.getConnection()
                .then((connection) => new ListsDao(connection)
                    .read());

            lists.some((e) => {
                if (e.name === list.name) {
                    e.items.forEach((t) => {
                        t.price = '00,00'

                    });

                    ConnectionFactory.getConnection()
                        .then((connection) => new ListsDao(connection)
                            .update(e.name, e.items));

                }

            });

        })();

    }

}