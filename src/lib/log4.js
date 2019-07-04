import path from "path";
import log4js from "koa-log4";

log4js.configure({
  appenders: {
    access: {
      type: "dateFile",
      pattern: "-yyyy-MM-dd.log", //生成文件的规则
      filename: path.join("logs/", "access.log") //生成文件名
    },
    application: {
      type: "dateFile",
      pattern: "-yyyy-MM-dd.log",
      filename: path.join("logs/", "application.log")
    },
    out: {
      type: "console"
    }
  },
  categories: {
    default: { appenders: ["out"], level: "info" },
    access: { appenders: ["access", "out"], level: "info" },
    application: { appenders: ["application", "out"], level: "WARN" }
  }
});

export const accessLogger = () => log4js.koaLogger(log4js.getLogger("access"));
export const logger = log4js.getLogger("application");
