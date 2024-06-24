import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeneratePdfFromHtmlService } from './html.service';
import { GeneratePdfFromUrlService } from './url.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    GeneratePdfFromUrlService,
    GeneratePdfFromHtmlService,
  ],
})
export class AppModule {}
