import express from 'express';
import util from 'util';
import router from '../app/router/router.js';

/**
 * 创建并配置Express应用
 * @returns {Express.Application} 配置好的Express应用实例
 */
export default function createApp() { // 更有语义化的函数名
  const app = express(); // 使用const声明常量,var已过时

  // 将异步监听方法Promise化,方便使用async/await
  app.listenAsync = util.promisify(app.listen);

  // 配置中间件
  // 解析JSON请求体,限制大小为10mb避免恶意请求
  app.use(express.json({ limit: '10mb' }));

  // 解析URL编码的请求体,同样限制大小
  app.use(express.urlencoded({
    extended: true, // 使用qs库解析复杂对象
    limit: '10mb'
  }));

  // 添加通用错误处理中间件
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      code: 500,
      msg: 'Internal Server Error'
    });
  });

  // 注册路由
  router(app);

  return app;
}