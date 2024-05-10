const puppeteer = require("puppeteer");
const fs = require("fs");
const { stringify } = require("csv-stringify")

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

                const degree = node
                    .querySelector("#list .content>ul>li .body .info .brief dd ")
                    .innerText.trim();

                const specialist = node
                    .querySelector("div.body > div.info > dl > dd:nth-child(4) ")
                    .innerText.trim();

                const position = node
                    .querySelector("div.body > div.info > dl > dd:nth-child(6) ")
                    .innerText.trim();

                const introduce = node
                    .querySelector("#list .content>ul>li .body .info .desc ")
                    .innerText.trim();

                itemList.push({ name, degree, specialist, position, introduce });
            });

            return itemList;
        });
        console.log(items);
        await browser.close();

        const filename = "saved_from_db.csv"
        const writetabStream = fs.createWriteStream(filename);
        const columns = ["name", "degree", "specialist", "position", "introduce"];

        const stringifier = stringify({ Header: true, columns: columns, delimiter: "|" });
        stringifier.pipe(writetabStream);

        items.forEach((row) => {
            stringifier.write(row)
        });
        stringifier.end();

        console.log("completed");
    })();
