/*****************************************************************************
 * Objetivo: Controller feita para gerenciamento de dados que chegam do banco de dados
 * Data: 30/08/2023
 * Autor: André
 * Versão: 1.0
 *****************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e funções globais
var message = require("../controller/modulo/config.js");

//Import JWT
const jwt = require("../middleware/middlewareJWT.js");

/* Imports Models */
const usuarioModel = require("../model/usuarioModel.js");

const insertUsuario = async (dadosUsuario) => {
  if (
    dadosUsuario.nome_de_usuario == "" ||
    dadosUsuario.nome_de_usuario == undefined ||
    dadosUsuario.nome_de_usuario.lenght > 100 ||
    dadosUsuario.email == "" ||
    dadosUsuario.email == undefined ||
    dadosUsuario.email.length > 255 ||
    dadosUsuario.senha == "" ||
    dadosUsuario.senha == undefined ||
    dadosUsuario.senha.length > 515
  ) {
    return message.ERROR_REQUIRED_FIELDS;
  } else {
    let resultEmail = await usuarioModel.selectUserByEmailModel(
      dadosUsuario.email
    );

    if (resultEmail) {
      return message.ERROR_EMAIL_ALREADY_EXISTS;
    } else {
      let resultDadosUsuario = await usuarioModel.insertUsuarioModel(
        dadosUsuario
      );

      //Valida se o BD inseriu corretamente os dados
      if (resultDadosUsuario) {
        //Chama a função que vai encontrar o ID gerado após o inser
        let novoUsuario = await usuarioModel.selectLastIDModel();

        //Gera o token pelo jwt
        let tokenUser = await jwt.createJWT(novoUsuario[0].id);

        let dadosUsuarioJson = {};
        dadosUsuarioJson.status = message.SUCCESS_CREATED_ITEM.status;
        dadosUsuarioJson.aluno = novoUsuario[0];
        dadosUsuarioJson.token = tokenUser

        return dadosUsuarioJson; //StatusCode 201
      } else {
        return message.ERROR_INTERNAL_SERVER; //StatusCode 500
      }
    }
  }
};

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

      console.log(resultToken);

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
  if (dadosBody.id == '' || dadosBody.id == undefined || isNaN(dadosBody.id)) {
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

  let dadosUsuarioJson = {}
  if (id== '' || id == undefined || isNaN(id)) {
    return message.ERROR_INVALID_ID
  } else {
    let dadosPerfilUsuario = await usuarioModel.selectProfileByIdModel(id)

    if(dadosPerfilUsuario) {

      dadosUsuarioJson.usuario = dadosPerfilUsuario[0]
      dadosUsuarioJson.status = 200
      dadosPerfilUsuario.message = 'Usuário encontrado com sucesso'

      return dadosUsuarioJson
    } else {
      dadosUsuarioJson.message = 'Usuário não encontrado em nosso sistema'
      dadosUsuarioJson.status = 404

      return dadosUsuarioJson
    }
  }
}

module.exports = {
  insertUsuario,
  selectUserByLogin,
  getUserByEmail,
  updateUserTokenAndExpires,
  selectTokenById,
  updateUserPassword,
  updateUserProfile,
  selectUserByEmailTagName,
  selectProfileById
};
