import mongoose from "mongoose";
import { logger } from "../lib/log4";
import Response from "../lib/response";

const TaskList = mongoose.model("TaskList");
const Project = mongoose.model("Project");

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
    const taskLists = await TaskList.find(query);
    return new Response(2000, taskLists);
  },

  /**
   * 根据ID查询
   *
   * @param {*} uid
   * @returns
   */
  async getById(uid) {
    const taskList = await TaskList.findById(uid)
      .populate("project")
      .populate("tasks")
      .populate("creator");
    return new Response(2000, taskList);
  },

  /**
   * 保存
   *
   * @param {*} params
   */
  async save(params, user) {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      params.creator = user._id;
      let taskList = new TaskList(params);
      let taskListRes = await taskList.save();
      await Project.findByIdAndUpdate(params.project, {
        $addToSet: { taskLists: [taskListRes._id] }
      });

      await session.commitTransaction();
      session.endSession();

      return new Response(2000, taskListRes);
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
    const taskList = await TaskList.findByIdAndUpdate(id, params, options);
    return new Response(2000, taskList);
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
      let taskList = await TaskList.findById(id);

      if (!taskList) {
        return new Response(4004);
      }

      if (taskList.tasks && taskList.tasks.length > 0) {
        return new Response(4002);
      }

      const removedTaskList = await new TaskList(taskList).remove();

      await Project.findByIdAndUpdate(taskList.project, {
        $pull: { taskLists: { $in: [taskList._id] } }
      });

      await session.commitTransaction();
      session.endSession();

      return new Response(2000, removedTaskList);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      logger.error(error);
      return new Response(5000, error.message);
    }
  }
};
