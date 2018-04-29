import { Application } from 'egg'


export default (app: Application) => {
  const { controller, router } = app

  router.redirect('/', '/hello')
  router.get('/hello', controller.home.index)
}
