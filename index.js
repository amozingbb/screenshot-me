const express = require("express");
const puppeteer = require("puppeteer");
const validUrl = require('valid-url');
const randomUUID = require('random-uuid');

const PORT = 3000;
const app = express();

var parseUrl = function(url) {
  url = decodeURIComponent(url)
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = 'http://' + url;
  }
  
  return url;
};


app.get("/", (req, res) => {
  res.send("Greeting you to scrap everything!!. On the name of noah-m. !! :O :D ");
});

app.get("/health", (req, res) => {
  res.send("As of now. All good. will keep you updated.");
});


app.get("/screenshot", function(req, res) {

  var urlToScreenshot = parseUrl(req.query.url);
  
  if (validUrl.isWebUri(urlToScreenshot)) {
    console.log('Screenshotting: ' + urlToScreenshot);
    (async () => {
      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox','--proxy-server=http://127.0.0.1:3128'], defaultViewport: null });
      const page = await browser.newPage();

      await page.setViewport({ width: 2000, height: 3000 });

      await page.goto(urlToScreenshot);
      await page.screenshot({fullPage: true}).then(function(buffer) {
                  res.setHeader('Content-Disposition', 'attachment;filename="' + urlToScreenshot + '.png"');
                  res.setHeader('Content-Type', 'image/png');
                  res.send(buffer)
              });

      await browser.close();

    })();
  }
  else {
    res.send('Invalid url: ' + urlToScreenshot);
}
});

app.listen(PORT, () => {
 console.log(`Server is listening on port: ${PORT}`);
});
