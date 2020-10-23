# Lovelace Analog Clock Card

A simple analog clock card for Home Assistant. Colors are based on your current theme.

![Example](https://raw.githubusercontent.com/Villhellm/README_images/master/clock-card.png)

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | "custom:clock-card"
| time_zone | string | **Optional** | The timezone you would like to display. If ommited your current device time will be used. Must be a valid [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
| size | number | **Optional** | The size of the clock in px. Default is 300
| font_size | number | **Optional** | The size of the date string in px. Default is 20
| disable_seconds | boolean | **Optional** | Disable the seconds hand
| show_continent | boolean | **Optional** | Display the timezone continent beneath the clock
| show_city | boolean | **Optional** | Display the timezone city beneath the clock
| caption | string | **Optional** | Caption to display under the clock. This will override both show_city and show_continent
| display_date | string | **Optional** | Display the current Date object. See below for format options
| theme | object | **Optional** | Change the theme colors manually. Theme options below


## Display date string format options
| String | Returns
| ---- | ----
| a | AM/PM
| hh | current 12/hr hour with leading zero eg: `04`
| h | current 12/hr hour eg: `4`
| mm | current minute with leading zero eg: `09`
| m | current minute eg: `9`
| ss | current second with leading zero eg: `07`
| s | current second eg: `7`
| HH | current 24/hr hour with leading zero eg: `04`
| H | current 24/hr hour eg: `16`
| YYYY | current full year eg: `2020`
| YY | current abbreviated year eg: `20` 
| MMMM | current month name eg: `August`
| MMM | current abbreviated month name eg: `Aug`
| MM | current month with leading zero eg: `08`
| M | current month eg: `8`
| DDDD | current day name eg: `Tuesday`
| DDD | current abbreviated day name eg: `Tue`
| DD | current day with leading zero eg: `06`
| D | current day eg: `6`

## Theme options
All theme options can be set with a CSS valid color option.

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| background | string | **Optional** | Clock face background color
| hands | string | **Optional** | Color of the hands and clock border (if `border` is not defined)
| numbers | string | **Optional** | Color of the numbers
| border | string | **Optional** | Color of the clock face border

## Example Configuration

```yaml
- type: "custom:clock-card"
  time_zone: "America/Chicago" #OPTIONAL
  size: 250 #OPTIONAL
  font_size: 100 #OPTIONAL
  disable_seconds: true #OPTIONAL
  caption: "Corporate"
  display_date: "MM/DD/YY"
  theme:
    background: black
    hands: orange
    numbers: white
    border: grey
```

[Troubleshooting](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins)