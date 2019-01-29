import {Dao} from './Dao';

/**
 * @fileoverview Gerenciar as funções relacionadas as connection
 * 
 * @class 
 */
export class SettingDao extends Dao {

    constructor(connection) {
        super(connection, 'settingDb');
    }

    /**
     * Excluir as configurações
     * 
     * @method delete
     * @static
     */
    delete() {

        return new Promise(resolve => {

            (async () => {

                // Abrir connection
                let request = await this.request(this.connection, this.store);

                // Excluir todos os registros
                request.openCursor().onsuccess = (event) => {
                    let current = event.target.result;

                    if (current) {
                        let currentValue = current.value;
                        current.delete(currentValue);
                        current.continue();

                    } else {
                        resolve('Deleted item from ' + this.store);
                    }
                }

            })();

        });
        
    }

}