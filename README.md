# QJDatetime

The QJDatetime component provides a method to input dates and time or both in persian system called Jalali. There is also one more version available: QJDatetimePicker.
This component have been created just to used in [`quasar-framework`](https://quasar-framework.org).

## Installation

To convert Gregorian date to Jalali system, this component use [`Persian Date`](http://babakhani.github.io/PersianWebToolkit/doc/persian-date) library. So you have to install it by run this command:

```bash
npm i persian-date
``` 

You are ready to install this package by running this command:
```bash
npm i qjdatetime
```

Now, you should [`make a plugin in your quasar-framework project`](https://quasar-framework.org/guide/app-plugins.html). It's easy.
Just make a file named `qjdatetime.js` in `plugins` folder of quasar-framework and add these lines of code to it:
```javascript
import QJDatetime from 'qjdatetime'

export default ({ app, Vue }) => {
  Vue.use(QJDatetime)
}
```

You have to edit `quasar.conf.js` and register the plugin:
```json
{
    "plugins": [
      "qjdatetime"
    ]
}
```

It's Done. You are ready to enjoy using the component.

## Usage

The usage of this component is exactly same as `Datetime` and `DatetimePicker` of quasar-framework, so you can read [`original document`](https://quasar-framework.org/components/datetime-input.html).

