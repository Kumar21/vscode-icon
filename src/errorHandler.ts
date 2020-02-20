export class ErrorHandler {
  public static logError(error: Error, handled = false): void {
    console.error(
      `${handled ? 'H' : 'Unh'}andled Error: ${error.stack ||
        error.message ||
        error}`,
    );
  }
}
