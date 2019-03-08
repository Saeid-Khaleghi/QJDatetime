/* eslint no-fallthrough: 0 */

import {isDate, isString} from 'quasar-framework/src/utils/is.js'
import {pad, capitalize} from 'quasar-framework/src/utils/format.js'
import i18n from 'quasar-framework/src/i18n.js'
import PersianDate from 'persian-date'

const
  MILLISECONDS_IN_DAY = 86400000,
  MILLISECONDS_IN_HOUR = 3600000,
  MILLISECONDS_IN_MINUTE = 60000,
  token = /\[((?:[^\]\\]|\\]|\\)*)\]|d{1,4}|M{1,4}|m{1,2}|w{1,2}|Qo|Do|D{1,4}|YY(?:YY)?|H{1,2}|h{1,2}|s{1,2}|S{1,3}|Z{1,2}|a{1,2}|[AQExX]/g,
  rePersianDateTimeStr = /^([0-9]{4}\/(0[1-9]{1}|1[0-2]{1})\/(0[1-9]{1}|[1-2]{1}[0-9]{1}|3[0-1])|[0-9]{4}-(0[1-9]{1}|1[0-2]{1})-(0[1-9]{1}|[1-2]{1}[0-9]{1}|3[0-1]))( ([0-1]{1}[0-9]{1}|2[0-3]):[0-5]{1}[0-9]{1}:[0-5]{1}[0-9]{1})??$/

export const
  pMonths = 'فروردین/اردیبهشت/خرداد/تیر/مرداد/شهریور/مهر/آبان/آذر/دی/بهمن/اسفند'.split('/'),
  pMonthsShort = 'فرو/ارد/خرد/تیر/مرد/شهر/مهر/آبا/آذر/دی/بهم/اسف'.split('/')

function formatTimezone(offset, delimeter = '') {
  const
    sign = offset > 0 ? '-' : '+',
    absOffset = Math.abs(offset),
    hours = Math.floor(absOffset / 60),
    minutes = absOffset % 60

  return sign + pad(hours) + delimeter + pad(minutes)
}

function setMonth(date, newMonth /* 1-based */) {
  const
    test = new PersianDate([date.year(), newMonth]),
    days = test.daysInMonth()
  date.month(newMonth)
  date.date(Math.min(days, date.date()))
}

export function setupDateForPersianDate(date) {
  if (isString(date)) {
    let dd = date.substring(0, 19).replace('T', ' ')
    if (rePersianDateTimeStr.exec(dd) !== null) {
      let datetime = dd.replace(rePersianDateTimeStr, function (match, text) {
        return match.split('-').join('/');
      }).substring(0, 19).split(' ')
      date = datetime[0].split('/').concat(datetime[1].split(':')).map(Number)
    }
  }
  return date
}

function buildDateVal(d) {
  return new PersianDate(setupDateForPersianDate(d)).toLocale('en')
}

function getChange(date, mod, add) {
  const
    t = buildDateVal(date),
    sign = (add ? 1 : -1)
  console.log('date.js | getChange called')
  Object.keys(mod).forEach(key => {
    if (key === 'month') {
      setMonth(t, t.month() + 1 + sign * mod.month)
      return
    }

    const op = key === 'year'
      ? 'Year'
      : capitalize(key === 'days' ? 'date' : key)
    t[`set${op}`](t[`get${op}`]() + sign * mod[key])
  })
  return t
}

export function isValid(date) {
  if (typeof date === 'number') {
    return true
  }
  const t = Date.parse(date)
  return isNaN(t) === false
}

export function buildDate(mod, utc) {
  console.log('date.js | buildDate')
  return adjustDate(new PersianDate(), mod, utc)
}

export function getDayOfWeek(date) {
  const dow = buildDateVal(date).date()
  return dow === 0 ? 7 : dow
}

export function getWeekOfYear(date) {
  return date.format("w").getLocale("en")
}

export function isBetweenDates(date, from, to, opts = {}) {
  let
    d1 = buildDateVal(from).getTime(),
    d2 = buildDateVal(to).getTime(),
    cur = buildDateVal(date).getTime()

  opts.inclusiveFrom && d1--
  opts.inclusiveTo && d2++

  return cur > d1 && cur < d2
}

export function addToDate(date, mod) {
  return getChange(date, mod, true)
}

export function subtractFromDate(date, mod) {
  return getChange(date, mod, false)
}

export function adjustDate(date, mod, utc) {
  const
    t = buildDateVal(date),
    prefix = `set${utc ? 'UTC' : ''}`
  Object.keys(mod).forEach(key => {
    if (key === 'month') {
      setMonth(t, mod.month)
      return
    }

    const op = key === 'year'
      ? 'FullYear'
      : key.charAt(0).toUpperCase() + key.slice(1)
    console.log('Here in adjustDate:', t[`${prefix}${op}`](mod[key]))
    t[`${prefix}${op}`](mod[key])
  })
  return t
}

