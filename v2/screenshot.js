import puppeteer from 'puppeteer';

(async () => {
  // Launch browser
  const browser = await puppeteer.launch({ 
    headless: "new",
    defaultViewport: { width: 1280, height: 720 }
  });
  const page = await browser.newPage();

  // Give the server a few seconds to boot if it hasn't already
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log('Navigating to Painel (Dashboard)...');
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: '../img_painel.png' });
  console.log('Saved img_painel.png');

  console.log('Navigating to Simulador Individual...');
  await page.goto('http://localhost:5174/simulador', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: '../img_simulador.png' });
  console.log('Saved img_simulador.png');

  await browser.close();
  console.log('Done.');
})();
