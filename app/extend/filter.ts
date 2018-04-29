import * as moment from 'moment'

export function relativeTime(time: number): string {
  return moment(new Date(time * 1000)).fromNow()
}

export function domain(url: string): string {
  return url && url.split('/')[2]
}
