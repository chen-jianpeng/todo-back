import { Controller, Get, Post, Put, Delete } from "../decorator/router";
import taskService from "../service/task";

@Controller("/task")
class taskRouter {
  @Get("/")
  async getByQuery(ctx) {
    const { name } = ctx.query;
    const data = await taskService.getByQuery(name);

    ctx.body = data;
  }

  @Get("/:id")
  async getById(ctx) {
    const id = ctx.params.id;
    const data = await taskService.getById(id);

    ctx.body = data;
  }

  @Post("")
  async save(ctx) {
    const params = ctx.request.body;
    const data = await taskService.save(params);

    ctx.body = data;
  }

  @Put("/:id")
  async update(ctx) {
    const id = ctx.params.id;
    const params = ctx.request.body;
    const data = await taskService.update(id, params);

    ctx.body = data;
  }

  @Delete("/:id")
  async delete(ctx) {
    const id = ctx.params.id;
    const data = await taskService.delete(id);

    ctx.body = data;
  }
}

export default taskRouter;
