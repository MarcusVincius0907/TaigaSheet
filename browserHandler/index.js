const puppeteer = require('puppeteer');
const config = require('./config.json')
const axios = require('axios');

 async function GetReportsFromTaiga(){
  const { credentials } = config
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({
    width: 1000,
    height: 1000,
    deviceScaleFactor: 1,
  });

  //login
  await page.goto('https://tree.taiga.io/login?next=%252Fdiscover');
  await page.waitForSelector(`input[type='text']`);
  await page.type(`input[type='text']`, credentials.user, { delay: 15 });
  await page.waitForSelector(`input[type='password']`);
  await page.type(`input[type='password']`, credentials.password, { delay: 15 });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(3550);

  //go to config
  await page.goto(getConfigLink())
  await page.waitForTimeout(3550);
  const url = await getReportURL(page)

  try{
    const response = await getReportInfo(url)
    await page.waitForTimeout(5550);
    await browser.close();
    return response
  }catch(e){
    await browser.close();
    throw new Error("Error when getting reports")
  }

}

async function getReportInfo(url){
  return axios({
    method: 'get',
    url: url,
  })

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

async function getReportURL(page){

  const url = await page.evaluate(async() => {

    const waitButton = () => {
      return new Promise((resolve, reject) => {
        setTimeout(()=>{
          let linkBaixar = document.querySelector("section.main div:nth-child(5) section div:nth-child(1) a")
          resolve(linkBaixar);
        },2000)
      }).then(res => res)
    }

    let linkBaixar = await waitButton()
    //true = escondido
    //false = aparece
    if(linkBaixar.ariaHidden === "false"){
      //linkBaixar.click()
      return linkBaixar.href
    }
    else{
      const linkGerarURL = document.querySelector("section.main div:nth-child(5) section div:nth-child(2) a:nth-child(2)")
      linkGerarURL.click();

      linkBaixar = await waitButton()

      return linkBaixar.href
      
      
    }
    
  });
  console.log('url',url);
  return url
  
}


module.exports = { GetReportsFromTaiga }