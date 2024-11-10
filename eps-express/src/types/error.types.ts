export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export interface ErrorResponse {
  status: "error" | "fail";
  message: string;
  code?: string;
  details?: unknown;
}

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

export const isTypeORMError = (
  error: unknown
): error is Error & { code: string } => {
  return error instanceof Error && "code" in error;
};
