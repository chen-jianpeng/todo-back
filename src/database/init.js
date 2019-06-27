const mongoose = require("mongoose");
const glob = require("glob");
const { resolve } = require("path");

const db = "mongodb://localhost/todo";

const MAXCONNECTTIMES = 5;

mongoose.Promise = global.Promise;

// 解决告警问题
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

exports.initSchema = () => {
  glob.sync(resolve(__dirname, "./schema", "**/*.js")).forEach(require);
};

exports.connect = () => {
  let connectTimes = 0;

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== "production") {
      mongoose.set("debug", true);
    }

    mongoose.connect(db);

    mongoose.connection.on("disconnected", err => {
      if (++connectTimes < MAXCONNECTTIMES) {
        mongoose.connect(db);
      } else {
        reject();
        throw err;
      }
    });

    mongoose.connection.on("error", err => {
      if (++connectTimes < MAXCONNECTTIMES) {
        mongoose.connect(db);
      } else {
        reject();
        throw err;
      }
    });

    mongoose.connection.on("open", () => {
      resolve();
    });
  });
};
