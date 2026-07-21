import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder } from "node_modules/@nestjs/swagger/dist/document-builder";
import { SwaggerModule } from "node_modules/@nestjs/swagger/dist/swagger-module";
import cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";

async function start() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Maxim API")
    .setDescription("API for managing users")
    .setVersion("1.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: `${process.env.FRONT_URL}`,
    credentials: true,
  });
  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start();
