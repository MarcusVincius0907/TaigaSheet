# Integração Taiga - Google Sheets

##### Integração que pega o status dos relatórios do Taiga e atualiza em uma respectiva planilha

 
#

### Tecnologias utilizadas:
- Node
- Puppeteer
- Google Sheets API

## Instalação

Requer [Node.js](https://nodejs.org/) v10+ 

Instale as dependências:

```sh
cd TaigaSheet
npm i
node index.js
```

## Arquivo de configurações
##### antes de rodar o projeto você deve fazer as seguintes configurações:

- No arquivo [projectConfig.json]() deve-se configurar as informações do google sheet. Na propriedade "token" coloque o token da sua planilha e dê acesso ao endereço de email que consta na propriedade "client_email".
- Para configurar as informações do browser handler você deve preencher com as suas credenciais, e em seguida:
    - "targetProject" refere-se a qual projeto que o script deverá pegar os status das tasks, então coloque o nome de algum dos projetos.
    - "projects" refere-se a lista de projetos existentes, usados como referencia para preencher o "targetProject". Você pode alimentar essa lista de acordo com os projetos existentes