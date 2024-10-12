import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { BaseAPIDocument } from "./configs/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger
  const config = new BaseAPIDocument().initializeOptions();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-doc", app, document);

  await app.listen(3000);
}
bootstrap();
