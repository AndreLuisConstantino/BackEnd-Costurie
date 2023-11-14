const request = require("supertest");
const app = request("http://localhost:3000");

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOjEsImlhdCI6MTY5NzgyNTc4NiwiZXhwIjoxNzI3ODI1Nzg2fQ.9lyAOMJgWf2HMkrqMjw_53nPTD1wK8gSbsVUqwil4ck'

describe('Teste de integração com a controller de usuário', () => {
    test('Deve selecionar todos os usuários do sistema', async () => {

        const response = await app
            .get('/usuario/select_all')
            .set('x-access-token', TOKEN)

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.usuarios).toBeInstanceOf(Array)
    })

    test('Deve fazer o login com o usuário', async () => {
        const response = await app
            .post('/usuario/login')
            .send({
                "email": "andredograu@gmail.com",
                "senha": "Teste@123"
            })

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
    })



    test('Deve trocar a senha do usuário', async () => {
        const response = await app
            .put('/usuario/atualizar_senha')
            .send({
                "id": 1,
                "senha": "Teste@123"
            })

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.user.senha).toBe("Teste@123")
    })

    test('Deve verificar se o token é valido ou não', async () => {
        const response = await app
            .get('/usuario/token')
            .set('x-access-token', TOKEN)

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.status).toBe(true)
    })

})
