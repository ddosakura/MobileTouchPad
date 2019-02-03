import {
    Observable,
    of ,
    fromEvent,
    concat
} from 'rxjs'
import {
    map,
    concatlAll,
    concatMap,
    takeUntil,
    filter,
} from 'rxjs/operators'
import { speed } from './config'

let ws

function send(e) {
    ws.send(JSON.stringify(e))
}

function moveAction(e) {
    if (ws.readyState !== 1) {
        alert("WS ERROR!")
        return
    }
    e.type = 'move'
    e.speed = speed
    send(e)
}

function resetAction(e) {
    if (ws.readyState !== 1) {
        alert("WS ERROR!")
        return
    }
    e.type = 'reset'
    send(e)
}

function clickAction(t, e) {
    if (ws.readyState !== 1) {
        alert("WS ERROR!")
        return
    }
    e.type = t
    send(e)
}

export default function touchInit(el) {
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

    const ts$ = fromEvent(obj, "touchstart")
    const tm$ = fromEvent(obj, "touchmove")
    const te$ = fromEvent(obj, "touchend")

    ts$.pipe(
        map(e => e.touches[0]),
        concatMap(se => tm$.pipe(
            map(e => e.changedTouches[0]),
            map(me => ({
                x: me.clientX, // - se.clientX,
                y: me.clientY, // - se.clientY,
            })),
            takeUntil(te$),
        )),
    ).subscribe(moveAction)

    te$.pipe(
        map(e => e.changedTouches[0]),
        map(e => ({
            x: e.clientX,
            y: e.clientY,
        })),
    ).subscribe(resetAction)

    /*
    const singleTap$ = fromEvent(el, 'click')
    singleTap$.subscribe(e => {
        console.log('left')
    })
    */

    ts$.subscribe(se => {
        te$.pipe(
            takeUntil(ts$),
            takeUntil(tm$),
            map(e => ({
                timeStamp: e.timeStamp,
                p: {
                    x: e.changedTouches[0].clientX,
                    y: e.changedTouches[0].clientY,
                }
            })),
        ).subscribe(ee => {
            if (ee.timeStamp - se.timeStamp < 300) {
                clickAction('left', ee.p)
            } else {
                clickAction('right', ee.p)
            }
        })
    })
}