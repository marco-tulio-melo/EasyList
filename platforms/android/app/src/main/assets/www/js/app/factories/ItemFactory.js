import {CategoryFactory} from './CategoryFactory';
import {ConnectionFactory} from './ConnectionFactory';
import {FormatCharacter} from '../helpers/FormatCharacter';
import {ItemModel} from '../model/ItemModel';
import {ItemsController} from '../controller/ItemsController';
import {ItemsDao} from '../dao/ItemsDao';

const items = [{name: 'Achocolatado',qtd: 800,measure: 'g',unit: 0,category: 'Alimentos',price: '00,00'},
        {name: 'Açúcar',qtd: 5,measure: 'Kg',unit: 0,category: 'Alimentos',price: '00,00'},
        {name: 'Amido de Milho',qtd: 500,measure: 'g',unit: 0,category: 'Alimentos',price: '00,00'},
        {name: 'Arroz', qtd: 5,measure: 'Kg',unit: 0,category: 'Alimentos',price: '00,00'},
        {name:'Azeite',	qtd:400,	measure: 'ml',	unit:0,	category: 'Alimentos',price:'00,00'},
        {name:'Tempero Pronto',	qtd:100,	measure: 'g',	unit:0,	category: 'Alimentos',price:'00,00'},
        {name:'Oregano',	qtd:100,	measure: 'g',	unit:0,	category: 'Alimentos',price:'00,00'},
        {name:'Vinagre',	qtd:1,	measure: 'L',	unit:0,	category: 'Alimentos',price:'00,00'},
        {name:'Abacaxi',	qtd:1,	measure: 'un',	unit:0,	category: 'Frutas e verduras',price:'00,00'},
        {name:'Limão',	qtd:2,	measure: 'Kg',	unit:0,	category: 'Frutas e verduras',price:'00,00'},
        {name:'Maçã',	qtd:1,	measure: 'Kg',	unit:0,	category: 'Frutas e verduras',price:'00,00'},
        {name:'Mamão',	qtd:1,	measure: 'Kg',	unit:0,	category: 'Frutas e verduras',price:'00,00'},
        {name:'Maracujá',	qtd:500,	measure: 'g',	unit:0,	category: 'Frutas e verduras',price:'00,00'},
        {name:'Melancia',	qtd:1,	measure: 'un',	unit:0,	category: 'Frutas e verduras',price:'00,00'},
        {name:'Melão',	qtd:1,	measure: 'un',	unit:0,	category: 'Frutas e verduras',price:'00,00'},
        {name:'Morango',	qtd:1,	measure: 'un',	unit:0,	category: 'Frutas e verduras',price:'00,00'},
        {name:'Água mineral',	qtd:500,	measure: 'ml',	unit:0,	category: 'Bebidas',price:'00,00'},
        {name:'Cerveja',	qtd:350,	measure: 'ml',	unit:0,	category: 'Bebidas',price:'00,00'},
        {name:'Refrigerante',	qtd:2,	measure: 'L',	unit:0,	category: 'Bebidas',price:'00,00'},
        {name:'Suco',	qtd:500,	measure: 'ml',	unit:0,	category: 'Bebidas',price:'00,00'},
        {name:'Vinho',	qtd:1,	measure: 'L',	unit:0,	category: 'Bebidas',price:'00,00'},
        {name:'Água sanitária',	qtd:2,	measure: 'L',	unit:0,	category: 'Limpeza',price:'00,00'},
        {name:'Álcool',	qtd:1,	measure: 'L',	unit:0,	category: 'Limpeza',price:'00,00'},
        {name:'Amaciante',	qtd:2,	measure: 'L',	unit:0,	category: 'Limpeza',price:'00,00'},
        {name:'Desinfetante',	qtd:2,	measure: 'L',	unit:0,	category: 'Limpeza',price:'00,00'},
        {name:'Lâmpada',	qtd:1,	measure: 'un',	unit:0,	category: 'Outros',price:'00,00'},
        {name:'Lustra móveis',	qtd:1,	measure: 'un',	unit:0,	category: 'Limpeza',price:'00,00'},
        {name:'Palito de dente',	qtd:1,	measure: 'un',	unit:0,	category: 'Limpeza',price:'00,00'},
        {name:'Papel Alumínio',	qtd:1,	measure: 'un',	unit:0,	category: 'Outros',price:'00,00'},
        {name:'Vela',	qtd:1,	measure: 'un',	unit:0,	category: 'Outros',price:'00,00'},
        {name:'Absorvente',	qtd:1,	measure: 'un',	unit:0,	category: 'Higiene pessoal',price:'00,00'},
        {name:'Algodão',	qtd:1,	measure: 'un',	unit:0,	category: 'Higiene pessoal',price:'00,00'},
        {name:'Sabonete',	qtd:1,	measure: 'un',	unit:0,	category: 'Higiene pessoal',price:'00,00'},
        {name:'Shampoo',	qtd:1,	measure: 'un',	unit:0,	category: 'Higiene pessoal',price:'00,00'},
        {name:'Bife',	qtd:1,	measure: 'Kg',	unit:0,	category: 'Carnes',price:'00,00'},
        {name:'Carne de frango',	qtd:1,	measure: 'Kg',	unit:0,	category: 'Carnes',price:'00,00'},
        {name:'Carne Moída',	qtd:1,	measure: 'Kg',	unit:0,	category: 'Carnes',price:'00,00'},
        {name:'Linguiça',	qtd:1,	measure: 'Kg',	unit:0,	category: 'Carnes'}
];

