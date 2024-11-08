import express from 'express';
import UserControl from '../controllers/UserControl.js';

/**
 * 路由配置模块
 * 使用express.Router()创建模块化、可挂载的路由处理
 */
const router = express.Router();

/**
 * 配置应用路由
 * @param {express.Application} app - Express应用实例
 */
export default function configureRoutes(app) {
  // 用户相关路由
  router.post('/user/login', UserControl.login);      // 登录接口 
  router.post('/user/register', UserControl.register); // 注册接口
  router.get('/user/info', UserControl.getUserInfo);  // 获取用户信息接口

  // 统一添加路由前缀
  // 所有路由都会加上/api前缀,如/api/user/login
  app.use('/api', router);

  // 添加404错误处理
  app.use((req, res) => {
    res.status(404).json({
      code: 404,
      msg: '接口不存在'
    });
  });
}
