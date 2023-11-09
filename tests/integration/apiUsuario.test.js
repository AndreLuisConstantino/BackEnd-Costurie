const request = require("supertest");
const app = request("http://localhost:3000");

describe('Teste de integração com a controller de usuário', () => {
    test('Deve selecionar todos os usuários do sistema', async () => { 
        const response = await app.get('/usuario/select_all')
     })
})
