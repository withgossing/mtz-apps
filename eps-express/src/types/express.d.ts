import { UserType } from "./user.types";

declare global {
  namespace Express {
    export interface Request {
      logged?: boolean;
      user?: {
        userId: string;
        authLevel: UserType;
        deptCode: string;
      };
    }
  }
}

export {};
