import mongoose from "mongoose";
import { logger } from "../lib/log4";
import Response from "../lib/response";
import jwt from "jsonwebtoken";

const User = mongoose.model("User");

export default {
  /**
   * 查询用户
   *
   * @param {Object} query
   * @returns Array
   */
  async getUsers(query) {
    const users = await User.find(query);
    return users;
  },

  /**
   * 根据ID查询用户
   *
   * @param {String} uid
   * @returns Object
   */
  async getUserById(uid) {
    const user = await User.findById(uid);
    return user;
  },

  /**
   * 保存用户
   *
   * @param {Object} params
   */
  async saveUser(params) {
    try {
      let user = new User(params);
      let res = await user.save();
      res.password = "";
      return new Response(2000, res);
    } catch (error) {
      logger.error(error);
      return new Response(5000, error);
    }
  },

  async login({ email, password }) {
    try {
      let match = false;
      const user = await User.findOne({ email: email }).exec();
      if (user) {
        match = await user.comparePassword(password, user.password);
      }

      if (match) {
        let { email, password } = user;
        let payload = { email, password };
        const secret = "jwt:secret";
        const token = jwt.sign(payload, secret, { expiresIn: "3600000ms" });

        let res = { token };
        Object.assign(res, user.toObject());
        delete res.password;
        delete res.inLoginAttempts;

        return new Response(2000, res);
      } else {
        return new Response(4003);
      }
    } catch (error) {
      logger.error(error);
      return new Response(5000, error);
    }
  }
};
