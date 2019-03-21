import nodefetch, { Headers } from 'node-fetch'
import { throwError, Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { get as rxget, post as rxpost, RxRequestInit } from 'rxxfetch'

import { initialArgs } from './config'
import { AjaxResp } from './model'


export {
  Args,
  ArgsRequestInitCombined,
  JsonType,
  ObbRetType,
  PlainJsonValueType,
  PlainObject,
  RxRequestInit,
} from 'rxxfetch'


/**
 * Fetch GET 返回数据类型约定为 json
 * @returns Observable<AjaxResp<T>> 泛型T为 AjaxResp.dat 类型，默认 any
 */
export function get<T = any>(url: string, init?: RxRequestInit) {
  const args = parseArgs(init)
  return myajax<T>(url, args, 'get')
}


/**
 * Fetch POST 返回数据类型约定为 json
 * @returns Observable<AjaxResp<T>> 泛型T为 AjaxResp.dat 类型，默认 any
 */
export function post<T = any>(url: string, init?: RxRequestInit): Observable<AjaxResp<T>> {
  const args = parseArgs(init)
  return myajax<T>(url, args, 'post')
}


/** 处理返回数据 err/state 值 */
function parseRespState<T>(data: AjaxResp<T>): AjaxResp<T> {
  // data.state : 5初始化值, 1错误, 3失败, 7完成, 9成功. 若data.jump真则跳转
  if (! data) {
    throw new TypeError('返回数据结构非法空')
  }

  if (typeof data.err !== 'undefined') {
    data.err = +data.err
  }
  if (typeof data.state !== 'undefined') {
    data.state = +data.state
  }
  if (typeof data.err !== 'number' && typeof data.state !== 'number') {
    throw new TypeError('返回数据 state/err 值非法')
  }

  if (typeof data.err === 'undefined') {
    if (data.state >= 5) {
      data.err = 0
    }
    else if (data.state === -1) {
      data.err = -1
    }
    else {
      data.err = 1
    }
  }

  return data
}


/** 分析请求结果 若异常则抛出异常 */
function parseRespErr(
  url: string,
  type: 'get' | 'post',
  data: AjaxResp,
): void {

  if (data.err) {
    const msg = `Fetch Error:
url: "${url}"
schema: "${type.toUpperCase()}"
message: "${data.msg ? data.msg : ''}"
`
    throw new Error(msg)
  }
}


function myajax<T>(
  url: string,
  init: RxRequestInit,
  type: 'get' | 'post',
): Observable<AjaxResp<T>> {

  let req$: Observable<AjaxResp<T>>

  if (type === 'get') {
    req$ = rxget<AjaxResp<T>>(url, init)
  }
  else if (type === 'post') {
    req$ = rxpost<AjaxResp<T>>(url, init)
  }
  else {
    return throwError(new TypeError('myajax type value invalid'))
  }

  const ret$: Observable<AjaxResp<T>> = req$.pipe(
    map(parseRespState),
    tap(res => parseRespErr(url, type, res)),
  )

  return ret$
}


function parseArgs(args?: Partial<RxRequestInit>): RxRequestInit {
  const base = <RxRequestInit> {
    fetchModule: nodefetch,
    headersInitClass: Headers,
    ...initialArgs,
  }
  const ret: RxRequestInit = args
    ? { ...base, ...args }
    : { ...base }

  return ret
}

