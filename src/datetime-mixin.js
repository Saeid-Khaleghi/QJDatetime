import { normalizeToInterval } from 'quasar-framework/src/utils/format.js'
import { inline as props } from './datetime-props.js'
import {
  convertDateToFormat,
  getDateBetween,
  inferDateFormat,
  startOfDate,
  isSameDate,
  isValid,
  setupDateForPersianDate
} from './date.js'
import PersianDate from 'persian-date'

const reDate = /^\d{4}[^\d]\d{2}[^\d]\d{2}/

export default {
  props,
  computed: {
    computedValue () {
      if (this.type === 'date' && this.formatModel === 'string' && reDate.test(this.value)) {
        return this.value.slice(0, 10).split(/[^\d]/).join('/')
      }
      return this.value
    },
    computedDefaultValue () {
      if (this.type === 'date' && this.formatModel === 'string' && reDate.test(this.defaultValue)) {
        return this.defaultValue.slice(0, 10).split(/[^\d]+/).join('/')
      }
      return this.defaultValue
    },
    computedDateFormat () {
      if (this.type === 'date' && this.formatModel === 'string') {
        return 'YYYY/MM/DD HH:mm:ss'
      }
    },
    model: {
      get () {
        return isValid(this.computedValue)
          ? new PersianDate(setupDateForPersianDate(this.computedValue))
          : (this.computedDefaultValue ? new PersianDate(setupDateForPersianDate(this.computedDefaultValue)) : startOfDate(new PersianDate(), 'day'))
      },
      set (val) {
        const date = getDateBetween(val, this.pmin, this.pmax)
        const value = convertDateToFormat(date, this.formatModel === 'auto' ? inferDateFormat(this.value) : this.formatModel, this.computedDateFormat)
        this.$emit('input', value)
        this.$nextTick(() => {
          if (!isSameDate(value, this.value)) {
            this.$emit('change', value)
          }
        })
      }
    },
    pmin () {
      return this.min ? new PersianDate(setupDateForPersianDate(this.min)) : null
    },
    pmax () {
      return this.max ? new PersianDate(setupDateForPersianDate(this.max)) : null
    },
    typeHasDate () {
      return this.type === 'date' || this.type === 'datetime'
    },
    typeHasTime () {
      return this.type === 'time' || this.type === 'datetime'
    },

    year () {
      return this.model.year()
    },
    month () {
      return this.model.month()
    },
    day () {
      return this.model.date()
    },
    minute () {
      return this.model.minute()
    },

    currentYear () {
      return (new PersianDate()).year()
    },

    yearInterval () {
      return {
        min: this.pmin !== null ? this.pmin.year() : (this.year || this.currentYear) - 80,
        max: this.pmax !== null ? this.pmax.year() : (this.year || this.currentYear) + 80
      }
    },
    monthInterval () {
      return {
        min: this.monthMin,
        max: this.pmax !== null && this.pmax.year() === this.year ? this.pmax.month() - 1 : 11
      }
    },
    monthMin () {
      return this.pmin !== null && this.pmin.year() === this.year
        ? this.pmin.month() - 1
        : 0
    },

    daysInMonth () {
      return new PersianDate([this.year, this.model.month(), 0]).daysInMonth()
    },

    editable () {
      return !this.disable && !this.readonly
    },

    needsBorder () {
      return true
    }
  },

  methods: {
    toggleAmPm () {
      if (!this.editable) {
        return
      }
      let
        hour = this.model.hours(),
        offset = this.am ? 12 : -12
      this.model = new PersianDate(this.model).hours(hour + offset)
    },

    __parseTypeValue (type, value) {
      if (type === 'month') {
        return normalizeToInterval(value, 1, 12)
      }
      if (type === 'date') {
        return normalizeToInterval(value, 1, this.daysInMonth)
      }
      if (type === 'year') {
        return normalizeToInterval(value, this.yearInterval.min, this.yearInterval.max)
      }
      if (type === 'hour') {
        return normalizeToInterval(value, 0, 23)
      }
      if (type === 'minute') {
        return normalizeToInterval(value, 0, 59)
      }
    }
  }
}
