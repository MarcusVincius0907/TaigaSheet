const credentials = require("./credentials.json");

async function updateSpreadSheed(filter) {
  const { GoogleSpreadsheet } = require("google-spreadsheet");
  
  // Initialize the sheet - doc ID is the long id in the sheets URL
  const doc = new GoogleSpreadsheet(
    "1s_VIjKt5GDizIbsW6ZxggiNroEnfxo4QjqbFr3M5w4Y"
  );

  // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
  await doc.useServiceAccountAuth({
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  });

  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
   
    try{
      const lines =  await sheet.getRows();
      await sheet.loadCells( `A2:H${lines.length + 1}`); // A1 range: ;
      //console.log(sheet.cellStats); // lines cells, loaded, how many non-empty
      
      filter.forEach(reg => {
        const { name, theme } = reg
        lines.forEach(line => {
          if(line.Nome.includes(name) && line.Tema.includes(theme)){
            const rowIndex = line.rowIndex
            const cell = sheet.getCell(rowIndex - 1, 5)
            cell.value = "Closed";
          }
      
        })
      })

      await sheet.saveUpdatedCells(); // save all updates in one call
    }catch (e) {
      console.log('err',e);
    }
 

 

}

const filterFake = [
  {name : '03-02-2021-T - Part 01',
  theme : 'Direitos Fundamentais'},

  {name : '29-03-2021 - Part 01',
  theme : 'Direito Tributário/Direito Financeiro'},
]

/* ;(async function () {
  await updateSpreadSheed(filterFake);
})(); */



module.exports = { updateSpreadSheed }