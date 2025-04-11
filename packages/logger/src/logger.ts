import { pino } from "pino";
import { err as serializeError } from "pino-std-serializers";
import { z } from "zod";
export const logger: Logger = pino();

/**
 * Available logging levels in order of priority (highest to lowest).
 * 'silent' is a special level that suppresses all logs.
 */
export const LOGGER_LEVELS = [
	"error",
	"warn",
	"info",
	"debug",
	"trace",
] as const;

export const LoggerLevel = z.enum(LOGGER_LEVELS);
export type LoggerLevel = z.infer<typeof LoggerLevel>;

/**
 * Represents a logging function that can accept various parameter combinations:
 * - Object with optional message and arguments
 * - Message string with optional arguments
 * - Any value with optional message and arguments
 */
type LogFn = {
	<T extends object>(obj: T, msg?: string, ...args: unknown[]): void;
	(obj: unknown, msg?: string, ...args: unknown[]): void;
	(msg: string, ...args: unknown[]): void;
};

/**
 * Logger interface that provides logging methods and utility functions.
 * This is a simplified version of pino.Logger to avoid direct type dependencies.
 */
export type Logger = {
	/** Log at error level - error conditions */
	error: LogFn;
	/** Log at warn level - warning conditions */
	warn: LogFn;
	/** Log at info level - informational messages */
	info: LogFn;
	/** Log at debug level - debug messages */
	debug: LogFn;
	/** Log at trace level - trace messages */
	trace: LogFn;

	/**
	 * Creates a child logger with additional context
	 * @param bindings - Key-value pairs to be included in all log messages
	 * @param options - Optional configuration for the child logger
	 */
	child: (
		bindings: Record<string, unknown>,
		options?: {
			level?: LoggerLevel;
			redact?: string[];
			msgPrefix?: string;
		},
	) => Logger;

	/**
	 * Updates the bindings on the current logger instance
	 * @param bindings - New key-value pairs to be included in all log messages
	 */
	setBindings: (bindings: Record<string, unknown>) => void;
};

/**
 * Creates a new logger instance with the specified configuration
 * @param config - Logger configuration options
 * @returns Configured logger instance
 */
export const createLogger = (config: {
	name: string;
	level?: LoggerLevel;
}): Logger => {
	return pino({
		name: config.name,
		browser: {
			asObject: true,
		},
		level: config.level ?? "info",
		serializers: {
			err: serializeError,
			error: serializeError,
		},
	});
};

/**
 * Creates a utility for measuring and logging execution times
 * @param logger - Logger instance to use for timing logs
 * @returns Object with time and timeEnd methods
 *
 * @example
 * ```typescript
 * const timer = createLogTimer(logger);
 * timer.time('operation');
 * // ... some operation
 * timer.timeEnd('operation'); // logs the time taken
 * ```
 */
export const createLogTimer = (logger: Logger) => {
	const timers: Record<string, number> = {};

	return {
		/**
		 * Starts timing an operation
		 * @param name - Identifier for the timer
		 */
		time: (name: string) => {
			timers[name] = Date.now();
		},

		/**
		 * Ends timing an operation and logs the duration
		 * @param name - Identifier for the timer
		 */
		timeEnd: (name: string) => {
			const timer = timers[name];

			if (timer) {
				logger.debug({ msg: `Timer ${name}`, time: Date.now() - timer });
				delete timers[name];
			}
		},
	};
};

export type LogTimer = ReturnType<typeof createLogTimer>;