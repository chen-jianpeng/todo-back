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
    const type = params.type;

    let options = {
      name: file.name,
      type
    };
    options[type] = params[type];

    if (!options[type]) {
      return new Response(4000);
    }

    // 保存图片文件
    let uploadRes = upload(file, type);
    if (uploadRes.success) {
      options.path = uploadRes.path;
    } else {
      return new Response(5000, uploadRes.error);
    }

    // 处理不同type的记录
    async function handleType(id, type, parentId) {
      let Model;
      switch (type) {
        case "project":
          Model = mongoose.model("Project");
          break;
        case "task":
          Model = mongoose.model("Task");
          break;
        case "comment":
          Model = mongoose.model("Comment");

          break;
      }
      if (Model) {
        await Model.findByIdAndUpdate(parentId, {
          $addToSet: { attachment: [id] }
        });
      }
    }

    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      // 保存图片记录
      let attachment = new Attachment(options);
      let attachmentRes = await attachment.save();

      await handleType(attachmentRes._uid, type, options[type]);

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
        return new Response(4001);
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
