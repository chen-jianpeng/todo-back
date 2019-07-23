import mongoose from "mongoose";
import { logger } from "../lib/log4";
import Response from "../lib/response";
import taskService from "./task";

const Comment = mongoose.model("Comment");

export default {
  /**
   * 根据ID查询
   *
   * @param {*} id
   * @returns
   */
  async getById(id) {
    const comment = await Comment.findById(id);
    return new Response(2000, comment);
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
      let comment = new Comment(params);
      let commentRes = await comment.save();

      let data = { comments: [commentRes._id] };

      await taskService.updateList(params.task, data, "create", user);

      await session.commitTransaction();
      session.endSession();

      return new Response(2000, commentRes);
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
    const comment = await Comment.findByIdAndUpdate(id, params, options);
    return new Response(2000, comment);
  },

  /**
   * 根据id删除
   *
   * @param {String} id
   * @returns
   */
  async delete(id) {
    try {
      let comment = await Comment.findById(id);

      if (!comment) {
        return new Response(4004);
      }

      if (comment.taskLists && comment.taskLists.length > 0) {
        return new Response(4002);
      }

      const removedComment = await new Comment(comment).remove();
      return new Response(2000, removedComment);
    } catch (error) {
      logger.error(error);
      return new Response(5000, error.message);
    }
  }
};
