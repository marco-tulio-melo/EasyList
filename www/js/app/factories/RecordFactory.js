import {ConnectionFactory} from './ConnectionFactory';
import {RecordDao} from '../dao/RecordDao';

/**
 * @fileoverview Gerenciar as funções relacionadas ao registro de compras
 * 
 * @class 
 */
export class RecordFactory {

    constructor() {
        throw new Error('Unable to Instantiate RecordFactory')
    }

    /**
     *  Adicionar registros no banco de dados
     * @method add
     * @static
     * @param {Object} register (Required) Dados do registro
     */
    static add(register) {

        (async () => {

            ConnectionFactory.getConnection()
                .then((connection) => new RecordDao(connection)
                    .add(register));
        })();

    }

}