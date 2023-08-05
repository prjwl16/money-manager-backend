import winston from 'winston';

const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    );

const logger = winston.createLogger({
    format: logFormat,
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error', handleExceptions:true }),
        new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
        new winston.transports.File({ filename: 'logs/exceptions.log', level: 'exceptions'}),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
    exitOnError: false
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger
        .clear()
        .add(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }));
}

export default logger;