/**
 * @fileoverview Gerenciar as funções relacionadas com a criação dos itens
 * 
 * @class 
 */
export class ItemFactory {

    constructor() {
        throw new Error('Unable to Instantiate ItemFactory')
    }

    /**
     *  Popular o banco de dados com os itens pré-definidos
     * @method init
     * @static
     */
    static init() {

        (async () => {

            // Verificar se a itens no banco de dados
            const result = await ConnectionFactory.getConnection()
                .then((connection) => new ItemsDao(connection)
                    .read());

            if (result.length <= 0) {
                items.forEach((i) => {

                    //Adicionar itens no banco de dados
                    ConnectionFactory.getConnection()
                        .then((connection) => new ItemsDao(connection)
                            .add(i));

                });

            }

        })();

    }

    /**
     *  Adicionar item
     * @method addItems
     * @static
     */
    static addItems(item) {

        ConnectionFactory.getConnection()
            .then((connection) => new ItemsDao(connection)
                .add(item));

    }

    /**
     *  Adicionar item
     * @method editItems
     * @static
     */
    static editItems(item) {

        (async () => {

            //Pegar nome do item a ser editado
            const old = ItemsController.loadEdit();

            // Editar item
            await ConnectionFactory.getConnection()
                .then((connection) => new ItemsDao(connection)
                    .edit(old, item));

        })();

    }

    /**
     *  Criar item
     * @method create
     * @static
     * @param {String} name (Required) Nome do item
     * @param {Number} qtd (Required) Quantidade do item
     * @param {String} measure (Required) Unidade de medida do item
     * @param {Number} unit (Required) Unidade do item
     * @param {String} category (Required) Categoria do item
     * @param {Number} price (Required) Preço do item - 00.00
     */
    static create(name, qtd, measure, unit, category, price) {

        // Validar qtd
        let q = qtd;

        if (q === '') {
            q = 0

        }

        // Instanciar class
        const item = new ItemModel(
            FormatCharacter.capitalize(name, 18),
            q,
            measure,
            unit,
            category,
            price
        );

        const itemSave = {
            name: item.name,
            qtd: item.qtd,
            measure: item.measure,
            unit: item.unit,
            category: item.category,
            price: item.price
        }

        return itemSave;
    }

    /**
     *  Criar item
     * @method mountsItems
     * @static
     * @param {Boolean} isClearUnit (Required) Apagar valores das unidade
     */
    static mountsItems(isClearUnit) {

        return new Promise(resolve => {
            (async () => {

                let categories = null;

                // Zerar todas as unit dos items
                if (isClearUnit) {

                    await ConnectionFactory.getConnection()
                        .then((connection) => new ItemsDao(connection)
                            .clearUnit());

                }

                // Pegar todos os itens para montar as categorias
                const result = await ConnectionFactory.getConnection()
                    .then((connection) => new ItemsDao(connection)
                        .read());

                //Montar estrutura de categorias
                categories = CategoryFactory.mountsCategories(result);

                resolve(categories);


            })();

        });

    }

}