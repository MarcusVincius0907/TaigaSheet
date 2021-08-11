//pegar reports name3/tema7/status14

const fakeValue = require("./example.js");
const browserHandler = require("./browserHandler/index");
const googleDriveHandler = require("./googleDrive/index");


async function fileManipulation(reports) {
  const fs = require("fs");
  const reportName = "report.txt";
  const tasksClosed = []

  try {
    fs.appendFile(reportName, reports, function (err) {
      if (err) throw err;
    });

    const readline = require("readline");

    const fileStream = fs.createReadStream(reportName);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const values = line.split(",");
      if(values[13] === 'Closed'){
        tasksClosed.push({
          name:values[2],
          theme:values[6],
        })
      }
    }

    fs.unlink(reportName, function (err) {
      if (err) throw err;
    });

    return tasksClosed;

  } catch (e) {
    console.log("Erro na manipulação do arquivo", e);
  }
}

const processCompleted = new Promise(async (res, rej) => {
  try{
    console.log('Getting reports from Taiga...');
    const reportsFromTaiga  = await browserHandler.GetReportsFromTaiga()
    console.log('Manipulating reports...');
    const reportsFiltered = await fileManipulation(reportsFromTaiga.data)
    console.log('Updating Google Sheets...');
    await googleDriveHandler.updateSpreadSheed(reportsFiltered)
    res('Process completed!')
  }catch (e) {
    rej('Error in process',e)
  }
});

processCompleted
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

