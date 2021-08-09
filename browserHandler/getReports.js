const puppeteer = require('puppeteer');

const config = require('./config.json')

const dFolderPath = 'C:\\Users\\mvlei\\Downloads'
const nFolderPath = 'D:\\workspaceHD\\estudos\\projetos\\TaigaSheet\\browserHandler'

const path = require('path');
const fs = require('fs')

const axios = require('axios');




;(async () => {
  const { credentials } = config
  const browser = await puppeteer.launch({headless: false});
  listenDownloadEvent(browser);
  const page = await browser.newPage();
  await page.setViewport({
    width: 1000,
    height: 1000,
    deviceScaleFactor: 1,
  });
  await page.goto('https://tree.taiga.io/login?next=%252Fdiscover');
  await page.waitForSelector(`input[type='text']`);
  await page.type(`input[type='text']`, credentials.user, { delay: 15 });
  await page.waitForSelector(`input[type='password']`);
  await page.type(`input[type='password']`, credentials.password, { delay: 15 });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(3550);
  await page.goto(getConfigLink())
  await page.waitForTimeout(3550);
  const url = await getReportURL(page)
  const resp = await getReportInfo(url)
  await page.waitForTimeout(5550);
  //await checkDownloadDirectory()
  //await browser.close();
  
})();

async function getReportInfo(url){
  return axios({
    method: 'get',
    url: url,
  })
    .then(function (response) {
      console.log(response);
    });
}


function getProjectLink(){
  const { projects, targetProject } = config
  const project = projects.find(v => v.name.toUpperCase() === targetProject.toUpperCase() )
  return project.link
}

function getConfigLink(){
  const pathConfig = '/admin/project-profile/reports'
  return (getProjectLink() + pathConfig)
}

function listenDownloadEvent(browser){
  browser.on('targetcreated', async (target) => {
    let s = target.url();
    //the test opens an about:blank to start - ignore this
    if (s == 'about:blank') {
        return;
    }
    //unencode the characters after removing the content type
    s = s.replace("data:text/csv;charset=utf-8,", "");
    //clean up string by unencoding the %xx
    fs.writeFile("/tmp/download.csv", s, function(err) {
        if(err) {
            console.log(err);
            return;
        }
        console.log("The file was saved!");
    }); 
});
}

async function getReportURL(page){

  

  const url = await page.evaluate(async() => {

    const wait = () => {
      return new Promise((resolve, reject) => {
        setTimeout(()=>{
          linkBaixar = document.querySelector("section.main div:nth-child(5) section div:nth-child(1) a")
          resolve(linkBaixar.href);
        },2000)
      }).then(res => res)
    }

    let linkBaixar = document.querySelector("section.main div:nth-child(5) section div:nth-child(1) a")
    await wait()
    console.log('a');
    //true = escondido
    //false = aparece
    if(linkBaixar.ariaHidden === "false"){
      console.log('b');
      //linkBaixar.click()
      return linkBaixar.href
    }
    else{
      console.log('c');
      const linkGerarURL = document.querySelector("section.main div:nth-child(5) section div:nth-child(2) a:nth-child(2)")
      linkGerarURL.click();
      await wait()
      /* let p = new Promise((resolve, reject) => {
        setTimeout(()=>{
          resolve(linkBaixar.href);
        },2000)
      }) */
      linkBaixar = document.querySelector("section.main div:nth-child(5) section div:nth-child(1) a")

      return linkBaixar.href
      
      
    }
    
  });
  console.log('url',url);
  return url
  
}
