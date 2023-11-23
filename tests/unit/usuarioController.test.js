/*****************************************************************************
 * Objetivo: Arquivo feito para fazer os testes da controller de usuário
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

const {
    registrarUsuario,
    selectUserByLogin,
    selectProfileById,
    getUserByEmail,
    updateUserTokenAndExpires,
    updateUserPassword,
    updateUserProfile,
    selectUserByEmailTagName,
    updateProfileTagLocality,
    updateTag,
    selectAllUsers,
    selectAllUsuariosByTag
} = require('../../controller/usuarioController.js')

// const usuarioModel = require('../../model/usuarioModel.js')

describe(`Testes de Insert Usuário`, () => {
    // test('Inserir usuário || ACERTO - ID_USUÁRIO', async () => {
    //     const res = await registrarUsuario(usuarioParaSerInseridoAcerto)
    //     const usuarioParaSerInseridoAcerto = { "nome_de_usuario": "andreluiskkkjk_", "email": "andreluis081205_@gmail.com", "senha": "andre@123" }
    //     let ultimoUsuario = await usuarioModel.selectLastIDUsuarioModel()
    //     console.log(res);
    //     expect(res.usuario.id_usuario).toBe(ultimoUsuario[0].id_usuario)
    // })

    test('Deve inserir usuário || ERRO NOS VALORES INSERIDOS', async () => {
        const usuarioParaSerInseridoErro = { "nome_de_usuario": "", "email": "andreluis081205@gmail.com", "senha": "andre@123" }
        const res = await registrarUsuario(usuarioParaSerInseridoErro)
        expect(res.status).toBe(res.status = 400)
    })
})

describe('Testes de Login', () => {
    test('Deve selecionar o usuário pelo login', async () => {
        const usuarioLoginAcerto = { "email": "andredograu@mail.com", "senha": "Teste@123" }
        const res = await selectUserByLogin(usuarioLoginAcerto)
        expect(res.status).toBe(res.status = 200)
    })

    test('Deve selecionar o usuário pelo login e fazer a validação do id_login', async () => {
        const usuarioLoginAcerto = { "email": "andredograu@mail.com", "senha": "Teste@123" }
        const res = await selectUserByLogin(usuarioLoginAcerto)
        const usuario = await selectProfileById(res.login.id)
        // console.log(usuario.usuario.id_usuario);
        expect(res.login.id).toBe(usuario.usuario.id_usuario)
    })

    test('Deve dar erro nos valores do selecionar usuário pelo login', async () => {
        const usuarioLoginErro = { "email": "", "senha": "Teste@123" }

        const res = await selectUserByLogin(usuarioLoginErro)
        expect(res.status).toBe(400)
    })
})

describe('Testes de Select by Email', () => {
    test('Deve selecionar Usuário pelo email', async () => {
        let email = "andreluis081205@gmail.com"
        let res = await getUserByEmail(email)

        expect(res.status).toBe(400)
    })

    test('Deve dar erro na seleção de usuário por email', async () => {
        let emailNaoEncontrado = { "email": "andreluis08120508121313283@gmail.com" }

        let res = await getUserByEmail(emailNaoEncontrado)
        expect(res.status).toBe(404)
    })

})

describe('Fazer o update do token e do tempo de expiração', () => {
    test('Deve atualizar o token de troca de senha e tempo de expiração', async () => {
        let id = 1
        let token = Math.floor(Math.random() * 1000000)
        const now = new Date()
        now.setHours(now.getHours() + 1)

        const dataFormatada = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

        let res = await updateUserTokenAndExpires(id, token, dataFormatada)

        expect(res.atualizado).toBe(true)
    })
})

describe('Atualização de senha', () => {
    test('Deve fazer a atualização de senha', async () => {
        let body = { id: 2, senha: 'Luiz@123' }

        let res = await updateUserPassword(body)

        expect(res.status).toBe(200)
    })

    test('Deve dar erro nos campos ao tentar atualizar a senha', async () => {
        let body = { id: 0, senha: 'Luiz@123' }

        let res = await updateUserPassword(body)

        expect(res.status).toBe(400)
    })
})

describe('Atualizar o perfil de usuário', () => {
    test('Deve atualizar o perfil do usuário', async () => {
        let body = {
            id: 10,
            nome: 'André Luiz Constantino',
            descricao: 'Sou o André',
            foto: 'Foto do andré'
        }

        let res = await updateUserProfile(body)

        expect(res.status).toBe(200)
    })

    test('Deve dar erro nos campos ao tentar atualizar o usuário', async () => {
        let body = {
            id: 0,
            nome: 'André Luiz Constantino',
            descricao: 'Sou o André',
            foto: 'Foto do andré'
        }

        let res = await updateUserProfile(body)

        expect(res.status).toBe(400)
    })
})

describe('Selecionar um usuário pela tag de identificação', () => {
    test('Deve selecionar um usuário pela tag identificadora', async () => {
        let body = {
            nome_de_usuario: 'MarceloTeste322',
            email: 'andreluis081205@gmail.com',
            senha: 'andre'
        }

        let res = await selectUserByEmailTagName(body)

        expect(res.message).toBe('Usuário já existe em nosso sistema')
    })

    test('Deve dar erro nos campos ao selecionar o usuário', async () => {
        let body = {
            nome_de_usuario: '',
            email: 'andreluis081205@gmail.com',
            senha: 'andre'
        }

        let res = await selectUserByEmailTagName(body)

        expect(res.message).toBe('Campos obrigatórios não foram preenchidos.')
    })
})

describe('Selecionar um perfil pelo id', () => {
    test('Deve selecionar um perfil pelo id', async () => {
        let id = 2

        let res = await selectProfileById(id)

        expect(res.status).toBe(200)
    })

    test('Deve selecionar um perfil pelo id e verificar o id_usuario', async () => {
        let id = 2

        let res = await selectProfileById(id)

        expect(res.usuario.id_usuario).toBe(id)
    })

    test('Deve dar erro no id ao tentar selecionar um usuário pelo id', async () => {
        let id = 0

        let res = await selectProfileById(id)

        expect(res.status).toBe(400)
    })
})

describe('Atualização do perfil de usuário', () => {
    test('Deve atualizar o perfil do usuário', async () => {
        let body = {
            "id_usuario": 10,
            "id_localizacao": 9,
            "bairro": "Novo Osasco",
            "cidade": "Osasco",
            "estado": "São Paulo",
            "nome": "Marcelo Gabriel2",
            "descricao": "Descrição Teste2",
            "foto": "https://firebasestorage.googleapis.com/v0/b/costurie-images.appspot.com/o/img%2FLost%20by%20Rico%20De%20Zoysa.jpeg?alt=media&token=4fd1ba6b-bf4c-4cb5-996c-86e56ab22eef",
            "nome_de_usuario": "MarceloTeste322",
            "tags": [
                {
                    "id_tag": 2
                },
                {
                    "id_tag": 3
                }
            ]
        }

        let res = await updateProfileTagLocality(body)

        // console.log(res);

        expect(res.status).toBe(200)
    })

    test('Deve atualizar o perfil do usuárioe verificar o id_usuário', async () => {
        let body = {
            "id_usuario": 10,
            "id_localizacao": 9,
            "bairro": "Novo Osasco",
            "cidade": "Osasco",
            "estado": "São Paulo",
            "nome": "Marcelo Gabriel2",
            "descricao": "Descrição Teste2",
            "foto": "https://firebasestorage.googleapis.com/v0/b/costurie-images.appspot.com/o/img%2FLost%20by%20Rico%20De%20Zoysa.jpeg?alt=media&token=4fd1ba6b-bf4c-4cb5-996c-86e56ab22eef",
            "nome_de_usuario": "MarceloTeste322",
            "tags": [
                {
                    "id_tag": 2
                },
                {
                    "id_tag": 3
                }
            ]
        }

        let res = await updateProfileTagLocality(body)

        // console.log(res);

        expect(res.usuario_atualizado.usuario.id_usuario).toBe(10)
    })
})

describe('Atualizações de tags', () => {
    test('Deve atualizar as tags do usuário', async () => {
        let body = {
            "id_usuario": 10,
            "id_localizacao": 9,
            "bairro": "Novo Osasco",
            "cidade": "Osasco",
            "estado": "São Paulo",
            "nome": "Marcelo Gabriel2",
            "descricao": "Descrição Teste2",
            "foto": "https://firebasestorage.googleapis.com/v0/b/costurie-images.appspot.com/o/img%2FLost%20by%20Rico%20De%20Zoysa.jpeg?alt=media&token=4fd1ba6b-bf4c-4cb5-996c-86e56ab22eef",
            "nome_de_usuario": "MarceloTeste322",
            "tags": [
                {
                    "id_tag": 2
                },
                {
                    "id_tag": 3
                }
            ]
        }

        let res = await updateTag(body)

        // console.log(res);

        expect(res.usuario.id_usuario).toBe(body.id_usuario)

    })

    test('Deve atualizar as tags de usuário e verificar as tags', async () => {
        let body = {
            "id_usuario": 10,
            "id_localizacao": 9,
            "bairro": "Novo Osasco",
            "cidade": "Osasco",
            "estado": "São Paulo",
            "nome": "Marcelo Gabriel2",
            "descricao": "Descrição Teste2",
            "foto": "https://firebasestorage.googleapis.com/v0/b/costurie-images.appspot.com/o/img%2FLost%20by%20Rico%20De%20Zoysa.jpeg?alt=media&token=4fd1ba6b-bf4c-4cb5-996c-86e56ab22eef",
            "nome_de_usuario": "MarceloTeste322",
            "tags": [
                {
                    "id_tag": 2
                },
                {
                    "id_tag": 3
                }
            ]
        }

        let res = await updateTag(body)

        expect(res.tags_atualizadas[0].id_tag).toBe(body.tags[0].id_tag)
    })
})

describe('Selecionar todos os usuários', () => {
    test('Deve selecionar todos os usuários', async () => {
        let res = await selectAllUsers()

        expect(res.status).toBe(200)
    })
})

describe('Selecionar todos os usuários pelas tags', () => {
    test('Deve selecionar usuários pela tag', async () => {
        let body = {
            id_tag: 2,
            nome_tag: 'Teste'
        }

        let res = await selectAllUsuariosByTag(body)

        expect(res.status).toBe(200)
    })
})
