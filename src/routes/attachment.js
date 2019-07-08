import { Controller, Get, Post, Put, Delete } from "../decorator/router";
import attachmentService from "../service/attachment";

@Controller("/attachment")
class AttachmentRouter {
  @Get("/")
  async getByQuery(ctx) {
    const { name } = ctx.query;
    const data = await attachmentService.getByQuery(name);

    ctx.body = data;
  }

  @Get("/:id")
  async getById(ctx) {
    const id = ctx.params.id;
    const data = await attachmentService.getById(id);

    ctx.body = data;
  }

  @Post("")
  async save(ctx) {
    const file = ctx.request.files.file;
    const params = ctx.request.body;
    const data = await attachmentService.save(file, params);

    ctx.body = data;
  }

  @Put("/:id")
  async update(ctx) {
    const id = ctx.params.id;
    const params = ctx.request.body;
    const data = await attachmentService.update(id, params);

    ctx.body = data;
  }

  @Delete("/:id")
  async delete(ctx) {
    const id = ctx.params.id;
    const data = await attachmentService.delete(id);

    ctx.body = data;
  }
}

export default AttachmentRouter;
