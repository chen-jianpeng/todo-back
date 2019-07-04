import { Controller, Get, Post } from "../decorator/router";
import userService from "../service/user";

@Controller("/user")
class UserRouter {
  @Get("/")
  async getUsers(ctx) {
    const { name } = ctx.query;
    const users = await userService.getUsers(name);

    ctx.body = {
      data: users,
      success: true
    };
  }

  @Get("/:id")
  async getUserById(ctx) {
    const id = ctx.params.id;
    const user = await userService.getUserById(id);

    ctx.body = {
      data: user,
      success: true
    };
  }

  @Post("")
  async saveUser(ctx) {
    const params = ctx.request.body;
    const user = await userService.saveUser(params);

    ctx.body = {
      data: user,
      success: true
    };
  }
}

export default UserRouter;
