type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLog(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }
    
    // Envoyer à Supabase si c'est une erreur
    if (entry.level === 'error') {
      this.persistError(entry);
    }
  }

  private async persistError(entry: LogEntry) {
    try {
      const { error } = await supabase
        .from('error_logs')
        .insert([{
          level: entry.level,
          message: entry.message,
          data: entry.data,
        }]);

      if (error) {
        console.error('Failed to persist error log:', error);
      }
    } catch (e) {
      console.error('Failed to persist error log:', e);
    }
  }

  info(message: string, data?: any) {
    const entry = this.formatLog('info', message, data);
    this.addLog(entry);
    console.info(`[INFO] ${message}`, data);
  }

  warn(message: string, data?: any) {
    const entry = this.formatLog('warn', message, data);
    this.addLog(entry);
    console.warn(`[WARN] ${message}`, data);
  }

  error(message: string, error?: any) {
    const entry = this.formatLog('error', message, error);
    this.addLog(entry);
    console.error(`[ERROR] ${message}`, error);
  }

  debug(message: string, data?: any) {
    const entry = this.formatLog('debug', message, data);
    this.addLog(entry);
    console.debug(`[DEBUG] ${message}`, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();