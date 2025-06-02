const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/screenshot', async (req, res) => {
  const { url } = req.body;
  let browser;

  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    // ✅ Full page screenshot
    const screenshot = await page.screenshot({ type: 'png', fullPage: true });

    res.set('Content-Type', 'image/png');
    res.send(screenshot);
  } catch (error) {
    console.error('Error taking screenshot:', error);
    res.status(500).json({ error: 'Failed to take screenshot.' });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
