/*****************************************************************************
 * Objetivo: Controller feita para gerenciamento de dados que chegam do banco de dados
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require("../controller/modulo/config.js");

//Import da secret.js
const secret = require('../module/secret.js')

//Import JWT
const jwt = require("../middleware/middlewareJWT.js")

/* Imports Models */
const usuarioModel = require("../model/usuarioModel.js");
const tagModel = require("../model/tagModel.js");
const tagUsuarioModel = require("../model/tagUsuarioModel.js");
const localizacaoModel = require("../model/localizacaoModel.js")
// const localizacaoModel = require("../model/localizacaoModel.js");
const publicacaoModel = require("../model/publicacaoModel.js");
const anexosModel = require("../model/anexosModel.js");

const selectUserByLogin = async (dadosLogin) => {
  if (
    dadosLogin.email == "" ||
    dadosLogin.email == undefined ||
    dadosLogin.email.length > 255 ||
    dadosLogin.senha == "" ||
    dadosLogin.senha == undefined ||
    dadosLogin.senha.lenght > 515
  ) {
    return message.ERROR_REQUIRED_FIELDS;
  } else {

    let login = await usuarioModel.selectUserByLoginModel(dadosLogin);

    if (login) {
      //Gera o token pelo jwt
      let tokenUser = await jwt.createJWT(login[0].id);

      let dadosLoginJson = {};
      dadosLoginJson.login = login[0];
      dadosLoginJson.status = 200;
      dadosLoginJson.token = tokenUser;
      return dadosLoginJson;
    } else {
      return message.ERROR_USER_NOT_FOUND;
    }
  }
};

const getUserByEmail = async (email) => {
  let resultEmail = await usuarioModel.selectUserByEmailModel(email);
  if (resultEmail) {
    let dadosEmailJson = {};
    dadosEmailJson.email = resultEmail;
    dadosEmailJson.status = message.ERROR_EMAIL_ALREADY_EXISTS.status
    dadosEmailJson.message = message.ERROR_EMAIL_ALREADY_EXISTS.message
    return dadosEmailJson;
  } else {
    return message.ERROR_EMAIL_NOT_FOUND;
  }
};

const updateUserTokenAndExpires = async (id, token, tempo_expiracao) => {

  let userResponseId = await usuarioModel.selectUserByIdModel(id);

  if (userResponseId) {
    let userUpdatePassword = await usuarioModel.updateUserTokenAndExpiresModel(id, token, tempo_expiracao);

    if (userUpdatePassword) {
      let dadosUsuarioJson = {};
      dadosUsuarioJson.usuario = userUpdatePassword;
      dadosUsuarioJson.atualizado = true;

      return dadosUsuarioJson;
    } else {
      return message.ERROR_UNABLE_TO_UPDATE
    }
  } else {
    return message.ERROR_EMAIL_NOT_FOUND;
  }
};

const selectTokenById = async (dadosBody) => {
  if (dadosBody.id == '' || dadosBody.id == undefined || isNaN(dadosBody.id) ||
    dadosBody.token == '' || dadosBody.token == undefined || isNaN(dadosBody.token) || dadosBody.token.length > 10) {
    return message.ERROR_MISTAKE_IN_THE_FILDS
  } else {

    let resultUser = await usuarioModel.selectUserByIdModel(dadosBody.id)

    if (resultUser) {

      let resultToken = await usuarioModel.selectTokenAndIdModel(dadosBody)

      let dataToken = resultToken[0].tempo_expiracao

      let dataArray = String(dataToken).split('T')

      // console.log(dataArray[2]);

      let now = new Date()

      let dataFormatada = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

      if (dataArray[2] < dataFormatada) {

        let dadosTokenJson = {}
        dadosTokenJson.usuario = resultToken[0]
        dadosTokenJson.message = 'O Token está válido e apto para a troca de senha'
        dadosTokenJson.status = 200

        return dadosTokenJson
      } else {
        return message.ERROR_INVALID_TOKEN
      }
    } else {
      return message.ERROR_USER_NOT_FOUND
    }
  }
}

