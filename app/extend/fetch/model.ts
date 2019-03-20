import { AjaxResp as AjaxRespBase } from 'rxxfetch'

export interface AjaxResp<T = any> extends AjaxRespBase<T> {
  state: number
}
