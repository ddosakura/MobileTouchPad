import {
    webSocket,
    WebSocketSubject,
} from 'rxjs/webSocket'


const url = "ws://" + window.location.host + "/ws"
let socket$

function init() {
    socket$ = webSocket(url)
    socket$.subscribe(
        (msg) => console.log('message received: ' + msg),
        (err) => socket$ = null,
        () => console.log('complete')
    )
}

export default function wsInit() {
    init()
}

function sendAction(e) {
    console.log(socket$, e)
    if (socket$ == null) {
        init()
    }
    // auto JSON.stringify
    socket$.next(e)
}

export {
    sendAction,
}