import {Dao} from './Dao';

/**
 * @fileoverview Gerenciar as funções relacionadas as connection
 * 
 * @class 
 */
export class ListsDao extends Dao {

    constructor(connection) {
        super(connection, 'listsDb')
    }

    /**
     *  Renomear listas
     * 
     * @method rename
     * @static
     * @param {String} old (Required) Nome da lista selecionada
     * @param {String} newName (Required) Novo nome da lista
     */
    rename(old, newName) {

        return new Promise(resolve => {

            (async () => {

                // Abrir connection
                let request = await this.request(this.connection, this.store);

                // Atualizar nome da lista
                request.openCursor().onsuccess = (event) => {

                    let current = event.target.result;

                    if (current) {
                        let currentValue = current.value;

                        if (currentValue.name === old) {
                            currentValue.name = newName;
                            current.update(currentValue);

                        }

                        current.continue();

                    } else {

                        resolve();

                    }
                }

            })();

        });

    }

    /**
     * Atualizar itens da lista
     * 
     * @method update
     * @static
     * @param {String} name (Required) Nome da lista selecionada
     * @param {Array} item (Required) Itens atualizados
     */
    update(name, item) {

        return new Promise(resolve => {

            (async () => {

                // Abrir connection
                let request = await this.request(this.connection, this.store);

                // Atualizar lista
                request.openCursor().onsuccess = (event) => {
                    let current = event.target.result;

                    if (current) {
                        let currentValue = current.value;

                        if (currentValue.name === name) {
                            currentValue.items = item;
                            currentValue.qtdItems = item.length;
                            current.update(currentValue);

                        }

                        current.continue();

                    } else {

                        resolve();

                    }
                }

            })();

        });

    }

    /**
     * Excluir lista
     * 
     * @method delete
     * @static
     * @param {String} name (Required) Nome da lista a ser excluida
     */
    delete(name) {

        return new Promise(resolve => {

            (async () => {

                // Abrir connection
                let request = await this.request(this.connection, this.store);

                //Excluir lista
                request.openCursor().onsuccess = (event) => {
                    let current = event.target.result;

                    if (this.store === 'listsDb') {

                        if (current) {
                            let currentValue = current.value;

                            if (currentValue.name === name) {
                                current.delete(currentValue);

                            }

                            current.continue();

                        } else {

                            resolve('Deleted item from ' + this.store);

                        }
                    }
                }

            })();

        });

    }

}