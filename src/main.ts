import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as express from "express";
import * as path from "path";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const allowedOrigins ='https://freshbasket-frontend.vercel.app';

  app.enableCors({
    origin: allowedOrigins.split(","),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  app.use(
    "/uploads/profile_pictures",
    express.static(path.join(__dirname, "..", "uploads/profile_pictures"))
  );

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