const updateUserPassword = async (dadosBody) => {

  if (dadosBody.senha == '' || dadosBody.senha == undefined || dadosBody.senha.length > 515 || !isNaN(dadosBody.senha)) {
    return message.ERROR_MISTAKE_IN_THE_FILDS
  } else if (dadosBody.id == '' || dadosBody.id == undefined || isNaN(dadosBody.id)) {
    return message.ERROR_INVALID_ID
  } else {

    let dadosUpdateSenha = await usuarioModel.updateUserPasswordModel(dadosBody)

    if (dadosUpdateSenha) {

      let usuarioAtualizado = await usuarioModel.selectUserByIdModel(dadosBody.id)

      let dadosUserJson = {}
      dadosUserJson.user = usuarioAtualizado[0]
      dadosUserJson.status = 200
      dadosUserJson.message = 'Usuário atualizado com sucesso!'
      return dadosUserJson
    } else {
      return message.ERROR_ITEM_NOT_FOUND
    }
  }
}

const updateUserProfile = async (dadosBody) => {
  // console.log(dadosBody);
  if (dadosBody.id == '' || dadosBody.id == undefined || isNaN(dadosBody.id)) {
    // console.log('teste zika');
    return message.ERROR_INVALID_ID
  } else {
    let dadosUpdatePersonalizarPerfil = usuarioModel.dadosUpdatePersonalizarPerfilModel(dadosBody)

    if (dadosUpdatePersonalizarPerfil) {
      let usuarioAtualizado = await usuarioModel.selectUserByIdModel(dadosBody.id)

      let dadosUsuarioJson = {}
      dadosUsuarioJson.usuario = usuarioAtualizado
      dadosUsuarioJson.status = 200
      dadosUsuarioJson.message = 'Usuário atualizado com sucesso!'
      return dadosUsuarioJson
    } else {
      return message.ERROR_ITEM_NOT_FOUND
    }
  }
}

const selectUserByEmailTagName = async (dadosBody) => {
  let dadosJson = {}
  if (dadosBody.nome_de_usuario == '' || dadosBody.nome_de_usuario == undefined || !isNaN(dadosBody.nome_de_usuario) ||
    dadosBody.email == '' || dadosBody.email == undefined || !isNaN(dadosBody.email) ||
    dadosBody.senha == '' || dadosBody.senha == undefined || !isNaN(dadosBody.senha)) {
    return message.ERROR_REQUIRED_FIELDS
  } else {
    let resultUserEmailTagName = await usuarioModel.selectUserByEmailTagNameModel(dadosBody)

    if (resultUserEmailTagName) {
      dadosJson.message = 'Usuário já existe em nosso sistema'
      dadosJson.status = 400

      return dadosJson
    } else {

      dadosJson.message = 'Usuário não existe em nosso sistema'
      dadosJson.status = 200
      return dadosJson
    }
  }
}

const selectProfileById = async (id) => {
  // console.log(id);

  let dadosUsuarioJson = {}
  let tagArray = []

  if (id == '' || id == undefined || isNaN(id)) {
    return message.ERROR_INVALID_ID
  } else {

    let usuario = await usuarioModel.selectUserById(id)

    // console.log(usuario[0]);

    if (usuario.length) {

      usuario[0].id_usuario = usuario[0].id
      
      delete usuario[0].id

      // console.log(usuario[0]);

      let usuarioPossuiTag = await tagUsuarioModel.selectAllTagsWithUserIdModel(id)

      if (usuarioPossuiTag.length) {
        for (let i = 0; i < usuarioPossuiTag.length; i++) {
          let tagUsuario = usuarioPossuiTag[i]

          let tag = await tagModel.selectTagByIdModel(tagUsuario.id_tag)

          tagArray.push(tag[0])
        }

        usuario[0].tags = tagArray
      } else {
        usuario[0].tags = []
      }

      if (usuario[0].id_localizacao == null) {
        usuario[0].id_localizacao = 0
        usuario[0].localizacao = {}
      } else {
        let localizacaoUsuario = await localizacaoModel.selectLocationByIdSemIdNoRetorno(usuario[0].id_localizacao)

        // console.log('testezika');
        // console.log(localizacaoUsuario);
        usuario[0].localizacao = localizacaoUsuario[0]
      }

      // console.log(usuario[0].id_usuario);

      let publicacoesUsuario = await publicacaoModel.selectAllPublicationsByIdUsuario(usuario[0].id_usuario)

      let publicacaoArray = []

      if (publicacoesUsuario.length) {
        for (let i = 0; i < publicacoesUsuario.length; i++) {

          let publicacao = publicacoesUsuario[i]

          let anexosPublicacao = await anexosModel.selectAnexosByIdModel(publicacao.id)

          publicacao.anexos = anexosPublicacao

          publicacaoArray.push(publicacao)
        }

        usuario[0].publicacoes = publicacaoArray
      } else {
        usuario[0].publicacoes = []
      }

      if (usuario) {
        let dadosUsuarioJson = {}

        dadosUsuarioJson.usuario = usuario[0]
        dadosUsuarioJson.message = 'Usuário encontrado com sucesso'
        dadosUsuarioJson.status = 200

        return dadosUsuarioJson
      } else {
        return message.ERROR_INTERNAL_SERVER
      }

    } else {
      return message.ERROR_USER_NOT_FOUND
    }

  }
}

