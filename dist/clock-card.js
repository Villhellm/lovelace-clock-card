var config;
class ClockCard extends HTMLElement {

    set hass(hass) {
        if (!this.content) {
            config = this.config;
            var clock_size = config.size ? config.size : 300;
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
            var timezone_html = config.show_timezone ? `<p style="font-size:20px">${formatted_timezone}</p>` : "";
            this.content.innerHTML = `<canvas width="${clock_size}px" height="${clock_size}px"></canvas>${timezone_html}`;
            card.appendChild(this.content);
            this.appendChild(card);
            var canvas = this.content.children[0];
            var ctx = canvas.getContext("2d");
            var radius = canvas.height / 2;
            ctx.translate(radius, radius);
            radius = radius * 0.90
            drawClock();
            setInterval(drawClock, 1000);

            function drawClock() {
                drawFace(ctx, radius);
                drawNumbers(ctx, radius);
                drawTime(ctx, radius);
            }

            function drawFace(ctx, radius) {
                var grad;
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, 2 * Math.PI);
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-background-color');
                ctx.fill();
                ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
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
                    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-text-color');
                    ctx.rotate(ang);
                    ctx.translate(0, -radius * 0.85);
                    ctx.rotate(-ang);
                    ctx.fillText(num.toString(), 0, 0);
                    ctx.rotate(ang);
                    ctx.translate(0, radius * 0.85);
                    ctx.rotate(-ang);
                }
            }

            function drawTime(ctx, radius) {
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
                ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
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

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
        return 3;
    }
}

customElements.define('clock-card', ClockCard);