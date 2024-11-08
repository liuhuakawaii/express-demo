// 使用 winston 记录日志
import winston from 'winston';
import path from 'path';
import fs from 'fs';

// 确保日志目录存在
const logDir = './logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 定义日志级别
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

// 自定义日志格式
// 添加了错误堆栈跟踪和请求ID支持
const myFormat = winston.format.printf(({ level, message, timestamp, stack, requestId }) => {
  let log = `${timestamp} ${level.toUpperCase()}: `;
  // 如果有请求ID则添加
  if (requestId) {
    log += `[${requestId}] `;
  }
  log += message;
  // 如果有错误堆栈则添加
  if (stack) {
    log += `\n${stack}`;
  }
  return log;
});

// 创建 logger 实例
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info', // 从环境变量读取日志级别
  levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss' // 自定义时间格式
    }),
    winston.format.errors({ stack: true }), // 支持错误堆栈
    winston.format.splat(), // 支持字符串插值
    winston.format.json(), // 支持JSON格式
    myFormat
  ),
  transports: [
    // 控制台输出
    new winston.transports.Console({
      format: winston.format.colorize({ all: true }) // 控制台彩色输出
    }),
    // 普通日志文件
    new winston.transports.File({
      filename: path.join(logDir, 'app.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5, // 最多保留5个文件
      tailable: true
    }),
    // 错误日志单独存储
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// 开发环境下打印更详细的日志
if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug';
}

export default logger;