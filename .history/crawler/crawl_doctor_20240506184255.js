const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("https://www.vinmec.com/vi/danh-sach/bac-si/ca-nuoc/");

    // Chờ cho dữ liệu được tải hoàn thành
    await page.waitForSelector("#list > div > div > ul > li");

    const items = await page.evaluate(() => {
        const itemNodes = document.querySelectorAll("#list > div > div > ul > li");
        const itemList = [];

        itemNodes.forEach((node) => {
            const name = node
                .querySelector("div.body > div.info > h2 > a")
                .innerText.trim();

            const deegre = node
            .querySelector("#list > div > div > ul > li:nth-child(1) > div.body > div.info > dl > dd:nth-child(2)")
                .innerText.trim();

            itemList.push({ name });
        });

        return itemList;
    });

    console.log(items);

    await browser.close();
})();
