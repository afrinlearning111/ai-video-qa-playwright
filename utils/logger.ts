/**
 * Minimal structured logger for tests. Avoids pulling in Winston/Pino
 * and prints test-friendly, grep-able lines.
 */
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export class Logger {
  private readonly context: string;

  constructor(context: string) {
    this.context = context;
  }

  private write(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    // eslint-disable-next-line no-console
    console.log(`[${timestamp}] [${level}] [${this.context}] ${message}${metaStr}`);
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.write('INFO', message, meta);
  }
  warn(message: string, meta?: Record<string, unknown>): void {
    this.write('WARN', message, meta);
  }
  error(message: string, meta?: Record<string, unknown>): void {
    this.write('ERROR', message, meta);
  }
  debug(message: string, meta?: Record<string, unknown>): void {
    if (process.env.DEBUG === '1') {
      this.write('DEBUG', message, meta);
    }
  }
}
