/**
 * Centralized logging utility for microservices
 * Provides consistent logging across all services
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  TRACE = 4
}

export interface LogContext {
  service?: string;
  requestId?: string;
  userId?: string;
  method?: string;
  path?: string;
  duration?: number;
  [key: string]: any;
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
}

class Logger {
  private level: LogLevel;
  private serviceName: string;
  private context: LogContext = {};

  constructor(serviceName: string = 'unknown', level: LogLevel = LogLevel.INFO) {
    this.serviceName = serviceName;
    this.level = level;
  }

  /**
   * Set the log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Set the service name
   */
  setServiceName(name: string): void {
    this.serviceName = name;
  }

  /**
   * Format log entry for output
   */
  private formatLog(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    const errorStr = entry.error ? `\n${entry.error.stack}` : '';

    return `[${timestamp}] [${levelName}] [${this.serviceName}] ${entry.message}${contextStr}${errorStr}`;
  }

  /**
   * Write log entry if level is enabled
   */
  private writeLog(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (level <= this.level) {
      const entry: LogEntry = {
        timestamp: new Date(),
        level,
        message,
        context,
        error
      };

      const formattedLog = this.formatLog(entry);

      switch (level) {
        case LogLevel.ERROR:
          console.error(formattedLog);
          break;
        case LogLevel.WARN:
          console.warn(formattedLog);
          break;
        case LogLevel.INFO:
          console.info(formattedLog);
          break;
        case LogLevel.DEBUG:
        case LogLevel.TRACE:
          console.debug(formattedLog);
          break;
      }
    }
  }

  /**
   * Log error message
   */
  error(message: string, context?: LogContext, error?: Error): void {
    this.writeLog(LogLevel.ERROR, message, context, error);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    this.writeLog(LogLevel.WARN, message, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    this.writeLog(LogLevel.INFO, message, context);
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: LogContext): void {
    this.writeLog(LogLevel.DEBUG, message, context);
  }

  /**
   * Log trace message
   */
  trace(message: string, context?: LogContext): void {
    this.writeLog(LogLevel.TRACE, message, context);
  }

  /**
   * Create a child logger with additional context
   */
  child(additionalContext: LogContext): Logger {
    const childLogger = new Logger(this.serviceName, this.level);
    childLogger.context = { ...this.context, ...additionalContext };
    return childLogger;
  }

  /**
   * Log HTTP request
   */
  logRequest(method: string, path: string, statusCode: number, duration: number, context?: LogContext): void {
    const level = statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const message = `${method} ${path} - ${statusCode} - ${duration}ms`;
    
    this.writeLog(level, message, {
      method,
      path,
      statusCode,
      duration,
      ...context
    });
  }

  /**
   * Log database operation
   */
  logDatabase(operation: string, collection: string, duration: number, context?: LogContext): void {
    this.info(`Database ${operation} on ${collection} - ${duration}ms`, {
      operation,
      collection,
      duration,
      ...context
    });
  }

  /**
   * Log external service call
   */
  logExternalService(service: string, operation: string, duration: number, success: boolean, context?: LogContext): void {
    const level = success ? LogLevel.INFO : LogLevel.ERROR;
    const message = `External service ${service} ${operation} - ${duration}ms - ${success ? 'SUCCESS' : 'FAILED'}`;
    
    this.writeLog(level, message, {
      service,
      operation,
      duration,
      success,
      ...context
    });
  }

  /**
   * Log event publishing
   */
  logEventPublish(eventType: string, eventId: string, context?: LogContext): void {
    this.info(`Event published: ${eventType}`, {
      eventType,
      eventId,
      action: 'publish',
      ...context
    });
  }

  /**
   * Log event consumption
   */
  logEventConsume(eventType: string, eventId: string, context?: LogContext): void {
    this.info(`Event consumed: ${eventType}`, {
      eventType,
      eventId,
      action: 'consume',
      ...context
    });
  }
}

// Create default logger instance
export const logger = new Logger();

// Export logger factory
export const createLogger = (serviceName: string, level?: LogLevel): Logger => {
  return new Logger(serviceName, level);
};

// Export default logger instance
export default logger; 