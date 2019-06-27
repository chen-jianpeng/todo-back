import mongoose from "mongoose";

const Project = mongoose.model("Project");

/**
 * 查询项目
 *
 * @param {*} name
 * @returns
 */
export const getProjects = async name => {
  let query = {};
  if (name) {
    query.name = name;
  }
  const projects = await Project.find(query);
  return projects;
};

/**
 * 根据ID查询项目
 *
 * @param {*} uid
 * @returns
 */
export const getProjectById = async uid => {
  const projects = await Project.findById(uid);
  return projects;
};

/**
 * 保存项目
 *
 * @param {*} params
 */
export const saveProject = async params => {
  let project = new Project(params);
  let res = await project.save();
  return res;
};