const updateProfileTagLocality = async (dadosBody) => {
  let dadosPerfilUsuarioJson = {}

  let resultDadosParaDeletar = await tagUsuarioModel.selectAllTagsWithUserIdModel(dadosBody.id_usuario)

  // console.log(resultDadosParaDeletar);

  // console.log(dadosBody);

  if (dadosBody.id_usuario == '' || dadosBody.id_usuario == undefined || isNaN(dadosBody.id_usuario) ||
    dadosBody.id_localizacao == '' || dadosBody.id_localizacao == undefined || isNaN(dadosBody.id_localizacao) ||
    dadosBody.bairro == '' || dadosBody.bairro == undefined || !isNaN(dadosBody.bairro) || dadosBody.bairro.length > 255 ||
    dadosBody.cidade == '' || dadosBody.cidade == undefined || !isNaN(dadosBody.cidade) || dadosBody.bairro.length > 255 ||
    dadosBody.estado == '' || dadosBody.estado == undefined || !isNaN(dadosBody.estado) || dadosBody.estado.length > 255 ||
    dadosBody.nome == '' || dadosBody.nome == undefined || !isNaN(dadosBody.nome) || dadosBody.nome.length > 100 ||
    dadosBody.descricao == '' || dadosBody.descricao == undefined || !isNaN(dadosBody.descricao) || dadosBody.descricao.length > 255 ||
    dadosBody.foto == '' || dadosBody.foto == undefined || !isNaN(dadosBody.foto) ||
    dadosBody.nome_de_usuario == '' || dadosBody.nome_de_usuario == undefined || !isNaN(dadosBody.nome_de_usuario) || dadosBody.nome_de_usuario.length > 100
  ) {

    return message.ERROR_MISTAKE_IN_THE_FILDS

    //Corrigir está parte da função
  } else if (dadosBody.tags.length == 0) {

    // let usuarioPossuiTag = await usuarioModel.selectAllTagsWithUserIdModel(dadosBody.id_usuario)

    if (resultDadosParaDeletar) {

      let resultDadosDeletado = await tagUsuarioModel.deleteAllTagsWithUserIdModel(dadosBody.id_usuario)

      if (resultDadosDeletado) {

        await usuarioModel.updateProfileTagLocalityModel(dadosBody)

        let usuarioAtualizado = await usuarioModel.selectProfileByIdModel(dadosBody.id_usuario)

        dadosPerfilUsuarioJson.usuario_atualizado = usuarioAtualizado

        dadosPerfilUsuarioJson.message = message.SUCCESS_UPDATED_ITEM.message
        dadosPerfilUsuarioJson.status = message.SUCCESS_UPDATED_ITEM.status

        return dadosPerfilUsuarioJson
      } else {
        return message.ERROR_INTERNAL_SERVER
      }

    } else {
      await usuarioModel.updateProfileTagLocalityModel(dadosBody)

      let usuarioAtualizado = await usuarioModel.selectUserByIdModel(dadosBody.id_usuario)

      // console.log(usuarioAtualizado);

      dadosPerfilUsuarioJson.usuario_atualizado = usuarioAtualizado[0]

      dadosPerfilUsuarioJson.message = message.SUCCESS_UPDATED_ITEM.message
      dadosPerfilUsuarioJson.status = message.SUCCESS_UPDATED_ITEM.status

      return dadosPerfilUsuarioJson
    }


  } else if (resultDadosParaDeletar) {
    let resultDadosDeletado = await tagUsuarioModel.deleteAllTagsWithUserIdModel(dadosBody.id_usuario)

    if (resultDadosDeletado) {
      const usuarioAtualizado = await updateTag(dadosBody)

      console.log('teste');

      if (usuarioAtualizado) {
        dadosPerfilUsuarioJson.usuario_atualizado = usuarioAtualizado
        dadosPerfilUsuarioJson.message = message.SUCCESS_UPDATED_ITEM.message
        dadosPerfilUsuarioJson.status = message.SUCCESS_UPDATED_ITEM.status
        return dadosPerfilUsuarioJson
      } else {
        return message.ERROR_UNABLE_TO_UPDATE
      }
    } else {
      // console.log('teste 2');
      return message.ERROR_INTERNAL_SERVER
    }
  } else {
    const usuarioAtualizado = await updateTag(dadosBody)

    // console.log(usuarioAtualizado);a

    if (usuarioAtualizado) {
      dadosPerfilUsuarioJson.usuario_atualizado = usuarioAtualizado
      dadosPerfilUsuarioJson.message = message.SUCCESS_UPDATED_ITEM.message
      dadosPerfilUsuarioJson.status = message.SUCCESS_UPDATED_ITEM.status
      return dadosPerfilUsuarioJson
    } else {
      return message.ERROR_UNABLE_TO_UPDATE
    }
  }
}

