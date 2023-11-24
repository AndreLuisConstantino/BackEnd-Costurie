/*****************************************************************************
 * Objetivo: Arquivo criado com a intencão de inplementar o JWT no nosso projeto
 * Data: 05/09/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//import da biblioteca
const jwt = require('jsonwebtoken')

const {SECRET, EXPIRE} = require('../module/secret.js')

//Retorna um token
const createJWT = async (payload) => {
    //Gerqa o token
    const token = jwt.sign({userID: payload}, SECRET, {expiresIn: EXPIRE})

    return token
}

//Recebe o token para a validacão
const validateJWT = async (token) => {
    let status
    //Valida a autenticidade do token
    jwt.verify(token, SECRET, async (err, decode) => {
        if(err) {
            status = false
        } else {
            status = true
        }
    })
    return status
}

module.exports = {
    createJWT,
    validateJWT
}