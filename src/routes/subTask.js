import { Controller, Get, Post, Put, Delete } from "../decorator/router";
import subTaskService from "../service/subTask";

@Controller("/api/subTask")
class SubTaskRouter {
  @Get("/")
  async getByQuery(ctx) {
    const { name } = ctx.query;
    const data = await subTaskService.getByQuery(name);

    ctx.body = data;
  }

  @Get("/:id")
  async getById(ctx) {
    const id = ctx.params.id;
    const data = await subTaskService.getById(id);

    ctx.body = data;
  }

  @Post("")
  async save(ctx) {
    const params = ctx.request.body;
    const data = await subTaskService.save(params);

    ctx.body = data;
  }

  @Put("/:id")
  async update(ctx) {
    const id = ctx.params.id;
    const params = ctx.request.body;
    const data = await subTaskService.update(id, params);

    ctx.body = data;
  }

  @Delete("/:id")
  async delete(ctx) {
    const id = ctx.params.id;
    const data = await subTaskService.delete(id);

    ctx.body = data;
  }
}

export default SubTaskRouter;