const updateTag = async (dadosBody) => {
  let dadosPerfilUsuarioJson = {}
  let tagsAtualizadas = []

  // console.log(dadosBody);

  for (let i = 0; i < dadosBody.tags.length; i++) {
    let tag = dadosBody.tags[i]

    await tagUsuarioModel.insertTagUsuario(tag.id_tag, dadosBody.id_usuario)

    let tagUsuarioAtualizada = await tagUsuarioModel.selectTagUsuarioLastId()

    let tagAtualizada = await tagModel.selectTagByIdModel(tagUsuarioAtualizada[0].id_tag)

    tagsAtualizadas.push(tagAtualizada[0])
  }

  dadosPerfilUsuarioJson.tags_atualizadas = tagsAtualizadas

  await usuarioModel.updateProfileTagLocalityModel(dadosBody)

  let usuarioAtualizado = await usuarioModel.selectProfileByIdModel(dadosBody.id_usuario)

  dadosPerfilUsuarioJson.usuario = usuarioAtualizado[0]

  return dadosPerfilUsuarioJson
}

const selectAllUsers = async () => {

  let dadosUsuario = await usuarioModel.selectAllUsersModel()

  if (dadosUsuario) {
    let dadosUsuarioJson = {}

    dadosUsuarioJson.usuarios = dadosUsuario
    dadosUsuarioJson.status = 200
    dadosUsuarioJson.message = 'Usuários encontrados com sucesso!'

    return dadosUsuarioJson
  } else {
    return message.ERROR_INTERNAL_SERVER
  }
}

