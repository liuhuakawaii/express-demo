// 导入必要的模块
import myexpress from './config/myexpress.js';
import logger from './utils/logger.js';

// 创建Express应用实例
const app = myexpress();

// 从环境变量获取端口号,如果没有则使用默认值3001
const port = process.env.PORT || 3001;

// 优雅地处理服务器启动
app.listenAsync(port)
  .then(() => {
    logger.info(`Server is running on port ${port}`);
  })
  .catch(error => {
    // 添加错误处理,记录启动失败原因
    logger.error(`Failed to start server: ${error.message}`);
    // 优雅退出进程
    process.exit(1);
  });

// 添加进程异常处理
process.on('uncaughtException', error => {
  logger.error(`Uncaught Exception: ${error.message}`);
  // 给服务器一些时间处理当前请求后再关闭
  setTimeout(() => process.exit(1), 1000);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
