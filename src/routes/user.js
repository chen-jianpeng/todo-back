import { Controller, Get, Post, Required } from "../decorator/router";
import Response from "../lib/response";

import userService from "../service/user";

@Controller("/api/user")
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

  @Post("/")
  async saveUser(ctx) {
    const params = ctx.request.body;
    const data = await userService.saveUser(params);

    ctx.body = data;
  }

  @Post("/login")
  @Required({ body: ["email", "password"] })
  async login(ctx) {
    const params = ctx.request.body;
    const res = await userService.login(params);

    if (res.code === 2000) {
      const userInfo = {
        _id: res.data._id,
        email: res.data.email,
        name: res.data.name
      };
      ctx.session.user = userInfo;
    }

    ctx.body = res;
  }

  @Get("/logout")
  logout(ctx) {
    ctx.session = null;
    ctx.body = Response(2000);
  }
}

export default UserRouter;
