/*****************************************************************************
 * Objetivo: Arquivo criado com a intencão de gerenciar os dados do 
 * Data: 05/09/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

const SECRET = 'teste123'
const EXPIRE = 30000000

const path = require('path')

const smtp = nodemailer.createTransport({
    service: 'Gmail',
    port: 465,
    secure: false,
    logger: true,
    debug: true,
    secureConnection: false,
    auth: {
        user: 'tcccosturie@gmail.com',
        pass: 'xerudkcganjxmrip'
    },
    tls: {
        rejectUnauthorized: false
    }
})

smtp.use('compile', hbs({
    viewEngine: {
        extName: ".hbs",
        partialsDir: path.resolve('./views'),
        defaultLayout: false
    },
    viewPath: path.resolve('./views'),
    extName: ".hbs"
}))

const verifySqlInjection = (dadosBody) => {
    Object.keys(dadosBody).forEach((chave) => {
        if (typeof dadosBody[chave] === 'string') {
            if (dadosBody[chave].includes("'")) {
                dadosBody[chave] = dadosBody[chave].replace("'", "");
            }
        }
    });
    return dadosBody;
};

module.exports = {
    SECRET,
    EXPIRE,
    smtp, 
    verifySqlInjection
}