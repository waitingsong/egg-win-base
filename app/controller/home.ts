import { Controller } from 'egg'

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this
    ctx.body = await ctx.service.test.sayHi('egg')
  }
}

declare module 'egg' {
  export interface IController {
    home: HomeController
  }
}
