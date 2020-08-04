# Lovelace Analog Clock Card

A simple analog clock card for Home Assistant. Colors are based on your current theme.

![Example](https://raw.githubusercontent.com/Villhellm/README_images/master/clock-card.png)

| Name | Type | Requirement | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | "custom:clock-card"
| time_zone | string | **Optional** | The timezone you would like to display. If ommited your current device time will be used. Must be a valid [TZ database name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
| size | number | **Optional** | The size of the clock in px. Default is 300
| disable_seconds | boolean | **Optional** | Disable the seconds hand
| show_continent | boolean | **Optional** | Display the timezone continent beneath the clock
| show_city | boolean | **Optional** | Display the timezone city beneath the clock
| caption | string | **Optional** | Caption to display under the clock. This will override both show_city and show_continent
| display_date | string | **Optional** | Display the current Date object. See below for format options


## Display date string format options
| String | Returns
| ---- | ----
| hh | current hour with leading zero eg: `04`
| h | current hour eg: `4`
| mm | current minute with leading zero eg: `09`
| m | current minute eg: `9`
| ss | current second with leading zero eg: `07`
| s | current second eg: `7`
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

## Example Configuration

```yaml
- type: "custom:clock-card"
  time_zone: "America/Chicago" #OPTIONAL
  size: 250 #OPTIONAL
  disable_seconds: true #OPTIONAL
  caption: "Corporate"
  display_date: "MM/DD/YY"
```

[Troubleshooting](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins)