import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class GeneratePdfFromHtmlService {
  async call(html: string, token: string): Promise<Buffer> | null {
    try {
      const browser = await puppeteer.launch({
        headless: false,
        timeout: 0,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();

      await page.setExtraHTTPHeaders({
        Authorization: `Bearer ${token}`,
      });

      await page.goto(`data:text/html;base64,${html}`, {
        waitUntil: 'networkidle0',
      });

      const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      await sleep(120_000);

      const pdf = await page.pdf();

      await browser.close();

      return pdf;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
