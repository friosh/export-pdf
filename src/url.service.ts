import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

@Injectable()
export class GeneratePdfFromUrlService {
  async call(url: string, token: string): Promise<Buffer> | null {
    try {
      puppeteer.use(
        StealthPlugin({
          // testing
          enabledEvasions: new Set([
            'chrome.app',
            'chrome.csi',
            'defaultArgs',
            'navigator.plugins',
          ]),
        }),
      );

      const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        timeout: 0,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',

          // testing
          '--disable-infobars',
          '--window-position=0,0',
          '--ignore-certifcate-errors',
          '--ignore-certifcate-errors-spki-list',
        ],
      });

      const page = await browser.newPage();

      await page.setExtraHTTPHeaders({
        Authorization: `Bearer ${token}`,
      });

      await page.goto(url, { waitUntil: 'networkidle0' });

      // In order to have enough time for network debugging
      const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      await sleep(20_000);

      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.images).map((img) => {
            if (img.complete) return;

            return new Promise((resolve) => {
              img.onload = img.onerror = resolve;
            });
          }),
        );
      });

      const pdf = await page.pdf();

      await browser.close();

      return pdf;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
