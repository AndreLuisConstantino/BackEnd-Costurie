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

     test('Deve fazer o login com o usuário',async () => {
        const response = await app
                            .post('/usuario/login')
                            .send({
                                "email": "andredograu@gmail.com",
                                "senha": "123456789"
                            })

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
     })

    //  test('Deve cadastrar um usuário', async () => {
    //     const response = await app
    //                             .post('/usuario/cadastro')
    //                             .send({
    //                                 "nome_de_usuario": "andreluiz",
    //                                 "email": "andreluis08@gmail.com",
    //                                 "senha": "andre"
    //                             })

    //     expect(response.status).toBe(201)
    //     expect(response.body).toBeInstanceOf(Object)
    //  })
     
     
})
