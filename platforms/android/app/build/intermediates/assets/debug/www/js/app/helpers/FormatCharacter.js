/**
 * Formartar string
 * 
 * @class
 */
export class FormatCharacter {

    constructor() {
        throw new Error('Unable to Instantiate FormatCharacter')
    }

    /**
     * Formatar string com primeira letra maiúscula e limitar caracteres.
     * 
     * @method capitalize
     * @static
     * @param {String} string (Required) String a ser formatada.
     * @param {Number} len (Required) Número limite para o tamanho da string
     */
    static capitalize(string, len) {

        if (string === undefined || string === null) {
            console.log('String esta vazia.');

        } else {
            const name = string.substring(0, len),
                first = name.substring(0, 1).toUpperCase(),
                last = name.substring(1).toLowerCase();

            return first + last;

        }

    }

    /**
     *  Limitar a quantidade de caracteres inseridos.
     * 
     * @method limit
     * @static 
     */
    static limit(number, event) {

        const charCode = event.charCode ? event.charCode : event.keyCode;

        if (charCode != 8 && charCode != 9) {
            const max = number;
            let num = event.target;

            if (num.value <= 0) {
                num.value = '';

            }

            if ((charCode < 48 || charCode > 57) || (num.value.length >= max)) {
                num.value = num.value.substr(0, number);
                return false;

            }
        }
    }


}