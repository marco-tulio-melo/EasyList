import {$} from '../factories/SelectorsFactory';
import {Support} from '../utils/Support';
import {Transitions} from '../utils/Transitions';

const menus = {
    home: $('#js-home'),
    record: $('#js-record'),
    setting: $('#js-setting'),
    homePage: $('#js-home-page'),
    recordPage: $('#js-record-page'),
    settingPage: $('#js-setting-page'),
    homeBox: $('.page-menu-home'),
    recordBox: $('.page-menu-record'),
    settingBox: $('.page-menu-setting'),
    move: $('#js-menu-move'),
    headerMenu: $('#js-headerMenu'),
    headerMenuText: $('#js-headerMenuText'),
}

const pages = $('#js-pages-menu');

let isTransition = true;
/**
 * @fileoverview Gerenciar todas as mudaças de estado do menu
 * 
 * @class
 */
export class Menu {

    constructor() {
        throw new Error('Unable to Instantiate Menu');
    }

    /**
     * Animação do menu principal
     * 
     * @method selectMenuListiner
     * @static
     **/
    static selectMenuListiner() {

        const m = menus,
            elements = [m.home, m.record, m.setting];

        this._changePages(m, m.home);

        // Inserir escutador de eventos nas opções de menu
        elements.forEach((e) => {

            e.addEventListener('touchstart', () => {
                this._changePages(m, e);

            }, false);

        });

    }

    /**
     * Ir para pagina do menu
     * 
     * @method changePages
     * @static
     **/
    static _changePages(menu, targetMenu) {

        let result = null;

        //Aplicar vibração
        Support.supportVibration();

        switch (targetMenu) {

            case menu.home:
                (async () => {

                    result = await this._transitionsPages(0, menu.homeBox, menu.homePage,
                        [menu.recordPage, menu.settingPage],
                        [menu.recordBox, menu.settingBox]);

                    if (result) {

                        Transitions.add('nav__menu--active', menu.home);
                        Transitions.remove('nav__menu--active', menu.record);
                        Transitions.remove('nav__menu--active', menu.setting);
                    }

                })();
                break;

            case menu.record:
                (async () => {
                    result = await this._transitionsPages(100, menu.recordBox, menu.recordPage,
                        [menu.homePage, menu.settingPage],
                        [menu.homeBox, menu.settingBox]);

                    if (result) {

                        Transitions.add('nav__menu--active', menu.record);
                        Transitions.remove('nav__menu--active', menu.home);
                        Transitions.remove('nav__menu--active', menu.setting);
                    }

                })();
                break;

            case menu.setting:
                (async () => {

                    result = await this._transitionsPages(200, menu.settingBox, menu.settingPage,
                        [menu.recordPage, menu.homePage],
                        [menu.recordBox, menu.homeBox]);

                    if (result) {

                        Transitions.add('nav__menu--active', menu.setting);
                        Transitions.remove('nav__menu--active', menu.home);
                        Transitions.remove('nav__menu--active', menu.record);
                    }

                })();
                break;

            default:
                break;
        }

    }

    /**
     * Transição de paginas do menu
     * 
     * @method transitionsPages
     * @static
     * @param {Number} left (Required) Número do margim left.
     * @param {Object} boxTarget (Required) Box interno da paginas as ser mostrada.
     * @param {Object} pageTarget (Required) Página a ser mostrada.
     * @param {Array} pagesNone (Required) Array com páginas a serem ocultadas.
     * @param {Array} boxNone (Required) Array com box a serem ocultados.
     */
    static _transitionsPages(left, boxTarget, pageTarget, pagesNone, boxNone) {

        return new Promise(resolve => {

            if (isTransition) {
                isTransition = false;
                pages.style.marginLeft = '-' + left + 'vw';
                Transitions.remove('none', boxTarget);
                Transitions.fade('in', pageTarget);
                pagesNone.forEach((f) => {
                    Transitions.fade('out', f);

                });

                setTimeout(() => {
                    boxNone.forEach((e) => {
                        Transitions.add('none', e);

                    });

                    isTransition = true;

                    resolve(isTransition);

                }, 300);
            } else {

                isTransition = false;

                resolve(isTransition);

            }

        });

    }

}