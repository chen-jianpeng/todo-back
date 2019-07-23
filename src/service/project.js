import mongoose from "mongoose";
import { logger } from "../lib/log4";
import Response from "../lib/response";

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
    const projects = await Project.find(query);
    return new Response(2000, projects);
  },

  /**
   * 根据ID查询
   *
   * @param {*} id
   * @returns
   */
  async getById(id) {
    const project = await Project.findById(id)
      .populate("taskLists")
      .populate("attachments")
      .populate("creator");
    return new Response(2000, project);
  },

  /**
   * 保存
   *
   * @param {*} params
   */
  async save(params, user) {
    params.creator = user._id;
    let project = new Project(params);
    let res = await project.save();
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
    const project = await Project.findByIdAndUpdate(id, params, options);
    return new Response(2000, project);
  },

  /**
   * 根据id删除
   *
   * @param {String} id
   * @returns
   */
  async delete(id) {
    try {
      let project = await Project.findById(id);

      if (!project) {
        return new Response(4004);
      }

      if (project.taskLists && project.taskLists.length > 0) {
        return new Response(4002);
      }

      const removedProject = await new Project(project).remove();
      return new Response(2000, removedProject);
    } catch (error) {
      logger.error(error);
      return new Response(5000, error.message);
    }
  }
};
