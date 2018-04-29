import { Service } from 'egg'


/**
 * Test Service
 */
export default class Test extends Service {
  /**
   * sayHi to you
   * @param name - your name
   */
  public async sayHi(name: string) {
    return `hi, ${name}`
  }
}

declare module 'egg' {
  export interface IService {
    test: Test
  }
}
