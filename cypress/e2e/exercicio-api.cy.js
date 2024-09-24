/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'
import { faker } from '@faker-js/faker';

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(resposta => {
      return contrato.validateAsync(resposta.body)
    })
  }); 

  it('Deve listar usuários cadastrados', () => {
    cy.request('usuarios').then((resposta) => {
      cy.log(resposta.body)
      expect(resposta.body).to.have.property('usuarios')
      expect(resposta.status).equal(200)
    })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    cy.cadastrarUsuario('Usuário',faker.internet.email(),'teste123','true').then((resposta) => {
      expect(resposta.status).equal(201)
      expect(resposta.body.message).include('Cadastro realizado com sucesso')
      cy.log(resposta.status)
      cy.log(resposta.body.message)
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.cadastrarUsuario('Usuário','fulano@qa.com','teste123','true').then((resposta) => {
      expect(resposta.status).equal(400)
      expect(resposta.body.message).include('Este email já está sendo usado')
      cy.log(resposta.status)
      cy.log(resposta.body.message)
    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    cy.cadastrarUsuario('Usuário',faker.internet.email(),'teste123','true').then((resposta) => {
      let id = resposta.body._id
      cy.request({
        method: 'PUT',
        url: `usuarios/${id}`,
        body: {
          "nome": "Fulano da Silva",
          "email": faker.internet.email(),
          "password": "teste",
          "administrador": "true"
        }
      }).then((resposta) => {
        expect(resposta.body.message).include('Registro alterado com sucesso')
        expect(resposta.status).equal(200)
        cy.log(resposta.body.message)
        cy.log(resposta.status)
      })
    })

  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.cadastrarUsuario('Usuário',faker.internet.email(),'teste123','true').then((resposta) => {
      let id = resposta.body._id
      cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`,
      }).then((resposta) => {
        expect(resposta.body.message).include('Registro excluído com sucesso')
        expect(resposta.status).equal(200)
        cy.log(resposta.body.message)
        cy.log(resposta.status)
      })
    })
  });


});
