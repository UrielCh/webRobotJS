// @ts-check

/* eslint no-redeclare: 0 */
/* eslint camelcase: 0 */
/* eslint indent: ["error", 4, { "ignoredNodes": ["ConditionalExpression"] }] */
/* eslint curly: ["error", "multi", "consistent"] */

// var http = require('http');

/*
var log4js = require('log4js')
log4js.configure({
    appenders: {
        console: {
            type: 'console'
        },
        file: {
            type: 'file',
            filename: 'logs-error.log',
            category: 'webserver'
        }
    },
    categories: {
        default: {
            appenders: ['console'],
            level: 'info'
        }
    }
})
*/ 
const express = require('express')
const app = express()
app.use(require('body-parser').json())

app.get('/', (req, res) => res.send(`<html>
<header>zService</header>
<body>
<pre>
usage:

GET /kill : stop the service

POST /control-mouse : create mouse event
    {
        "mode": "move"|"move_click"|"click",
        "x": number,
        "y": number,
        "smooth": boolean,
    }
    or
    {
        "mode": "drag"
        "start_x": number,
        "start_y": number,
        "end_x": number,
        "end_y": number,
    }
    or
    {
        "mode": "scroll"
        "amount": number,
    }

POST /keypress:
    {
        key: string,
        flag: "shift"|,
    }

POST /control-keyboard:
    {
        "mode": "key"
    }
    or
    {
        "mode": "paste"|"f[1-12]"|"backspace"|"delete" ...
    }
</pre>
</body>
</html>`))
// app.listen(3000, () => console.log('Example app listening on port 3000!'))

const robot = require('robotjs')

app.get('/kill', (req, res) => {
    setTimeout(() => process.exit(1), 20);
    res.json({ message: 'bye in 20 ms' });
});

app.get('/control-mouse', (req, res) => res.status(500).json({ error: 'Missing POST data' }))
app.post('/control-mouse', (req, res) => {
    const { mode, data } = req.body
    robot.updateScreenMetrics();

    console.log(mode, data)
    if (mode === 'set_mouse_position' || mode === 'move') {
        const { x, y, smooth } = data
        let time = 0;
        if (smooth)
            time = robot.moveMouseSmooth(x, y)
        else
            robot.moveMouse(x, y)
        return res.json({ message: 'ok', time })
    }
    if (mode === 'click_mouse_position' || mode === 'move_click') {
        const { x, y, smooth } = data
        let time = 0;
        if (smooth)
            time = robot.moveMouseSmooth(x, y)
        else
            robot.moveMouse(x, y)
        robot.mouseClick()
        return res.json({ message: 'ok', time })
    }
    if (mode === 'click') {
        robot.mouseClick()
        return res.json({ message: 'ok' })
    }
    if (mode === 'drag') {
        const { start_x, start_y, end_x, end_y } = data // , duration
        robot.moveMouse(start_x, start_y)
        robot.mouseToggle('down')
        robot.dragMouse(end_x, end_y)
        robot.mouseToggle('up')
        return res.json({ message: 'ok' })
    }
    if (mode === 'scroll') {
        const { amount } = data // , duration
        robot.scrollMouse(0, amount) //  duration)
        return res.json({ message: 'ok' })
    }
    console.log('error 500', data)
    return res.status(500).json({ error: 'unsupported control-mouse' })
})

// curl --header "Content-Type: application/json"  --data '{"key":"2", "flag":"shift"}' -X POST http://127.0.0.1:9000/keypress
app.post('/keypress', (req, res) => {
    const { key, flag } = req.body
    robot.keyTap(key, flag)
    return res.json({ message: 'ok' })
})

// curl --header "Content-Type: application/json"  --data '{"mode":"key","data":{"input":"@"}}' -X POST http://127.0.0.1:9000/control-keyboard
// curl --header "Content-Type: application/json"  --data '{"mode":"key","data":{"input":"T@TO"}}' -X POST http://127.0.0.1:9000/control-keyboard
app.post('/control-keyboard', (req, res) => {
    const { mode, data } = req.body
    if (mode === 'simulate_keyboard' || mode === 'keyboard' || mode === 'key') {
        console.log(mode, data)
        var { input, interval } = data
        var cpm = 60000 / interval
        // console.log('Typing speed:', cpm)
        const time = robot.typeStringDelayed(input, cpm)
        return res.json({ message: 'ok', time })
    } else {
        console.log(mode)
    }
    // if (mode == 'copy') {
    // input_txt = data['input']
    // clipboard.copy(input_txt)
    // return res.json({message:'ok'});
    // }
    //if (mode === 'arobase') {
    //    robot.keyTap('2', 'shift')
    //    return res.json({ message: 'ok' })
    //}
    if (mode === 'paste') {
        robot.keyTap('v', 'control')
        return res.json({ message: 'ok' })
    }
    if (mode === 'simulate_enter') { // deprecated
        robot.keyTap('enter')
        return res.json({ message: 'ok' })
    }
    switch (mode) {
        case 'f1':
        case 'f2':
        case 'f3':
        case 'f4':
        case 'f5':
        case 'f6':
        case 'f7':
        case 'f8':
        case 'f9':
        case 'f10':
        case 'f11':
        case 'f12':
        case 'backspace':
        case 'delete':
        case 'enter':
        case 'tab':
        case 'escape':
        case 'up':
        case 'down':
        case 'right':
        case 'left':
        case 'home':
        case 'end':
        case 'pageup':
        case 'pagedown':
        case 'command':
        case 'alt':
        case 'control':
        case 'shift':
        case 'right_shift':
        case 'space':
        case 'printscreen':
        case 'insert':
        case 'audio_mute':
        case 'audio_vol_down':
        case 'audio_vol_up':
        case 'audio_play':
        case 'audio_stop':
        case 'audio_pause':
        case 'audio_prev':
        case 'audio_next':
        //case 'audio_rewind': http://robotjs.io/docs/syntax
            robot.keyTap(mode)
            return res.json({ message: 'ok' })
    }

    return res.status(500).json({ error: 'unsupported control-keyboard' })
})

module.exports = app

