import { Controller, Get, Post, Put, Delete } from "../decorator/router";
import taskService from "../service/task";

@Controller("/api/task")
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
    const user = ctx.session.user;
    const params = ctx.request.body;
    const data = await taskService.save(params, user);

    ctx.body = data;
  }

  @Put("/:id")
  async update(ctx) {
    const user = ctx.session.user;
    const id = ctx.params.id;
    const params = ctx.request.body;
    const data = await taskService.update(id, params, user);

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
