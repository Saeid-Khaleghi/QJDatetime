import QJDatetime from './QJDatetime.js'
import QJDatetimePicker from './QJDatetimePicker'

export default {
  install (Vue, opts) {
    Vue.component(QJDatetime.name, QJDatetime)
    Vue.component(QJDatetimePicker.name, QJDatetimePicker)
  }
}

export {
  QJDatetime,
  QJDatetimePicker
}
