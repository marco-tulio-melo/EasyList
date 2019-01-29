/**
 * Formartar data
 * 
 * @class
 */
export class FormatDate {

    constructor() {
        throw new Error('Unable to Instantiate FormatDate');
    }

    /**
     * Instanciar data atual e retornar formarto xx/xx/xxxx - 00:00
     * 
     * @method date
     * @static
     * @returns {String}
     **/
    static date() {
        const date = new Date();

        let d = [
            date.getDate(),
            date.getMonth() + 1,
            date.getFullYear(),
            date.getHours(),
            date.getMinutes()
        ];

        d.forEach((e, index) => {
            if (e <= 9) {
                d.splice(index, 1, '0' + e)

            }

        });

        return `${d[0]}/${d[1]}/${d[2]} - ${d[3]}:${d[4]}`;
    }


    /**
     * Instanciar data atual e retornar um objeto
     * 
     * @method dateSeparate
     * @static
     * @returns {Object}
     **/
    static dateSeparate() {
        const date = new Date();

        let d = {
            day: date.getDate(),
            month: date.getMonth() + 1,
            hours: date.getHours(),
            minutes: date.getMinutes()
        };

        let month = null,
            day = null,
            minutes = null,
            hours = null;

        switch (d.month) {
            case 1:
                month = 'janeiro';
                break;
            case 2:
                month = 'fevereiro';
                break;
            case 3:
                month = 'março';
                break;
            case 4:
                month = 'abril';
                break;
            case 5:
                month = 'maio';
                break;
            case 6:
                month = 'junho';
                break;
            case 7:
                month = 'julho';
                break;
            case 8:
                month = 'agosto';
                break;
            case 9:
                month = 'setembro';
                break;
            case 10:
                month = 'outubro';
                break;
            case 11:
                month = 'novembro';
                break;
            case 12:
                month = 'dezembro';
                break;
        }


        // Acrescentar 0 ao dia
        if (d.day < 10) {
            day = '0' + d.day;

        } else {
            day = d.day;

        }

        // Acrescentar 0 ao hora
        if (d.hours < 10) {
            hours = '0' + d.hours;

        } else {
            hours = d.hours;

        }

        // Acrescentar 0 ao minuto
        if (d.minutes < 10) {
            minutes = '0' + d.minutes;

        } else {
            minutes = d.minutes;

        }

        const dateObject = {
            day: day,
            month: month,
            hours: hours + ':' + minutes
        }

        return dateObject
    }

}