import {Dao} from './Dao';

/**
 * @fileoverview Gerenciar as funções relacionadas as connection
 * 
 * @class 
 */
export class ItemsDao extends Dao {

    constructor(connection) {
        super(connection, 'itemDb')
    }

    /**
     *  Zerar todas as unidadde dos items
     * 
     * @method clearUnit
     * @static 
     */
    clearUnit() {

        return new Promise(resolve => {

            (async () => {

                // Abrir connection
                let request = await this.request(this.connection, this.store);

                // Limpar unidades
                request.openCursor().onsuccess = (event) => {

                    let current = event.target.result;

                    if (current) {

                        let currentValue = current.value;

                        currentValue.unit = 0;

                        current.update(currentValue);

                        current.continue();

                    } else {
                        resolve();
                    }

                }

            })();

        });

    }

    /**
     *  Editar itens
     * 
     * @method edit
     * @static 
     */
    edit(old, element) {

        return new Promise(resolve => {

            (async () => {

                // Abrir connection
                let request = await this.request(this.connection, this.store);

                // Editar item
                request.openCursor().onsuccess = (event) => {

                    let current = event.target.result;

                    if (current) {
                        let currentValue = current.value;

                        if (currentValue.name === old.name && currentValue.category === old.category) {
                            currentValue = element;
                            current.update(currentValue);
                            return true;

                        }

                        current.continue();

                    }
                }
                resolve();

            })();

        });

    }


    /**
     *  Excluir itens
     * 
     * @method delete
     * @static 
     */
    delete(name, category) {

        return new Promise(resolve => {

            (async () => {

                // Abrir connection
                let request = await this.request(this.connection, this.store);

                // Excluir item
                request.openCursor().onsuccess = (event) => {

                    let current = event.target.result;

                    if (current) {
                        let currentValue = current.value;

                        if (currentValue.name === name && currentValue.category === category) {
                            current.delete(currentValue);

                        }

                        current.continue();

                    } else {
                        resolve();

                    }

                }

            })();

        });

    }

}