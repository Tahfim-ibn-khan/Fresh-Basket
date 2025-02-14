import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as express from "express";
import * as path from "path";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Handle multiple allowed origins (useful for production & development environments)
  const allowedOrigins = process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(",")
    : ["http://localhost:3001"];

  app.enableCors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  console.log(`✅ CORS Configured for: ${allowedOrigins.join(", ")}`);

  // Serve static profile pictures
  app.use(
    "/uploads/profile_pictures",
    express.static(path.join(__dirname, "..", "uploads/profile_pictures"))
  );

  // Ensure PORT is correctly parsed
  const port = parseInt(process.env.PORT, 10) || 3000;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
