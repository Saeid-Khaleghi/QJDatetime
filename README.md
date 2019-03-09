[![npm](https://img.shields.io/npm/l/qjdatetime.svg?maxAge=2592000)](https://github.com/Saeid-Khaleghi/QJDatetime/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/dt/qjdatetime.svg)](https://www.npmjs.com/package/qjdatetime)

![image](https://user-images.githubusercontent.com/13361616/54028443-3d51bc00-41ba-11e9-8b05-97bbad689542.png)

# QJDatetime

The QJDatetime component provides a method to input dates and time or both in persian system called Jalali. There is also one more version available: `QJDatetimePicker`.
This component have been created just to used in [`quasar-framework`](https://quasar-framework.org).

## Requirements

[`quasar-framework`](https://quasar-framework.org) 17.10.0+

[`PersianDate`](http://babakhani.github.io/PersianWebToolkit/doc/persian-date) library

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

## Basic Usage
```html
<!-- Only Date -->
<q-j-datetime v-model="model" type="date"/>

<!-- Only Time -->
<q-j-datetime v-model="model" type="time" />

<!-- Date & Time -->
<q-j-datetime v-model="model" type="datetime"/>
```
## Common Usage
```html
<q-j-datetime
    v-model="model"
    float-label="Field Label"
    :first-day-of-week="6"
    type="datetime"
    format="YYYY/MM/DD"
    default-view="day"
/>
```

## Vue Properties
Supports v-model which must be a String, Number or [`PersianDate`](http://babakhani.github.io/PersianWebToolkit/doc/persian-date) Object.

|   Field Name   |          Usage                |      Description   |
|----------------|-------------------------------|--------------------|
|type            |  String  |   One of `date`, `time` or `datetime`. Default is `date`.|
|clearable       |Boolean|If used, the component offers the user an actionable icon to reset the current value to clear-value (if it is set) or otherwise `default-value`. The icon appears only when the current value matches `clear-value`/`default-value`.
|default-value         | String/Object | Default color for picker when model is not yet set.|
|clear-value	            | String/Object | The value to which to reset the field model to when using `clearable`, unless `default-value` is specified. |
|minimal            | Boolean | Don’t display header. |
|readonly           |	Boolean |If set to `true`, component is displayed as read-only.|
|min          |String|Optional minimum value it can take. Has same format as Datetime model.|
|max |String|Optional maximum value it can take. Has same format as Datetime model.|
|default-view	   |String|One of ‘year’, ‘month’, ‘day’, ‘hour’, ‘minute’.|
|default-value	        |String/Number/PersianDate|Default date/time for picker when model is not yet set.|
|display-value	          |String|Text to display on input frame. Supersedes ‘placeholder’.|
|first-day-of-week  |Number|0-6, 0 - Sunday, 1 Monday, ….|
|hide-underline	     |Boolean|Always display with a Popover, regardless of Platform.|
|popover     |Boolean|Always display with a Modal, regardless of Platform.|
|modal     |Boolean|Always display with a Modal, regardless of Platform.|
|format     |String|Format as described on Handling JS Date page under [`Format for display section`](https://quasar-framework.org/components/date-utils.html#Format-for-display).|
|format-model |String|Data type of model (useful especially when starting out with undefined or null). One of ‘auto’, ‘date’, ‘number’, ‘string’.|
|format24h |Boolean|Override default i18n setting. Use 24 hour time for Material picker instead of AM/PM system which is default.|
|placeholder |String|Placeholder text for input frame to use when model is not set (empty).|
|ok-label	 |String|Text for the button to accept the input (when using Modal).|
|cancel-label |String|Text for the button to cancel input with no change (when using Modal).|
|header-label	 |String|Override weekday string on popup. Applies to Material theme only.|

## Common input frame properties

|Property	|Type|	Description|
|-----------|----|-------------|
|prefix	|String|	A text that should be shown before the value of model.|
|suffix	|String|	A text that should be shown after the value of model.|
|float-label	|String|	A text label that will “float” up above the input field, once the input field gets focus.|
|stack-label	|String|	A text label that will be shown above the input field and is static.|
|color	|String|	One from Quasar Color Palette.|
|inverted	|Boolean|	Inverted mode. Color is applied to background instead.|
|inverted-light	|Boolean|	Inverted mode with a light color. Color is applied to background instead.|
|dark	|Boolean|	Is component rendered on a dark background?|
|align	|String|	One of ‘left’, ‘center’ or ‘right’ which determines the text align.|
|disable	|Boolean|	If set to true, component is disabled and the user cannot change model.|
|warning	|Boolean|	If set to true, the input fields colors are changed to show there is a warning.|
|error	|Boolean|	If set to true, the input fields colors are changed to show there is an error.|
|before	|Array| of Objects	Icon buttons on left side of input frame. Read below more details.|
|after	|Array| of Objects	Icon buttons on right side of input frame. Read below more details.|
|no-parent-field	|Boolean|	Avoid trying to connect to a parent QField.|


## License

Media-store is free software distributed under the terms of the MIT license.