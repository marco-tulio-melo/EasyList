/**
 * @fileoverview Gerenciar as funções relacionadas as 
 * connection e metodos em comum
 * 
 * @class 
 */
export class Dao {

    constructor(connection, store) {
        this.connection = connection;
        this.store = store;
    }

    /**
     *  Adicionar dados no tabela selecionada
     * 
     * @method add
     * @static 
     * @param {Object} element (Required) Elemento a ser adicionado
     */
    add(element) {

        return new Promise(resolve => {

            (async () => {

                // Abrir connection
                let request = await this.request(this.connection, this.store);

                // Adiconar elemento
                request.add(element);

                resolve();

            })();

        });

    }

    /**
     *  Ler dados
     * 
     * @method read
     * @static 
     */
    read() {

        return new Promise(resolve => {

            (async () => {

                // Abrir connection
                let request = await this.request(this.connection, this.store);

                // Ler todos os dados 
                request.getAll().onsuccess = (event) => {
                    console.log();
                    
                    resolve(event.target.result);
                };

            })();

        });

    }

    /**
     *  Excluir os dados do app
     * 
     * @method  deleteAll
     * @static 
     */
    deleteAll() {

        return new Promise(resolve => {

            (async () => {

                // Abrir connection
                let request = await this.request(this.connection, this.store);

                // Excluir item
                request.openCursor().onsuccess = (event) => {

                    let current = event.target.result;

                    if (current) {

                        let currentValue = current.value;

                        current.delete(currentValue);

                        current.continue();

                    } else {
                        resolve();
                    }

                }

            })();
        });

    }


    /**
     *  Fazer transaction
     * 
     * @method request
     * @static 
     */
    request(connection, store) {
        return new Promise(resolve => {

            // Abrir connection
            let request = connection
                .transaction([store], 'readwrite')
                .objectStore(store);

            resolve(request);

        });

    }

}