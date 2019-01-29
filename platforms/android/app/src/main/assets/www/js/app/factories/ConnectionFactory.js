const store = ['listsDb', 'itemDb', 'recordDb', 'settingDb'],
    version = 1,
    dbName = 'easyList';

var connection = null,
    close = null;

/**
 * @fileoverview Gerenciar as funções relacionadas a conexão com o branco de dados
 * 
 * @class 
 */
export class ConnectionFactory {

    constructor() {
        throw new Error('Unable to Instantiate ConnectionFactory')
    }

    /**
     *  Pegar conexão
     * @method getConnection
     * @static
     */
    static getConnection() {

        return new Promise((resolve, reject) => {

            // Abrir banco de dados
            let openRequest = window.indexedDB.open(dbName, version);

            // Criar ou atualizar banco de dados
            openRequest.onupgradeneeded = (event) => {

                store.forEach((e) => {
                    event.target.result.createObjectStore(e, {
                        autoIncrement: true

                    });

                })

            }

            openRequest.onsuccess = (event) => {

                // Não permitir que o fechamento da conexão
                if (!connection) {
                    connection = event.target.result;
                    close = connection.close.bind(connection);
                    connection.close = () => {
                        throw new Error('You can not close the connection..')

                    }
                };
                resolve(connection);
            }

            openRequest.onerror = (event) => {
                reject(event.target.error.name);
            }

        });

    }

    /**
     *  Fechar conexão
     * @method closeConnection
     * @static
     */
    static closeConnection() {

        if (connection) {
            close();
            connection = null;

        }
    }

}