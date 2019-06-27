import mongoose from "mongoose";

const Project = mongoose.model("Project");

export const getProjects = async name => {
  let query = {};

  if (name) {
    query.name = name;
  }

  const projects = await Project.find(query);

  return projects;
};

export const getProjectById = async uid => {
  let query = {};

  if (uid) {
    query.uid = uid;
  }

  const projects = await Project.find(query);

  return projects;
};
