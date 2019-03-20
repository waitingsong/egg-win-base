import * as egg from 'egg'

import { get, post } from './fetch'


const app: Partial<egg.Application> = {
  rxxFetch: {
    get,
    post,
  },
}

export default app

declare module 'egg' {
  export interface Application {
    rxxFetch: {
      get: typeof get,
      post: typeof post,
    }
  }
}
