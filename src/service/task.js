import mongoose from "mongoose";
import { logger } from "../lib/log4";
import Response from "../lib/response";
import ActivityService from "../service/activity";

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
   * @param {*} id
   * @returns
   */
  async getById(id) {
    const task = await Task.findById(id)
      .populate("subTasks")
      .populate("attachments")
      .populate("comments")
      .populate("activities")
      .populate("executors")
      .populate("followers")
      .populate("creator");
    return new Response(2000, task);
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
  async update(id, data, user) {
    let options = {
      runValidators: true,
      new: true
    };

    try {
      let oldObj = await Task.findById(id);
      if (!oldObj) {
        return new Response(4004, id);
      }

      // 增加活动记录
      let res = await ActivityService.save(oldObj, data, "update", user);
      let activities = res.map(item => item._id);

      // 更新任务
      let params = {
        $addToSet: { activities }
      };
      Object.assign(params, data);
      let newObj = await Task.findByIdAndUpdate(id, params, options);

      return new Response(2000, newObj);
    } catch (error) {
      logger.error(error);
      return new Response(5000, error);
    }
  },

  async updateSubTask(id, subTasks, isInsert = true) {
    let options = {
      runValidators: true,
      new: true
    };

    try {
      let beforeTask = await Task.findById(id);
      let afterTask;
      if (isInsert) {
        afterTask = await new Task(beforeTask).update({
          $pull: { subTasks: { $in: subTasks } }
        });
      } else {
        afterTask = await new Task(beforeTask).update({ subTasks }, options);
      }

      await ActivityService.save(beforeTask, subTasks);

      return new Response(2000, afterTask);
    } catch (error) {
      logger.error(error);
      return new Response(5000, error);
    }
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
        return new Response(4004);
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
