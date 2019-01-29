/**
 * Converter números
 * 
 * @class
 */
export class FormatCoin {

    constructor() {
        throw new Error('Unable to Instantiate FormatCoin');
    }

    /**
     * Converter números para valor monetario.
     * 
     * @method coin
     * @static
     * @param {Object} input (Required) Input com o valor a ser convertido
     * @param {Number} inputValue (Required) Valor do input
     * @param {String} thousandth (Required) Separador de milesimal
     * @param {String} decimal (Required) Separador de decimal
     * @param {Object} e (Required) Event
     */
    static coin(input, inputValue, thousandth, decimal, e) {
        e.preventDefault();

        let key = '',
            j = 0,
            i = j,
            len2 = 0,
            len = len2,
            strCheck = '0123456789',
            aux2 = '',
            aux = aux2,
            whichCode = (window.Event) ? e.which : e.keyCode;

        if (inputValue === input.value) {
            input.value = '';
        }

        if (whichCode === 13 || whichCode === 8) return true;

        key = String.fromCharCode(whichCode); // Valor para o código da Chave  

        if (strCheck.indexOf(key) === -1) return false; // Chave inválida

        len = input.value.length;
        for (i = 0; i < len; i++)
            if ((input.value.charAt(i) != '0') && (input.value.charAt(i) != decimal)) break;
        aux = '';
        for (; i < len; i++)
            if (strCheck.indexOf(input.value.charAt(i)) != -1) aux += input.value.charAt(i);
        aux += key;

        len = aux.length;

        if (len === 0) {
            input.value = '';
        } else if (len === 1) {
            input.value = '0' + decimal + '0' + aux;

        } else if (len === 2) {
            input.value = '0' + decimal + aux;

        } else if (len > 2 && len < 6) {
            aux2 = '';
            for (j = 0, i = len - 3; i >= 0; i--) {
                if (j == 3) {
                    aux2 += thousandth;
                    j = 0;
                }
                aux2 += aux.charAt(i);
                j++;
            }
            input.value = '';
            len2 = aux2.length;
            for (i = len2 - 1; i >= 0; i--)
                input.value += aux2.charAt(i);
            input.value += decimal + aux.substr(len - 2, len);
            return false;
        }
    }

    /**
     * Converter separador ponto para virgula.
     * 
     * @method price
     * @static
     * @param {String} string (Required) String com valor númerico 
     */
    static price(string) {

        let a = string.replace(',', '.'),
            b = parseFloat(a);

        return b;

    }

}