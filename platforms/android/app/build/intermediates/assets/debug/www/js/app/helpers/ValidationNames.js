import {Dialogs} from "./Dialogs";
import {FormatCharacter} from "./FormatCharacter";

/**
 * Validar nomes.
 * 
 * @class
 */

export class ValidationNames {

    constructor() {
        throw new Error('Unable to Instantiate ValidationNames');
    }

    /**
     * Validar nomes das listas,categorias e itens as serão salvos.
     * 
     * @method validation
     * @static
     * @param {Object} results (Required) Resultado do input prompt
     * @param {Array} elements (Required)  Array com elementos a serem comparados
     * @param {String} type (Required) Tipo da validação - list,category e item
     * @param {Function} callback (Required) Callback se a validação for verdadeira
     */

    static validation(results, elements, type, callback) {

        let name = null,
            category = null,
            nameLength = null,
            validate = false,
            validateItem = false,
            attr = false;

        // Validar o nome do item
        if (type === 'item') {
            name = FormatCharacter.capitalize(results.name, 16);
            category = results.category;
            nameLength = name.length;

            elements.filter((r) => {
                if (r.name === name && r.category === category) {

                    return attr = true;
                }

            });

            // Validação
            if (nameLength > 3 && !attr) {
                validate = 1;

            } else if (nameLength > 3 && attr) {
                validate = 5;

            } else if (nameLength > 0 && nameLength <= 3) {
                validate = 6;

            }

            validateItem = true;
        }

        // Validar o nome da lista
        if (type === 'list' || type === 'category') {

            name = FormatCharacter.capitalize(results.input1, 16);
            nameLength = name.length;

            elements.filter((r) => {
                if (type === 'list') {
                    if (r.name === name) {
                        return attr = true;

                    }
                } else if (type === 'category') {
                    if (r === name) {
                        return attr = true;

                    }
                }

            });

            // Validação
            if (nameLength > 3 && !attr) {
                validate = 1;

            } else if (nameLength > 3 && attr) {
                validate = 2;

            } else if (nameLength > 0 && nameLength <= 3) {
                validate = 3;

            } else if (name === '') {
                validate = 4;

            }
        }

        if (results.buttonIndex === 1 || validateItem) {

            // Validar caracteres
            switch (validate) {
                case 1:
                    callback(name);
                    break;
                case 2:
                    Dialogs.prompt('O nome já existe, insira um novo.',
                        (results) => {
                            this.validation(results, elements, type, callback);
                        }, 'Salvar:')
                    break;
                case 3:
                    Dialogs.prompt('O nome deve conter mais de 3 caracteres.',
                        (results) => {
                            this.validation(results, elements, type, callback);
                        }, 'Salvar:')
                    break;
                case 4:
                    Dialogs.prompt('O nome não pode estar em branco.',
                        (results) => {
                            this.validation(results, elements, type, callback);
                        }, 'Salvar:')
                    break;
                case 5:
                    Dialogs.alert('O nome já existe, insira um novo.', () => {}, 'Salvar')
                    break;
                case 6:
                    Dialogs.alert('O nome deve conter mais de 3 caracteres.', () => {}, 'Salvar')
                    break;

            }
        }

    }

}