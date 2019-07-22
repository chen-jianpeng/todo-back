import mongoose from "mongoose";
import { logger } from "../lib/log4";
import Response from "../lib/response";
import upload from "../lib/upload";

const Attachment = mongoose.model("Attachment");

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
    const attachments = await Attachment.find(query);
    return new Response(2000, attachments);
  },

  /**
   * 根据ID查询
   *
   * @param {*} id
   * @returns
   */
  async getById(id) {
    const attachment = await Attachment.findById(id)
      .populate("project")
      .populate("task")
      .populate("comment")
      .populate("creator");
    return new Response(2000, attachment);
  },

  /**
   * 保存
   *
   * @param {*} params
   */
  async save(file, params) {
    const { type, project, task, comment } = params;

    let options = {
      name: file.name,
      type,
      project,
      task,
      comment
    };

    // 保存图片文件
    let uploadRes = upload(file, type);
    if (uploadRes.success) {
      options.path = uploadRes.path;
    } else {
      return new Response(5000, uploadRes.error);
    }

    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      // 保存图片记录
      let attachment = new Attachment(options);
      let attachmentRes = await attachment.save();

      // 更新关联项
      if (project) {
        const Project = mongoose.model("Project");
        await Project.findByIdAndUpdate(project, {
          $addToSet: { attachments: [attachmentRes._id] }
        });
      }
      if (task) {
        const Task = mongoose.model("Task");
        await Task.findByIdAndUpdate(task, {
          $addToSet: { attachments: [attachmentRes._id] }
        });
      }
      if (comment) {
        const Comment = mongoose.model("Comment");
        await Comment.findByIdAndUpdate(comment, {
          $addToSet: { attachments: [attachmentRes._id] }
        });
      }

      await session.commitTransaction();
      session.endSession();

      return new Response(2000, attachmentRes);
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
    const attachment = await Attachment.findByIdAndUpdate(id, params, options);
    return new Response(2000, attachment);
  },

  /**
   * 根据id删除
   *
   * @param {String} id
   * @returns
   */
  async delete(id) {
    try {
      let attachment = await Attachment.findById(id);

      if (!attachment) {
        return new Response(4004);
      }

      /* if (attachment.project) {
        return new Response(4002, { message: "附件与项目存在关联，无法删除" });
      } */
      /* if (attachment.task) {
        return new Response(4002, { message: "附件与任务存在关联，无法删除" });
      } */
      /* if (attachment.comment) {
        return new Response(4002, { message: "文件与评论关联，无法删除" });
      } */

      const removedAttachment = await new Attachment(attachment).remove();
      return new Response(2000, removedAttachment);
    } catch (error) {
      logger.error(error);
      return new Response(5000, error.message);
    }
  }
};
