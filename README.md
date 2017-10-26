# mulheres-palestrantes-api

[![Build Status](https://travis-ci.org/insideoutprojectbr/mulheres-palestrantes-api.svg?branch=master)](https://travis-ci.org/insideoutprojectbr/mulheres-palestrantes-api)
[![Coverage Status](https://coveralls.io/repos/github/insideoutprojectbr/mulheres-palestrantes-api/badge.svg)](https://coveralls.io/github/insideoutprojectbr/mulheres-palestrantes-api)
[![Known Vulnerabilities](https://snyk.io/test/github/insideoutprojectbr/mulheres-palestrantes-api/badge.svg)](https://snyk.io/test/github/insideoutprojectbr/mulheres-palestrantes-api)

API para o site [mulheres-palestrantes](https://github.com/insideoutprojectbr/mulheres-palestrantes) em Node.js usando [Koa](http://koajs.com/) e [Sequelize](http://docs.sequelizejs.com/).

## Instalação

O ambiente de desenvolvimento da aplicação utiliza [Docker](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/) e [Docker-Compose](https://docs.docker.com/compose/install/).

### Docker-Compose

A aplicação é configurada através de variáveis de ambiente.
Para isso crie o arquivo `.env` através do arquivo [`.env.sample`](.env.sample).

```
  docker-compose up # constrói e executa os containers da aplicação
```

### Banco de dados

A aplicação suporta bancos [Postgres](https://www.postgresql.org/) e [SQLite](https://sqlite.org/).
Para camada de cache, utiliza o [Redis](https://redis.io/).

#### Migração

O script de versionamento de banco de dados utiliza o [Umzug](https://github.com/sequelize/umzug).

```
  docker-compose exec web npm run migrate up # executa as migrações do banco de dados
```

#### Seed

O seguinte comando popula o banco de dados a partir de um json no seguinte [formato](https://raw.githubusercontent.com/insideoutprojectbr/mulheres-palestrantes/master/mulheres.json):

```
    docker-compose exec web npm run seed https://raw.githubusercontent.com/insideoutprojectbr/mulheres-palestrantes/master/mulheres.json
```

## Execução dos testes

Os testes da aplicação usam o framework [Jest](http://facebook.github.io/jest/).  

```
  docker-compose exec web npm test # executa os testes unitários
  docker-compose exec web npm run lint # executa o linter Eslint
```

## Documentação

A documentação da API está definida no formato [OpenAPI(Swagger)](https://swagger.io/) e pode ser acessada em [https://mulheres-palestrantes-api.herokuapp.com/api/docs](https://mulheres-palestrantes-api.herokuapp.com/api/docs). 
