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

    test('Deve atualizar o perfil do usuário', async () => {
        const response = await app
            .put('/usuario/personalizar_perfil')
            .send({
                "id": 1,
                "nome": "andrezindograu",
                "foto": "https://i.pinimg.com/originals/18/13/3c/18133ce8bad079045a32260bc70d6efe.jpg",
                "descricao": "dando grau na zona sul"
            })

        // console.log(response);

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.usuario[0].nome).toBe("andrezindograu")
    })

    test('Deve pegar os dados do usuário pelo id', async () => {
        const id = 1

        const response = await app
            .get(`/usuario/meu_perfil/${id}`)
            .set('x-access-token', TOKEN)

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body.usuario.nome_de_usuario).toBe('andrezito')
    })

    test('Deve inserir um nome, foto e descrição', async () => {
      const response = await app
        .put('/usuario/personalizar_perfil')
        .send(
            {
                "id": 1,
                "nome": "andrezindograu",
                "foto": "https://i.pinimg.com/originals/18/13/3c/18133ce8bad079045a32260bc70d6efe.jpg",
                "descricao": "dando grau na zona sul"
            }
        )
    })
    

    test('Deve selecionar todos os usuários pela tag', async () => {

        const response = await app
            .post('/usuario/select_by_tag')
            .set('x-access-token', TOKEN)
            .send({
                "id_tag": 1,
                "nome_tag": "Casual"
            })

    
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body.usuarios).toBeInstanceOf(Array)
    })




})
