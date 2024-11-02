import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ description: "사용자 ID" })
  userId: string;

  @ApiProperty({ description: "사용자 이름" })
  userName: string;

  @ApiProperty({ description: "사용자 비밀번호" })
  password: string;

  @ApiProperty({ description: "사용자 이메일주소" })
  email: string;
}
