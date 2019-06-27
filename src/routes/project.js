import { Controller, Get, Post } from "../decorator/router";
import { getProjects, getProjectById, saveProject } from "../service/project";

@Controller("/project")
class ProjectRouter {
  @Get("/")
  async getProjects(ctx) {
    const { name } = ctx.query;
    const projects = await getProjects(name);

    ctx.body = {
      data: projects,
      success: true
    };
  }

  @Get("/:id")
  async getProjectById(ctx) {
    const id = ctx.params.id;
    const project = await getProjectById(id);

    ctx.body = {
      data: project,
      success: true
    };
  }

  @Post("")
  async saveProject(ctx) {
    const params = ctx.request.body;
    const project = await saveProject(params);

    ctx.body = {
      data: project,
      success: true
    };
  }
}

export default ProjectRouter;
