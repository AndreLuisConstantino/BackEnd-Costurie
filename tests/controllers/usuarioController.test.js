/*****************************************************************************
 * Objetivo: Arquivo feito para fazer os testes da controller de usuário
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const {insertUsuario} = require('../../controller/usuarioController')

const usuarioParaSerInseridoAcerto = {
    "nome_de_usuario": "andreluiskkkjk",
    "email": "andreluis081205@gmail.com",
    "senha": "andre@123"
}
const usuarioParaSerInseridoErro = {
    "nome_de_usuario": "",
    "email": "andreluis081205@gmail.com",
    "senha": "andre@123"
}

describe(`Testes na Controller de Usuário`, () => {
    test('Inserir usuário || ACERTO', async () => {
         const res = await insertUsuario(usuarioParaSerInseridoAcerto)
         expect(res.status).toBe(res.status = 201)
    })
    test('Inserir usuário || ERRO', async () => {
         const res = await insertUsuario(usuarioParaSerInseridoErro)
         expect(res.status).toBe(res.status = 400)
    })
})