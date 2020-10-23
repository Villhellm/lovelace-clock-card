function leadingZero(numberString) {
    if (numberString.toString().length == 1) {
        return '0' + numberString;
    }
    else {
        return numberString;
    }
}

Date.prototype.format = function (formatString) {
    var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var twlv = this.getHours() == 0 ? 12 : this.getHours() > 12 ? this.getHours() - 12 : this.getHours();
    var ampm = this.getHours() >= 12 ? "PM" : "AM";

    formatString = formatString.replace(/hh/g, leadingZero(twlv));
    formatString = formatString.replace(/h/g, twlv);
    formatString = formatString.replace(/mm/g, leadingZero(this.getMinutes()));
    formatString = formatString.replace(/m/g, this.getMinutes());
    formatString = formatString.replace(/ss/g, leadingZero(this.getSeconds()));
    formatString = formatString.replace(/s/g, this.getSeconds());
    formatString = formatString.replace(/HH/g, leadingZero(this.getHours()));
    formatString = formatString.replace(/H/g, this.getHours());
    formatString = formatString.replace(/YYYY/g, this.getFullYear());
    formatString = formatString.replace(/YY/g, this.getFullYear().toString().substr(2));
    formatString = formatString.replace(/MMMM/g, 'ZZZZ');
    formatString = formatString.replace(/MMM/g, 'ZZZ');
    formatString = formatString.replace(/MM/g, leadingZero(this.getMonth() + 1));
    formatString = formatString.replace(/M/g, this.getMonth() + 1);
    formatString = formatString.replace(/DDDD/g, 'XXXX');
    formatString = formatString.replace(/DDD/g, 'XXX');
    formatString = formatString.replace(/DD/g, leadingZero(this.getDate()));
    formatString = formatString.replace(/D/g, this.getDate());

    formatString = formatString.replace(/a/g, ampm);
    formatString = formatString.replace(/ZZZZ/g, monthNames[this.getMonth() + 12]);
    formatString = formatString.replace(/ZZZ/g, monthNames[this.getMonth()]);
    formatString = formatString.replace(/XXXX/g, dayNames[this.getDay() + 7]);
    formatString = formatString.replace(/XXX/g, dayNames[this.getDay()]);
    return formatString;
};

function timezoneTime(time_zone) {
    return new Date((new Date()).toLocaleString('en-US', {timeZone: time_zone}));
}

class ClockCard extends HTMLElement {

    set hass(hass) {
        if (!this.content) {
            var config = this.config;
            var theme = config.theme ? config.theme : {};
            var clock_size = config.size ? config.size : 300;
            var font_size = config.font_size ? config.font_size : 20;
            const card = document.createElement('ha-card');
            this.content = document.createElement('div');
            this.content.style.display = "flex";
            this.content.style.alignItems = "center";
            this.content.style.alignContent = "center";
            this.content.style.justifyContent = "center";
            this.content.style.flexDirection = "column";
            this.content.style.padding = "5px";
            const current_tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            var formatted_timezone = (config.time_zone ? config.time_zone : current_tz).replace('_', " ");
            var caption;
            if (config.caption) {
                caption = config.caption;
            }
            else {
                caption = config.show_continent ?
                    (config.show_city ? formatted_timezone : formatted_timezone.substr(0, formatted_timezone.indexOf("/"))) :
                    (config.show_city ? formatted_timezone.substr(formatted_timezone.indexOf("/") + 1) : "");
            }
            var timezone_html = caption ? `<p id="time_caption" style="font-size:${font_size}px">${caption}</p>` : "";
            var now = config.time_zone ? timezoneTime(config.time_zone) : new Date();
            timezone_html = config.display_date ? timezone_html + `<p id="display_date" style="font-size:${font_size}px">${now.format(config.display_date)}</p>` : timezone_html;
            this.content.innerHTML = `<canvas width="${clock_size}px" height="${clock_size}px"></canvas>${timezone_html}`;
            card.appendChild(this.content);
            this.appendChild(card);
            var canvas = this.content.children[0];
            var dateTimeP = config.display_date ? caption ? this.content.children[2] : this.content.children[1] : null;
            var ctx = canvas.getContext("2d");
            var radius = canvas.height / 2;
            ctx.translate(radius, radius);
            radius = radius * 0.90
            drawClock();
            setInterval(drawClock, 1000);

            function drawClock() {
                drawFace(ctx, radius);
                drawNumbers(ctx, radius);
                drawTime(ctx, radius, dateTimeP);
            }

            function drawFace(ctx, radius) {
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, 2 * Math.PI);
                ctx.fillStyle = theme.background ? theme.background : getComputedStyle(document.documentElement).getPropertyValue('--primary-background-color');
                ctx.fill();
                ctx.strokeStyle = theme.border ? theme.border : theme.hands ? theme.hands : getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
                ctx.lineWidth = radius * 0.03;
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
                ctx.fillStyle = '#333';
                ctx.fill();
            }

            function drawNumbers(ctx, radius) {
                var ang;
                var num;
                ctx.font = radius * 0.15 + "px arial";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                for (num = 1; num < 13; num++) {
                    ang = num * Math.PI / 6;
                    ctx.fillStyle = theme.numbers ? theme.numbers : getComputedStyle(document.documentElement).getPropertyValue('--primary-text-color');
                    ctx.rotate(ang);
                    ctx.translate(0, -radius * 0.85);
                    ctx.rotate(-ang);
                    ctx.fillText(num.toString(), 0, 0);
                    ctx.rotate(ang);
                    ctx.translate(0, radius * 0.85);
                    ctx.rotate(-ang);
                }
            }

            function drawTime(ctx, radius, dateTimeP) {
                var now = new Date();
                var local_hour = now.getHours();
                if (config && config.time_zone) {
                    try {
                        var local_hour = parseInt(now.toLocaleString(navigator.language, { hour: '2-digit', hour12: true, timeZone: config.time_zone }).substr(0, 2));
                    }
                    catch{
                        console.log("Analog Clock: Invalid timezone")
                    }
                }
                if (dateTimeP != null) {
                    var now = config.time_zone ? timezoneTime(config.time_zone) : new Date();
                    dateTimeP.innerHTML = now.format(config.display_date);
                }
                var hour = local_hour;
                var minute = now.getMinutes();
                var second = now.getSeconds();
                //hour
                hour = hour % 12;
                hour = (hour * Math.PI / 6) +
                    (minute * Math.PI / (6 * 60)) +
                    (second * Math.PI / (360 * 60));
                drawHand(ctx, hour, radius * 0.5, radius * 0.07);
                //minute
                minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
                drawHand(ctx, minute, radius * 0.8, radius * 0.07);
                // second
                if (!config.disable_seconds) {
                    second = (second * Math.PI / 30);
                    drawHand(ctx, second, radius * 0.9, radius * 0.02);
                }
            }

            function drawHand(ctx, pos, length, width) {
                ctx.strokeStyle = theme.hands ? theme.hands : getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
                ctx.beginPath();
                ctx.lineWidth = width;
                ctx.lineCap = "round";
                ctx.moveTo(0, 0);
                ctx.rotate(pos);
                ctx.lineTo(0, -length);
                ctx.stroke();
                ctx.rotate(-pos);
            }
        }
    }


    setConfig(config) {
        this.config = config;
    }

    getCardSize() {
        return 3;
    }
}

customElements.define('clock-card', ClockCard);
