import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateBankDto } from "./dto/create-bank.dto";
import { UpdateBankDto } from "./dto/update-bank.dto";
import { InjectRepository } from "@nestjs/typeorm";

import { Bank } from "./entities/bank.entity";
import { BankRepository } from "./bank.repository";

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: BankRepository
  ) {}

  /**
   * 은행 생성
   * @param createBankDto
   * @returns
   */
  async create(createBankDto: CreateBankDto): Promise<Bank> {
    const { bankCode, bankName, description } = createBankDto;
    const bank = await this.bankRepository.save({
      bankCode: bankCode,
      bankName: bankName,
      description: description,
    });
    return bank;
  }

  /**
   * 은행 목록 조회
   * @returns
   */
  async findAll() {
    return this.bankRepository.find();
  }

  /**
   * 은행 단건 조회
   * @param bankCode
   * @returns
   */
  async findOne(bankCode: string) {
    const bank = await this.bankRepository.findOne({
      where: { bankCode: bankCode },
    });
    if (!bank) throw new NotFoundException();
    return bank;
  }

  /**
   * 은행 수정
   * @param bankCode
   * @param updateBankDto
   * @returns
   */
  async update(bankCode: string, updateBankDto: UpdateBankDto) {
    const { bankName, description } = updateBankDto;
    const result = await this.bankRepository.update(
      { bankCode: bankCode },
      {
        bankName: bankName,
        description: description,
      }
    );
    return result.affected ? true : false;
  }

  /**
   * 은행 삭제
   * @param bankCode
   * @returns
   */
  async remove(bankCode: string) {
    const result = await this.bankRepository.softDelete({
      bankCode: bankCode,
    });
    return result.affected ? true : false;
  }
}
