const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

    await page.goto("https://meteo.kisoui.fr");

    // Change la résoliution de la page
    await page.setViewport({ width: 1920, height: 1080 });

    // Récupère tout le texte de la page
    const logStatement = await page.evaluate(() => {
      const elements = document.querySelectorAll("body");
      let text = "";
      elements.forEach((element) => {
        text += element.innerText;
      });
      return text;
    });
    res.send(logStatement);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
