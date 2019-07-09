import { Controller, Get, Post, Put, Delete } from "../decorator/router";
import activityService from "../service/activity";

@Controller("/activity")
class ActivityRouter {
  @Get("/")
  async getByQuery(ctx) {
    const { name } = ctx.query;
    const data = await activityService.getByQuery(name);

    ctx.body = data;
  }

  @Get("/:id")
  async getById(ctx) {
    const id = ctx.params.id;
    const data = await activityService.getById(id);

    ctx.body = data;
  }

  @Post("")
  async save(ctx) {
    const params = ctx.request.body;
    const data = await activityService.save(params);

    ctx.body = data;
  }

  @Put("/:id")
  async update(ctx) {
    const id = ctx.params.id;
    const params = ctx.request.body;
    const data = await activityService.update(id, params);

    ctx.body = data;
  }

  @Delete("/:id")
  async delete(ctx) {
    const id = ctx.params.id;
    const data = await activityService.delete(id);

    ctx.body = data;
  }
}

export default ActivityRouter;
