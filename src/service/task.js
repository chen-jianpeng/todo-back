import mongoose from "mongoose";
import { logger } from "../lib/log4";
import Response from "../lib/response";

const Task = mongoose.model("Task");
const TaskList = mongoose.model("TaskList");
const SubTask = mongoose.model("SubTask");

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
    const tasks = await Task.find(query);
    return new Response(2000, tasks);
  },

  /**
   * 根据ID查询
   *
   * @param {*} uid
   * @returns
   */
  async getById(uid) {
    const task = await Task.findById(uid)
      .populate("subTasks")
      .populate("attachment")
      .populate("comments")
      .populate("activities")
      .populate("executor")
      .populate("follower")
      .populate("creator");
    return new Response(2000, task);
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
      let task = new Task(params);
      let taskRes = await task.save();
      await TaskList.findByIdAndUpdate(params.taskList, {
        $addToSet: { tasks: [taskRes._id] }
      });

      await session.commitTransaction();
      session.endSession();

      return new Response(2000, taskRes);
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
    const task = await Task.findByIdAndUpdate(id, params, options);
    return new Response(2000, task);
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
      let task = await Task.findById(id);

      if (!task) {
        return new Response(4001);
      }

      // 删除子任务
      await SubTask.findOneAndRemove({
        _id: { $in: task.subTasks || [] }
      });
      // 删除任务
      const removedTask = await new Task(task).remove();
      // 删除清单中的任务
      await TaskList.findByIdAndUpdate(task.taskList, {
        $pull: { tasks: { $in: [task._id] } }
      });

      await session.commitTransaction();
      session.endSession();
      return new Response(2000, removedTask);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      logger.error(error);
      return new Response(5000, error.message);
    }
  }
};
