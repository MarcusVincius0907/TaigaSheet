//pegar reports name3/tema7/status14

const browserHandler = require("./browserHandler/index");
const fakeValue = require("./example.js");

async function fileManipulation() {
  const fs = require("fs");
  const reportName = "report.txt";
  const reportLine = [];
  const reports = [];
  const separateValues = [];

  try {
    fs.appendFile(reportName, fakeValue.value, function (err) {
      if (err) throw err;
    });

    const readline = require("readline");

    async function processLineByLine() {
      const fileStream = fs.createReadStream(reportName);

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        reportLine.push(line);
      }

      reportLine.forEach((v) => {
        const values = v.split(",");
        reports.push(values);
      });

      reports.shift();

      reports.forEach((v, idx) => {
        const obj = {
          name: v[2],
          theme: v[6],
          status: v[13],
        };

        separateValues.push(obj);
      });

      let dones = separateValues.filter((v) => v.status === "Closed");

      return dones;
    }

    const dones = await processLineByLine();

    fs.unlink(reportName, function (err) {
      if (err) throw err;
    });

    return dones;
  } catch (e) {
    console.log("Erro na manipulação do arquivo", e);
  }
}

const processCompleted = new Promise(async (res, rej) => {
  res(await fileManipulation());
});

processCompleted
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

//separar separar os com status closed

//
