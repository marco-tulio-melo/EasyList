import {$} from '../app/factories/SelectorsFactory';
import {controllerInstancie} from './controller/Controller';

const controller = controllerInstancie();

document.addEventListener("backbutton", controller.backButtonDevice.bind(controller), false);
$('#js-plus-add-list').onclick = controller.buttonCreateList.bind(controller);
$('#js-clear-record').onclick = controller.buttonClearRecord.bind(controller);
$('#js-back-page-list').onclick = controller.buttonBackList.bind(controller);
$('#js-save-list').onclick = controller.buttonSaveList.bind(controller);
$('#js-add-item').onclick = controller.buttonOpenCreateItem.bind(controller);
$('#js-back-page-shopping').onclick = controller.buttonBackShop.bind(controller);
$('#js-add-item-shop').onclick = controller.buttonAddShop.bind(controller);
$('#js-finalize-shop').onclick = controller.buttonFinalizeShop.bind(controller);
$('#js-back-create-item').onclick = controller.buttonBackCreateItem.bind(controller);
$('#js-save-item').onsubmit = controller.buttonSaveItem.bind(controller);
$('#js-add-category').onclick = controller.buttonAddCategory.bind(controller);
$('#js-restore').onclick = controller.buttonRestoreApp.bind(controller);
$('#js-about').onclick = controller.buttonAbout.bind(controller);