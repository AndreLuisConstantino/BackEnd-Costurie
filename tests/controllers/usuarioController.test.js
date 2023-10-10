/*****************************************************************************
 * Objetivo: Arquivo feito para fazer os testes da controller de usuário
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const {insertUsuario, selectUserByLogin} = require('../../controller/usuarioController.js')

const usuarioModel = require('../../model/usuarioModel.js')

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

const usuarioLoginAcerto = {
    "email": "andredograu@gmail.com",
    "senha": "123456789"
}

const usuarioLoginErro = {
    "email": "",
    "senha": "123456789"
}

describe(`Testes de Insert`, () => {
    test('Inserir usuário || ACERTO - STATUS CODE', async () => {
         const res = await insertUsuario(usuarioParaSerInseridoAcerto)
         console.log(res);
         expect(res.status).toBe(res.status = 201)
    })
    test('Inserir usuário || ACERTO - ID_USUÁRIO', async () => {
        const res = await insertUsuario(usuarioParaSerInseridoAcerto)
        let ultimoUsuario = await usuarioModel.selectLastIDUsuarioModel()
        // console.log(ultimoUsuario);
        expect(res.aluno.id_usuario).toBe(ultimoUsuario[0].id_usuario)
   })
    test('Inserir usuário || ERRO NOS VALORES INSERIDOS', async () => {
         const res = await insertUsuario(usuarioParaSerInseridoErro)
         expect(res.status).toBe(res.status = 400)
    })
})

describe('Testes de Login', () => { 
    test('Selecionar o usuário pelo login || ACERTO', async () => {
         const res = await selectUserByLogin(usuarioLoginAcerto)
         expect(res.status).toBe(res.status = 200)
    })

    test('Selecionar o usuário pelo login || ERRO NOS VALORES INSERIDOS', async () => {
        const res = await selectUserByLogin(usuarioLoginErro)
        expect(res.status).toBe(res.status = 400)
   })
 })