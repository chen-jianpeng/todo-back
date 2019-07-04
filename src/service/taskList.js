import mongoose from "mongoose";

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
    return taskLists;
  },

  /**
   * 根据ID查询
   *
   * @param {*} uid
   * @returns
   */
  async getById(uid) {
    const taskLists = await TaskList.findById(uid)
      .populate("project")
      .populate("tasks");
    return taskLists;
  },

  /**
   * 保存
   *
   * @param {*} params
   */
  async save(params) {
    let taskList = new TaskList(params);
    let taskListRes = await taskList.save();

    await Project.findByIdAndUpdate(params.project, {
      $addToSet: { taskLists: [taskListRes._id] }
    });

    return taskListRes;
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
    return taskList;
  },

  /**
   * 根据id删除
   *
   * @param {String} id
   * @returns
   */
  async delete(id) {
    const taskList = await TaskList.findByIdAndRemove(id);
    return taskList;
  }
};
