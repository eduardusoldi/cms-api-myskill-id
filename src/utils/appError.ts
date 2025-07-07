export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Maintains proper stack trace (only in V8 engines)
    Error.captureStackTrace(this, this.constructor);
  }
}
