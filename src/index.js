// 解决使用import、export
import Koa from "koa";
import cors from "koa2-cors";
import R from "ramda";
import chalk from "chalk";
import { connect, initSchema } from "./database/init";
import { resolve } from "path";
import general from "./middleware/general";

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

  const port = 17442;

  await useMiddlewares(app);

  app.listen(port, () => {
    console.log(`Open ${chalk.green("http://localhost:" + port)}`);
  });
})();
