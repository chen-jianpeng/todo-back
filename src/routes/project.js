import { Controller, Get } from "../decorator/router";
import { getProjects, getProjectById } from "../service/project";

@Controller("/project")
class ProjectRouter {
  @Get("/all")
  async getProjects(ctx) {
    const { name } = ctx.query;
    const projects = await getProjects(name);

    ctx.body = {
      data: projects,
      success: true
    };
  }

  @Get("/detail/:id")
  async getProjectById(ctx) {
    const id = ctx.params.id;
    const project = await getProjectById(id);

    ctx.body = {
      data: project,
      success: true
    };
  }
}

export default ProjectRouter;
