import { Controller, Post, Put, Delete } from "../decorator/router";
import commentService from "../service/comment";

@Controller("/api/comment")
class CommentRouter {
  @Post("")
  async save(ctx) {
    const user = ctx.session.user;
    const params = ctx.request.body;
    const data = await commentService.save(params, user);

    ctx.body = data;
  }

  @Put("/:id")
  async update(ctx) {
    const id = ctx.params.id;
    const params = ctx.request.body;
    const data = await commentService.update(id, params);

    ctx.body = data;
  }

  @Delete("/:id")
  async delete(ctx) {
    const id = ctx.params.id;
    const data = await commentService.delete(id);

    ctx.body = data;
  }
}

export default CommentRouter;