const selectAllUsuariosByTag = async (tag) => {
  let dadosUsuariosJson = {}
  let usuariosArray = []

  if (tag.id_tag == '' || tag.id_tag == undefined || isNaN(tag.id_tag)) {
    return message.ERROR_INVALID_ID
  } else if (tag.nome_tag == '' || tag.nome_tag == undefined || !isNaN(tag.nome_tag) || tag.nome_tag.length > 255) {
    return message.ERROR_MISTAKE_IN_THE_FILDS
  } else {

    let dadosUsuarios = await tagUsuarioModel.selectAllUsuariosByTag(tag)

    // console.log(dadosUsuarios);

    if (dadosUsuarios) {

      for (let i = 0; i < dadosUsuarios.length; i++) {
        let usuarioIndex = dadosUsuarios[i]

        // console.log(usuarioIndex);

        let usuario = await usuarioModel.selectUserByIdModel(usuarioIndex.id_usuario)

        // console.log(usuario);

        usuariosArray.push(usuario[0])
      }

      // console.log(usuariosArray);  

      for (let i = 0; i < usuariosArray.length; i++) {
        let elemento = usuariosArray[i]

        // console.log(elemento);

        if (elemento == undefined || elemento == null) {
          usuariosArray.splice(i, 1)
        }
      }

      // console.log(usuariosArray);

      dadosUsuariosJson.usuarios = usuariosArray
      dadosUsuariosJson.message = message.SUCCESS_USER_FOUND.message
      dadosUsuariosJson.status = message.SUCCESS_USER_FOUND.status

      // console.log(dadosUsuariosJson);

      return dadosUsuariosJson
    } else {
      return message.ERROR_INTERNAL_SERVER
    }
  }
}

const deleteUserById = async (id) => {

  if (id == '' || id == undefined || isNaN(id)) {
    return message.ERROR_INVALID_ID
  } else {

    let usuarioDeletado = await usuarioModel.selectUserByIdModel(id)

    let deleteUsuario = await usuarioModel.deleteUserByIdModel(id)

    if (usuarioDeletado == false) {
      return message.ERROR_DELETED_USER
    } else if (deleteUsuario) {
      let dadosUsuarioJson = {}

      dadosUsuarioJson.usuario_deletado = usuarioDeletado
      dadosUsuarioJson.message = message.SUCCESS_DELETED_ITEM.message
      dadosUsuarioJson.status = message.SUCCESS_DELETED_ITEM.status

      return dadosUsuarioJson
    } else {
      return message.ERROR_INTERNAL_SERVER
    }
  }
}

const registrarUsuario = async (dadosBody) => {

  let usuarioExistenteEmail = await usuarioModel.selectUserEmailModel(dadosBody.email)
  let usuarioExistenteTag = await usuarioModel.selectUserByTagNameModel(dadosBody.nome_de_usuario)

  if (dadosBody.nome_de_usuario == '' || dadosBody.nome_de_usuario == undefined || !isNaN(dadosBody.nome_de_usuario) || dadosBody.nome_de_usuario.length > 100 ||
    dadosBody.email == '' || dadosBody.email == undefined || !isNaN(dadosBody.email) || dadosBody.email.length > 255 ||
    dadosBody.senha == '' || dadosBody.senha == undefined || !isNaN(dadosBody.senha) || dadosBody.senha.length > 515
  ) {
    return message.ERROR_REQUIRED_FIELDS
  } else if (usuarioExistenteEmail.length) {
    return message.ERROR_EMAIL_ALREADY_EXISTS
  } else if (usuarioExistenteTag.length) {
    return message.ERROR_TAG_NAME_ALREADY_EXISTS
  } else {

    let resultDadosUsuario = await usuarioModel.insertUsuarioModel(dadosBody)

    if (resultDadosUsuario) {

      let novoUsuario = await usuarioModel.selectLastIDUsuarioModel()

      let dadosUsuarioJson = {}

      let tokenUser = await jwt.createJWT(novoUsuario[0].id);

      dadosUsuarioJson.usuario = novoUsuario[0]
      dadosUsuarioJson.message = message.SUCCESS_CREATED_ITEM.message
      dadosUsuarioJson.status = message.SUCCESS_CREATED_ITEM.status
      dadosUsuarioJson.token = tokenUser

      return dadosUsuarioJson
    } else {
      return message.ERROR_INSERT_USER
    }
  }
}

module.exports = {
  selectUserByLogin,
  getUserByEmail,
  updateUserTokenAndExpires,
  selectTokenById,
  updateUserPassword,
  updateUserProfile,
  selectUserByEmailTagName,
  selectProfileById,
  updateProfileTagLocality,
  selectAllUsers,
  selectAllUsuariosByTag,
  deleteUserById,
  registrarUsuario,
  updateTag
}
