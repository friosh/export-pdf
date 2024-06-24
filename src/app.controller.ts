import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { GeneratePdfFromHtmlService } from './html.service';
import { GeneratePdfFromUrlService } from './url.service';

@Controller('/generate_pdf')
export class AppController {
  constructor(
    private readonly generatePdfFromUrlService: GeneratePdfFromUrlService,
    private readonly generatePdfFromHtmlService: GeneratePdfFromHtmlService,
  ) {}

  @Post()
  async generatePdfFromUrl(@Body() body: any, @Res() res: Response) {
    const url = body.url;
    const html = body.html;
    const token = body.token;

    let pdf;

    if (url) {
      pdf = await this.generatePdfFromUrlService.call(url, token);
    } else if (html) {
      pdf = await this.generatePdfFromHtmlService.call(html, token);
    } else {
      return res.status(400).send('Missing URL or HTML');
    }

    if (!pdf) {
      return res.status(400).send('Invalid URL or HTML');
    }

    return res.status(201).contentType('application/pdf').send(pdf);
  }
}
