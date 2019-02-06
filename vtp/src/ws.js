let ws

export default function wsInit() {
    const url = "ws://" + window.location.host + "/ws"
    console.log(url)
    ws = new WebSocket(url)
    window.ws = ws
    ws.onopen = function () {
        console.log('ws open!')
    }
    ws.onclose = function (e) {
        console.error('ws close!')
    }
    ws.onmessage = function (e) {
        console.log('ws', e)
    }
}

function sendAction(e) {
    ws.send(JSON.stringify(e))
}

export {
    sendAction,
}
