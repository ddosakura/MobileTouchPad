import wsInit, {
    sendAction
} from './ws'
import Hammer from 'hammerjs'
import VTPState from './VTPState'
import {
    fromEvent
} from 'rxjs';

function debug(...v) {
    console.log(v)
    for (let i in v) {
        v[i].forEach(e => console.log(i, e.type, e))
    }
}

function initAction(el) {
    const obj = new Hammer(el)
    obj.get('pinch').set({
        enable: true,
    })
    obj.get('rotate').set({
        enable: true,
    })
    obj.get('pan').set({
        direction: Hammer.DIRECTION_ALL,
    })
    obj.get('swipe').set({
        direction: Hammer.DIRECTION_ALL,
    })

    /*
    const DoubleTap = new Hammer.Tap({
        event: 'doubletap',
        taps: 2,
    })
    manager.add(DoubleTap)

    const TripleTap = new Hammer.Tap({
        event: 'tripletap',
        taps: 3,
    })
    manager.add(TripleTap)
    */

    return {
        // 点击
        tap1$: fromEvent(obj, 'tap'),
        // 双击
        // tap2$: fromEvent(obj, 'doubletap'),
        // 长按
        press$: fromEvent(obj, "pressup"),
        // 移动
        pan$: fromEvent(obj, "panmove"),
        // 移动结束
        panend$: fromEvent(obj, "panend"),
        // 向左滑动
        swipeleft$: fromEvent(obj, "swipeleft"),
        // 向右滑动
        swiperight$: fromEvent(obj, "swiperight"),
        // 向上滑动
        swipeup$: fromEvent(obj, "swipeup"),
        // 向下滑动
        swipedown$: fromEvent(obj, "swipedown"),
        // 捏
        pinchin$: fromEvent(obj, "pinchin"),
        // 放
        pinchout$: fromEvent(obj, "pinchout"),
        // 旋转
        // rotate$: fromEvent(obj, "rotatemove"),
    }
}

export default function actionInit(el, sendState) {
    wsInit()

    const vtps = new VTPState({
        mode: 0, // 0-1
        speed: 6, // 1-10
    }, sendState)

    const {
        tap1$,
        /*tap2$,*/
        press$,
        pan$,
        panend$,
        swipeleft$,
        swiperight$,
        swipeup$,
        swipedown$,
        pinchin$,
        pinchout$,
        /*rotate$,*/
    } = initAction(el)

    debug(tap1$,
        /*tap2$,*/
        press$,
        pan$,
        panend$,
        pinchin$,
        pinchout$,
        /*rotate$,*/
    )

    // 模式切换
    swipeleft$.subscribe(e => vtps.rmode())
    swiperight$.subscribe(e => vtps.lmode())

    // mode-0 速度调整
    // mode-1 上下滚轮
    swipeup$.subscribe(e => {
        console.log(e)
        if (vtps.mode() == 0) {
            // 减速
            vtps.lspeed()
        }
        if (vtps.mode() == 1) {
            // 滚轮（上）
            sendAction({
                type: 'scroll-up',
                speed: vtps.speed(),
            })
        }
    })
    swipedown$.subscribe(e => {
        console.log(e)
        if (vtps.mode() == 0) {
            // 加速
            vtps.rspeed()
        }
        if (vtps.mode() == 1) {
            // 滚轮（下）
            sendAction({
                type: 'scroll-down',
                speed: vtps.speed(),
            })
        }
    })

    // 按键抬起&放下
    pinchin$.subscribe(e => {
        sendAction({
            type: 'mouse-down',
        })
    })
    pinchout$.subscribe(e => {
        sendAction({
            type: 'mouse-up',
        })
    })
}