export function startOfDate(date, unit) {
  const t = buildDateVal(date)
  switch (unit) {
    case 'year':
      t.month(0)
    case 'month':
      t.date(1)
    case 'day':
      t.hours(0)
    case 'hour':
      t.minutes(0)
    case 'minute':
      t.seconds(0)
    case 'second':
      t.milliseconds(0)
  }
  return t
}

export function endOfDate(date, unit) {
  const t = buildDateVal(date)
  switch (unit) {
    case 'year':
      t.setMonth(11)
    case 'month':
      t.setDate(daysInMonth(date))
    case 'day':
      t.setHours(23)
    case 'hour':
      t.setMinutes(59)
    case 'minute':
      t.setSeconds(59)
    case 'second':
      t.setMilliseconds(59)
  }
  return t
}

export function getMaxDate(date, ...args) {
  let t = buildDateVal(date)
  args.forEach(d => {
    t = Math.max(t, buildDateVal(d))
  })
  return t
}

export function getMinDate(date, ...args) {
  let t = buildDateVal(date)
  args.forEach(d => {
    t = Math.min(t, buildDateVal(d))
  })
  return t
}

function getDiff(t, sub, interval) {
  return (
    (t.unix() - t.zone()() * MILLISECONDS_IN_MINUTE) -
    (sub.unix() - sub.zone() * MILLISECONDS_IN_MINUTE)
  ) / interval
}

export function getDateDiff(date, subtract, unit = 'days') {
  let
    t = buildDateVal(date),
    sub = buildDateVal(subtract)

  switch (unit) {
    case 'years':
      return (t.getFullYear() - sub.getFullYear())

    case 'months':
      return (t.getFullYear() - sub.getFullYear()) * 12 + t.getMonth() - sub.getMonth()

    case 'days':
      return getDiff(startOfDate(t, 'day'), startOfDate(sub, 'day'), MILLISECONDS_IN_DAY)

    case 'hours':
      return getDiff(startOfDate(t, 'hour'), startOfDate(sub, 'hour'), MILLISECONDS_IN_HOUR)

    case 'minutes':
      return getDiff(startOfDate(t, 'minute'), startOfDate(sub, 'minute'), MILLISECONDS_IN_MINUTE)

    case 'seconds':
      return getDiff(startOfDate(t, 'second'), startOfDate(sub, 'second'), 1000)
  }
}

export function getDayOfYear(date) {
  return getDateDiff(date, startOfDate(date, 'year'), 'days') + 1
}

export function inferDateFormat(example) {
  if (isDate(example)) {
    return 'date'
  }
  if (typeof example === 'number') {
    return 'number'
  }

  return 'string'
}

export function convertDateToFormat(date, type, format) {
  if (!date && date !== 0) {
    return
  }

  switch (type) {
    case 'date':
      return date
    case 'number':
      return date.unix()
    default:
      return formatDate(date, format)
  }
}

export function getDateBetween(date, min, max) {
  const t = buildDateVal(date)

  if (min) {
    const low = buildDateVal(min)
    if (t < low) {
      return low
    }
  }

  if (max) {
    const high = buildDateVal(max)
    if (t > high) {
      return high
    }
  }

  return t
}

export function isSameDate(date, date2, unit) {
  const
    t = buildDateVal(date),
    d = buildDateVal(date2)

  if (unit === void 0) {
    return t.unix() === d.unix()
  }

  switch (unit) {
    case 'second':
      if (t.seconds() !== d.seconds()) {
        return false
      }
    case 'minute': // intentional fall-through
      if (t.minutes() !== d.minutes()) {
        return false
      }
    case 'hour': // intentional fall-through
      if (t.hours() !== d.hours()) {
        return false
      }
    case 'day': // intentional fall-through
      if (t.date() !== d.date()) {
        return false
      }
    case 'month': // intentional fall-through
      if (t.month() !== d.month()) {
        return false
      }
    case 'year': // intentional fall-through
      if (t.year() !== d.year()) {
        return false
      }
      break
    default:
      throw new Error(`date isSameDate unknown unit ${unit}`)
  }
  return true
}

export function daysInMonth(date) {
  return new PersianDate([date.year(), date.month(), 0]).date()
}

function getOrdinal(n) {
  switch (n % 10) {
    case 1:
      return `اول`
    case 2:
      return `دوم`
    case 3:
      return `سوم`
  }
  return `${n}م`
}

