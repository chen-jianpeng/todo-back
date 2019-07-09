import mongoose from "mongoose";
import { logger } from "../lib/log4";
import Response from "../lib/response";

const Activity = mongoose.model("Activity");

export default {
  /**
   * 根据条件查询
   *
   * @param {*} name
   * @returns
   */
  async getByQuery(name) {
    let query = {};
    if (name) {
      query.name = name;
    }
    const activitys = await Activity.find(query);
    return new Response(2000, activitys);
  },

  /**
   * 根据ID查询
   *
   * @param {*} id
   * @returns
   */
  async getById(id) {
    const activity = await Activity.findById(id)
      .populate("taskLists")
      .populate("attachments")
      .populate("creator");
    return new Response(2000, activity);
  },

  /**
   * 保存
   *
   * @param {*} params
   */
  async save(params) {
    let activity = new Activity(params);
    let res = await activity.save();
    return new Response(2000, res);
  },

  /**
   *  更新
   *
   * @param {String} id
   * @param {Object} params
   * @returns
   */
  async update(id, params) {
    let options = {
      runValidators: true,
      new: true
    };
    const activity = await Activity.findByIdAndUpdate(id, params, options);
    return new Response(2000, activity);
  },

  /**
   * 根据id删除
   *
   * @param {String} id
   * @returns
   */
  async delete(id) {
    try {
      let activity = await Activity.findById(id);

      if (!activity) {
        return new Response(4001);
      }

      if (activity.taskLists && activity.taskLists.length > 0) {
        return new Response(4002);
      }

      const removedActivity = await new Activity(activity).remove();
      return new Response(2000, removedActivity);
    } catch (error) {
      logger.error(error);
      return new Response(5000, error.message);
    }
  }
};
