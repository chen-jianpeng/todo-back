import { Controller, Get, Post, Put, Delete } from "../decorator/router";
import taskListService from "../service/taskList";

@Controller("/taskList")
class ProjectRouter {
  @Get("/")
  async getByQuery(ctx) {
    const { name } = ctx.query;
    const datas = await taskListService.getByQuery(name);

    ctx.body = {
      data: datas,
      success: true
    };
  }

  @Get("/:id")
  async getById(ctx) {
    const id = ctx.params.id;
    const data = await taskListService.getById(id);

    ctx.body = {
      data,
      success: true
    };
  }

  @Post("")
  async save(ctx) {
    const params = ctx.request.body;
    const data = await taskListService.save(params);

    ctx.body = {
      data,
      success: true
    };
  }

  @Put("/:id")
  async update(ctx) {
    const id = ctx.params.id;
    const params = ctx.request.body;
    const data = await taskListService.update(id, params);

    ctx.body = {
      data,
      success: true
    };
  }

  @Delete("/:id")
  async delete(ctx) {
    const id = ctx.params.id;
    const data = await taskListService.delete(id);

    ctx.body = {
      data,
      success: true
    };
  }
}

export default ProjectRouter;
