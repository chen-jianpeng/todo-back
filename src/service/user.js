import mongoose from "mongoose";

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
    let user = new User(params);
    let res = await user.save();
    return res;
  }
};
