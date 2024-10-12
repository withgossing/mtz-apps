import { ApiProperty } from "@nestjs/swagger";

export class CreateBankDto {
  @ApiProperty({ description: "은행코드" })
  bankCode: string;

  @ApiProperty({ description: "은행명" })
  bankName: string;

  @ApiProperty({ description: "은행 설명" })
  description: string;
}
