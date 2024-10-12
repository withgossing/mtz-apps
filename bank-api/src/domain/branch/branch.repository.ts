import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Branch } from "./entities/branch.entity";

@Injectable()
export class BranchRepository extends Repository<Branch> {}
