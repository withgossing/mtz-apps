import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { BankService } from "./bank.service";
import { CreateBankDto } from "./dto/create-bank.dto";
import { UpdateBankDto } from "./dto/update-bank.dto";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("bank-api")
@Controller("bank")
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @ApiOperation({ summary: "은행 등록", description: "은행의 기본정보 등록" })
  @ApiBody({ type: CreateBankDto })
  @ApiResponse({ status: 201, description: "은행 등록에 성공하였습니다." })
  @ApiResponse({ status: 404, description: "은행 등록에 실패하였습니다." })
  @Post()
  create(@Body() createBankDto: CreateBankDto) {
    return this.bankService.create(createBankDto);
  }

  @ApiOperation({
    summary: "은행 목록 조회",
    description: "은행의 전체 목록 조회",
  })
  @ApiResponse({ status: 201, description: "은행 목록 조회에 성공하였습니다." })
  @ApiResponse({ status: 404, description: "은행 목록 조회에 실패하였습니다." })
  @Get()
  findAll() {
    return this.bankService.findAll();
  }

  @ApiOperation({ summary: "은행 단건 조회", description: "은행의 단건 조회" })
  @ApiResponse({ status: 201, description: "은행 단건 조회에 성공하였습니다." })
  @ApiResponse({ status: 404, description: "은행 단건 조회에 실패하였습니다." })
  @Get(":bankCode")
  findOne(@Param("bankCode") bankCode: string) {
    return this.bankService.findOne(bankCode);
  }

  @ApiOperation({ summary: "은행 수정", description: "은행의 기본정보 수정" })
  @ApiBody({ type: UpdateBankDto })
  @ApiResponse({ status: 201, description: "은행 수정에 성공하였습니다." })
  @ApiResponse({ status: 404, description: "은행 수정에 실패하였습니다." })
  @Patch(":bankCode")
  update(
    @Param("bankCode") bankCode: string,
    @Body() updateBankDto: UpdateBankDto
  ) {
    return this.bankService.update(bankCode, updateBankDto);
  }

  @ApiOperation({ summary: "은행 삭제", description: "은행의 삭제" })
  @ApiResponse({ status: 201, description: "은행 삭제에 성공하였습니다." })
  @ApiResponse({ status: 404, description: "은행 삭제에 실패하였습니다." })
  @Delete(":bankCode")
  remove(@Param("bankCode") bankCode: string) {
    return this.bankService.remove(bankCode);
  }
}
