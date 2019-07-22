import { Controller, Get, Post, Put, Delete } from "../decorator/router";
import projectService from "../service/project";

@Controller("/api/project")
class ProjectRouter {
  @Get("/")
  async getByQuery(ctx) {
    const { name } = ctx.query;
    const data = await projectService.getByQuery(name);

    ctx.body = data;
  }

  @Get("/:id")
  async getById(ctx) {
    const id = ctx.params.id;
    const data = await projectService.getById(id);

    ctx.body = data;
  }

  @Post("")
  async save(ctx) {
    const params = ctx.request.body;
    const data = await projectService.save(params);

    ctx.body = data;
  }

  @Put("/:id")
  async update(ctx) {
    const id = ctx.params.id;
    const params = ctx.request.body;
    const data = await projectService.update(id, params);

    ctx.body = data;
  }

  @Delete("/:id")
  async delete(ctx) {
    const id = ctx.params.id;
    const data = await projectService.delete(id);

    ctx.body = data;
  }
}

export default ProjectRouter;
