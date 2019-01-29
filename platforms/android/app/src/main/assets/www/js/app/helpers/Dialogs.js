/**
 * @fileoverview Gerenciar display de dialogo com o usuário.
 * 
 * @class
 */
export class Dialogs {

    constructor() {
        throw new Error('Unable to Instantiate Dialogs');
    }

    /**
     * Display de prompt
     * 
     * @method prompt
     * @static
     * @param {String} message (Required) Mensagem principal a ser mostrada para o usuário.
     * @param {Function} callback (Required) Callback passado após o retorno do prompt.
     * @param {String} title (Required) Titulo do display.
     * @returns {(Number|String)} Index do botão pressionado e texto digitado no prompt.
     */
    static prompt(message, callback, title) {

        navigator.notification.prompt(
            message,
            callback,
            title,
            ['Adicionar', 'Cancelar'],
            ''
        );

    }

    /**
     * Display de alerta
     * 
     * @method alert
     * @static
     * @param {String} message (Required) Mensagem principal a ser mostrada para o usuário.
     * @param {Function} callback (Required) Callback passado após o alerta.
     * @param {String} title (Required) Titulo do display.
     * @returns {Number} Index do botão pressionado. 
     */
    static alert(message, callback, title) {

        navigator.notification.alert(
            message,
            callback,
            title,
            'Ok'

        );

    }

    /**
     * Display de confirmação
     * 
     *@method confirm
     * @static
     * @param {String} message  (Required) Mensagem principal a ser mostrada para o usuário.
     * @param {Function} callback (Required) Callback passado após a confirmação .
     * @param {String} title (Required) Titulo do display.
     * @param  {String} buttons1 (Required) Valor do botão 1.
     * @param  {String} buttons2 (Required) Valor do botão 2.
     * @returns {Number} Index do botão pressionado. 
     */
    static confirm(message, callback, title, buttons1, buttons2) {

        navigator.notification.confirm(
            message,
            callback,
            title,
            [buttons1, buttons2]

        );

    }

}