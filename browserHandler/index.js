const puppeteer = require('puppeteer');

const credentials = { 
  user: 'Patleite', 
  password: 'Paty@5132',
}

const project = "FMP - Alumia"

;(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({
    width: 640,
    height: 480,
    deviceScaleFactor: 1,
  });
  await page.goto('https://tree.taiga.io/login?next=%252Fdiscover');
  await page.waitForSelector(`input[type='text']`);
  await page.type(`input[type='text']`, credentials.user, { delay: 15 });
  await page.waitForSelector(`input[type='password']`);
  await page.type(`input[type='password']`, credentials.password, { delay: 15 });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(3550);
  await page.goto("https://tree.taiga.io/projects/")
  await page.waitForSelector(".project-list > ul > li > div > div > div .list-itemtype-data-title > a");
  const lists = await page.$$(".project-list > ul > li > div > div > div .list-itemtype-data-title > a")
  let link = await new Promise((resolve, reject) => {
    lists.forEach(async (item, i) => {
      const text = await (await item.getProperty('innerText')).jsonValue();
      console.log(text);
      if(text === project){
        console.log(true);
        resolve(item);
      }
      if (i === item.length - 1) {
        resolve();
      }
    });
  });
  await page.waitForTimeout(3550);
  console.log('try hover');
  await link.hover()
  console.log('hover');
  await page.waitForTimeout(3550);
  console.log('try click');
  await link.click()
  console.log('clicked');
  
  //await page.waitForTimeout(3550);
  /* const projectElement = await page.evaluate(() => {

    const lists = document.querySelectorAll(".project-list > ul > li > div > div > div .list-itemtype-data-title > a");

    let link;

    lists.forEach(el => {
      if(el.textContent === "FMP - Alumia"){
        link = el
      }
    })

    return Promise.resolve(link)

  })

  console.log(projectElement);

  //await page.waitForTimeout(3550);

  //await page.hover(projectElement)

  //await page.click(projectElement)

  await page.screenshot({ path: 'hover.png' }) */






  //count how many li elements
  //.project-list > ul > li > div > div > div .list-itemtype-data-title > a 

  //https://tree.taiga.io/projects/
  /* await page.waitForSelector(".login");
  await page.click(".login") */

 //await browser.close();
})();