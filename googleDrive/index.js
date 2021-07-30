const GoogleSpreadsheed = require('google-spreadsheet')
const credentials = require('./credentials.json')
const { promisify } = require('util')

const docId = '1ClBidfkm0H9xc9zw-juE69nX0RKgxO-NS4uL27TnH9A'

const accessSheet = async() => {
  const doc = new GoogleSpreadsheed(docId)
  await promisify(doc.useServiceAccountAuth)(credentials)
  const info = await promisify(doc.getInfo)()
  const worksheet = info.worksheets[0]
  

  //post
 /*  await promisify(worksheet.addRow)({
    nome: 'novo', email: 'ola@ola.com'
  }) */

  //get
  /* const rows = await promisify(worksheet.getRows)({})
  rows.forEach(row => {
    console.log(row.nome)
    //to delete
    //row.del()
  }) */

  //get filter
  const rows = await promisify(worksheet.getRows)({
    query:'nome = "Marcus"'
  })

  rows.forEach(row => {
    console.log(row.nome, row.email)
    //to delete
    //row.del()
  })


}

accessSheet()