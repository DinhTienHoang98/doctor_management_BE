const puppeteer = require('puppeteer');

(async () => {
    // Initiate the browser 
    const browser = await puppeteer.launch();

    // Create a new page with the default browser context 
    const page = await browser.newPage();

    // Go to the target website 
    await page.goto('https://www.vinmec.com/vi/danh-sach/bac-si/ca-nuoc/');

    await page.waitForSelector('#list > div > div > ul > li');
    const itemList = []

    const titleNode = await page.$('h1');
    const title = await page.evaluate(el => el.innerText, titleNode);

    // We can do both actions with one command 
    // In this case, extract the href attribute instead of the text 
    const link = await page.$eval('a', anchor => anchor.getAttribute('href'));

    console.log({ title, link });

    // Get pages HTML content 
    const content = await page.content();
    console.log(content);

    // Closes the browser and all of its pages 
    await browser.close();
})();