export const formatter = {
  // Year: 00, 01, ..., 99
  YY(date) {
    return date.format("YY")
  },

  // Year: 1900, 1901, ..., 2099
  YYYY(date) {
    return date.format("YYYY")
  },

  // Month: 1, 2, ..., 12
  M(date) {
    return date.month()
  },

  // Month: 01, 02, ..., 12
  MM(date) {
    return date.format("MM")
  },

  // Month Short Name: Jan, Feb, ...
  MMM(date, opts = {}) {
    return (opts.pMonthNamesShort || pMonthsShort)[date.month() - 1]
  },

  // Month Name: January, February, ...
  MMMM(date, opts = {}) {
    return (opts.pMonthNames || pMonths)[date.month() - 1]
  },

  // Quarter: 1, 2, 3, 4
  Q(date) {
    return Math.ceil(date.month() / 3)
  },

  // Quarter: 1st, 2nd, 3rd, 4th
  Qo(date) {
    return getOrdinal(this.Q(date))
  },

  // Day of month: 1, 2, ..., 31
  D(date) {
    return date.date()
  },

  // Day of month: 1st, 2nd, ..., 31st
  Do(date) {
    return getOrdinal(date.date())
  },

  // Day of month: 01, 02, ..., 31
  DD(date) {
    return date.format('DD')
  },

  // Day of year: 1, 2, ..., 366
  DDD(date) {
    return date.format('DDD')
  },

  // Day of year: 001, 002, ..., 366
  DDDD(date) {
    return pad(date.format('DDD'), 3)
  },

  // Day of week: 0, 1, ..., 6
  d(date) {
    return date.getDay()
  },

  // Day of week: Su, Mo, ...
  dd(date) {
    return this.ddd(date).slice(0, 2)
  },

  // Day of week: Sun, Mon, ...
  ddd(date, opts = {}) {
    return (opts.dayNamesShort || i18n.lang.date.daysShort)[(date.day() + 5) % 7]
  },

  // Day of week: Sunday, Monday, ...
  dddd(date, opts = {}) {
    return (opts.dayNames || i18n.lang.date.days)[(date.day() + 5) % 7]
  },

  // Day of ISO week: 1, 2, ..., 7
  E(date) {
    return date.day() || 7
  },

  // Week of Year: 1 2 ... 52 53
  w(date) {
    return date.format("w")
  },

  // Week of Year: 01 02 ... 52 53
  ww(date) {
    return pad(getWeekOfYear(date.format("w")))
  },

  // Hour: 0, 1, ... 23
  H(date) {
    return date.format("H")
  },

  // Hour: 00, 01, ..., 23
  HH(date) {
    return date.format("HH")
  },

  // Hour: 1, 2, ..., 12
  h(date) {
    return date.format("h")
  },

  // Hour: 01, 02, ..., 12
  hh(date) {
    // return pad(this.h(date))
    return date.format("hh")
  },

  // Minute: 0, 1, ..., 59
  m(date) {
    return date.format("m")
  },

  // Minute: 00, 01, ..., 59
  mm(date) {
    return date.format("mm")
  },

  // Second: 0, 1, ..., 59
  s(date) {
    return date.format("s")
  },

  // Second: 00, 01, ..., 59
  ss(date) {
    return date.format("ss")
  },

  // 1/10 of second: 0, 1, ..., 9
  S(date) {
    return Math.floor(date.milliseconds() / 100)
  },

  // 1/100 of second: 00, 01, ..., 99
  SS(date) {
    return pad(Math.floor(date.milliseconds() / 10))
  },

  // Millisecond: 000, 001, ..., 999
  SSS(date) {
    return pad(date.milliseconds(), 3)
  },

  // Meridiem: AM, PM
  A(date) {
    return date.hours() < 12 ? 'قبل از ظهر' : 'بعد از ظهر'
  },

  // Meridiem: am, pm
  a(date) {
    return date.format("a")
  },

  // Meridiem: a.m., p.m
  aa(date) {
    return date.hours() < 12 ? 'ق.ظ.' : 'ب.ظ'
  },

  // Timezone: -01:00, +00:00, ... +12:00
  Z(date) {
    return date.format("Z")
  },

  // Timezone: -0100, +0000, ... +1200
  ZZ(date) {
    return date.format("ZZ")
  },

  // Seconds timestamp: 512969520
  X(date) {
    return date.format("X")
  },

  // Milliseconds timestamp: 512969520900
  x(date) {
    return date.valueOf()
  }
}

export function formatDate(val, mask = 'YYYY-MM-DDTHH:mm:ss.SSSZ', opts) {
  if (val !== 0 && !val) {
    return
  }

  let date = buildDateVal(val)

  return mask.replace(token, function (match, text) {
    if (match in formatter) {
      return formatter[match](date, opts)
    }
    return text === void 0
      ? match
      : text.split('\\]').join(']')
  })
}

export function matchFormat(format = '') {
  return format.match(token)
}

export function clone(value) {
  return new PersianDate().isPersianDate(value) ? value.clone() : value
}

export default {
  isValid,
  buildDate,
  getDayOfWeek,
  getWeekOfYear,
  isBetweenDates,
  addToDate,
  subtractFromDate,
  adjustDate,
  startOfDate,
  endOfDate,
  getMaxDate,
  getMinDate,
  getDateDiff,
  getDayOfYear,
  inferDateFormat,
  convertDateToFormat,
  getDateBetween,
  isSameDate,
  daysInMonth,
  formatter,
  formatDate,
  matchFormat,
  clone,
  setupDateForPersianDate,
  pMonths,
  pMonthsShort
}
