import koaBody from "koa-body";
import { accessLogger, logger } from "../lib/log4";
import session from "koa-session";
import jwtKoa from "koa-jwt";
import response from "../lib/response";

const addBodyParser = app => {
  app.use(
    koaBody({
      multipart: true,
      formidable: {
        maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
      }
    })
  );
};

const addLog4 = app => {
  app.use(accessLogger());
  app.on("error", err => {
    logger.error(err);
  });
};

const addSession = app => {
  app.keys = ["imooc-trailer"];

  const CONFIG = {
    key: "koa:sess" /** (string) cookie key (default is koa:sess) */,
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 3600000,
    overwrite: true /** (boolean) can overwrite or not (default true) */,
    httpOnly: false /** (boolean) httpOnly or not (default true) */,
    signed: true /** (boolean) signed or not (default true) */,
    rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
  };
  app.use(session(CONFIG, app));
};

const addLoginFilter = app => {
  app.use((ctx, next) => {
    return next().catch(err => {
      if (err.status === 401) {
        ctx.status = 401;
        ctx.body = new response(
          4001,
          err.originalError ? err.originalError.message : err.message
        );
      } else {
        throw err;
      }
    });
  });

  app.use(
    jwtKoa({ secret: "jwt:secret" }).unless({
      path: [/^\/api\/user\/login/, /^\/api\/user\/register/, /^((?!\/api).)*$/]
    })
  );
};

export default app => {
  addBodyParser(app);
  addLog4(app);
  addSession(app);
  addLoginFilter(app);
};
