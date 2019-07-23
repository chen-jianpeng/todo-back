// 解决使用import、export
import Koa from "koa";
import cors from "koa2-cors";
import R from "ramda";
import chalk from "chalk";
import { connect, initSchema } from "./database/init";
import { resolve } from "path";
import general from "./middleware/general";
import { logger } from "./lib/log4";
import config from "./config";

const MIDDLEWARES = ["router"];

const useMiddlewares = app => {
  R.map(
    R.compose(
      R.forEachObjIndexed(e => e(app)),
      require,
      name => resolve(__dirname, `./middleware/${name}`)
    )
  )(MIDDLEWARES);
};

(async () => {
  await connect();
  initSchema();

  const app = new Koa();
  app.use(cors());

  general(app);

  await useMiddlewares(app);

  app.listen(config.port, () => {
    logger.info(`Open ${chalk.green("http://localhost:" + config.port)}`);
  });
})();
