/*
 * 有关于密码加，锁定登录的相关资料请参考下面的连接
 * https://www.mongodb.com/blog/search/bcrypt
 */

const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;
const bcrypt = require("bcrypt");

const SALT_WORK_FACTOR = 10; // 密码加密权重值。越大越复杂，但会影响性能能。
const MAX_LOGIN_ATTEMPTS = 5; // 最大错误次数
const LOCK_TIME = 2 * 60 * 60 * 1000; // 登陆锁定时间

const UserSchema = new Schema({
  userName: {
    unique: true,
    require: true,
    type: String
  },
  phone: {
    unique: true,
    require: true,
    type: String
  },
  email: {
    unique: true,
    require: true,
    type: String
  },
  avatar: {
    type: ObjectId,
    ref: "attachment"
  },
  password: {
    unique: true,
    type: String
  },
  inLoginAttempts: {
    type: Number,
    require: true,
    default: 0
  },

  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
});

UserSchema.virtual("isLocked").get(() => {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.pre("save", function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }
  next();
});

// 密码加密
UserSchema.pre("save", function(next) {
  if (!this.isModified("password")) return next;
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
    });
  });
  next();
});

// 密码是否正确
UserSchema.methods = {
  comparePassword: function(_password, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch);
        else reject(err);
      });
    });
  },

  // 超过登录次数限制后将锁定登陆
  incLoginAttempts: function() {
    return new Promise((resolve, reject) => {
      if (this.lockUntil && this.lockUntil < Date.now()) {
        // 锁定但已超过锁定时间限制
        this.update(
          {
            $set: {
              loginAttempts: 1
            },
            $unset: {
              lockUntil: 1
            }
          },
          err => {
            if (!err) resolve(true);
            reject(err);
          }
        );
      } else {
        let updates = {
          $inc: {
            loaginAttempts: 1
          }
        };
        if (this.inLoginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
          updates.$set = {
            lockUntil: Date.now() + LOCK_TIME
          };
        }
        this.update(updates, err => {
          if (!err) resolve(true);
          reject(err);
        });
      }
    });
  }
};

model("User", UserSchema);
