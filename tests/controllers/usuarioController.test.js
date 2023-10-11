/*****************************************************************************
 * Objetivo: Arquivo feito para fazer os testes da controller de usuário
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const { registrarUsuario, selectUserByLogin, selectProfileById , getUserByEmail} = require('../../controller/usuarioController.js')

const usuarioModel = require('../../model/usuarioModel.js')

//Insert
const usuarioParaSerInseridoAcerto = {
    "nome_de_usuario": "andreluiskkkjk_",
    "email": "andreluis081205_@gmail.com",
    "senha": "andre@123"
}

const usuarioParaSerInseridoErro = {
    "nome_de_usuario": "",
    "email": "andreluis081205@gmail.com",
    "senha": "andre@123"
}

//Login
const usuarioLoginAcerto = {
    "email": "andredograu@gmail.com",
    "senha": "123456789"
}

const usuarioLoginErro = {
    "email": "",
    "senha": "123456789"
}

//getEmail
const email = {
    "email": "andreluis081205@gmail.com"
}

const emailNaoEncontrado = {
    "email": "testezika@123gmail.com"
}

describe(`Testes de Insert Usuário`, () => {
    // test('Inserir usuário || ACERTO - ID_USUÁRIO', async () => {
    //     const res = await registrarUsuario(usuarioParaSerInseridoAcerto)
    //     let ultimoUsuario = await usuarioModel.selectLastIDUsuarioModel()
    //     console.log(res);
    //     expect(res.usuario.id_usuario).toBe(ultimoUsuario[0].id_usuario)
    // })
    test('Inserir usuário || ERRO NOS VALORES INSERIDOS', async () => {
        const res = await registrarUsuario(usuarioParaSerInseridoErro)
        expect(res.status).toBe(res.status = 400)
    })
})

describe('Testes de Login', () => {
    test('Selecionar o usuário pelo login || ACERTO', async () => {
        const res = await selectUserByLogin(usuarioLoginAcerto)
        expect(res.status).toBe(res.status = 200)
    })
    test('Selecionar o usuário pelo login || ACERTO - ID_LOGIN', async () => {
        const res = await selectUserByLogin(usuarioLoginAcerto)
        const usuario = await selectProfileById(res.login.id)
        // console.log(usuario.usuario.id_usuario);
        expect(res.login.id).toBe(usuario.usuario.id_usuario)
    })
    test('Selecionar o usuário pelo login || ERRO NOS VALORES INSERIDOS', async () => {
        const res = await selectUserByLogin(usuarioLoginErro)
        expect(res.status).toBe(res.status = 400)
    })
})

describe('Testes de Select by Email', () => {
  test('Selecionar Usuário pelo email || ACERTO', async () => {
    let res = await getUserByEmail(email)
    expect(res.status).toBe(res.status = 400)
  })
  test('Selecionar Usuário pelo email || ERRO ', async () => {
    let res = await getUserByEmail(emailNaoEncontrado)
    expect(res.status).toBe(res.status = 404)
  })
  
})
