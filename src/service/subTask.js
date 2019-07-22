import mongoose from "mongoose";
import { logger } from "../lib/log4";
import Response from "../lib/response";

const SubTask = mongoose.model("SubTask");
const Task = mongoose.model("Task");

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
    const subTasks = await SubTask.find(query);
    return new Response(2000, subTasks);
  },

  /**
   * 根据ID查询
   *
   * @param {*} id
   * @returns
   */
  async getById(id) {
    const subTask = await SubTask.findById(id).populate("creator");
    return new Response(2000, subTask);
  },

  /**
   * 保存
   *
   * @param {*} params
   */
  async save(params) {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      let subTask = new SubTask(params);
      let subTaskRes = await subTask.save();

      await Task.findByIdAndUpdate(params.task, {
        $addToSet: { subTasks: [subTaskRes._id] }
      });

      await session.commitTransaction();
      session.endSession();

      return new Response(2000, subTaskRes);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return new Response(5000, error);
    }
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
    const subTask = await SubTask.findByIdAndUpdate(id, params, options);
    return new Response(2000, subTask);
  },

  /**
   * 根据id删除
   *
   * @param {String} id
   * @returns
   */
  async delete(id) {
    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
      let subTask = await SubTask.findById(id);

      if (!subTask) {
        return new Response(4004);
      }

      // 删除子任务
      const removedSubTask = await new SubTask(subTask).remove();
      // 删除任务中的子任务
      await Task.findByIdAndUpdate(subTask.task, {
        $pull: { subTasks: { $in: [subTask._id] } }
      });

      await session.commitTransaction();
      session.endSession();
      return new Response(2000, removedSubTask);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      logger.error(error);
      return new Response(5000, error.message);
    }
  }
};
