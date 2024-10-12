import { DocumentBuilder } from "@nestjs/swagger";

export class BaseAPIDocument {
  public builder = new DocumentBuilder();

  public initializeOptions() {
    return this.builder
      .setTitle("API document")
      .setDescription("API document.")
      .setVersion("1.0.0")
      .build();
  }
}
