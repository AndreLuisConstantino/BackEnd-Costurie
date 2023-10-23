/*****************************************************************************
 * Objetivo: Arquivo feito para fazer os testes das rotas de usuário
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const request = require('supertest')
const app = request('http://localhost:3000')

describe('Testes de integração do módulo de usuário', () => {
    test('Deve inserir um novo usuário', async () => {
        const novoUsuario = {
            "nome_de_usuario": "andreluiskkk",
            "email": "andreluis081205008012@gmail.com",
            "senha": "andre"
        }

        const response = await app.post('/usuario/cadastro').send(novoUsuario)

        expect(response.status).toBe(201);
        expect(response.body.usuario.email).toBe(novoUsuario.email)        
    })
})
