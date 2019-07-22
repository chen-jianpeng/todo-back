import { Controller, Get } from "../decorator/router";
import activityService from "../service/activity";

@Controller("/api/activity")
class ActivityRouter {
  @Get("/")
  async getByQuery(ctx) {
    const { name } = ctx.query;
    const data = await activityService.getByQuery(name);

    ctx.body = data;
  }
}

export default ActivityRouter;
