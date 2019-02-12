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
    skip,
    find,
} from 'rxjs/operators'
import wsInit, {
    sendAction
} from './ws'
import Hammer from 'hammerjs'
import VTPState from './VTPState'

function debug(...v) {
    console.log(v)
    for (let i in v) {
        v[i].forEach(e => console.log(i, e.type, e))
    }
}

function initAction(el, ell, elc, elr) {
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

    const objl = new Hammer(ell)
    const objc = new Hammer(elc)
    const objr = new Hammer(elr)

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
        tapl$: fromEvent(objl, 'tap'),
        tapc$: fromEvent(objc, 'tap'),
        tapr$: fromEvent(objr, 'tap'),
        // 双击
        // tap2$: fromEvent(obj, 'doubletap'),
        // 长按
        pressl$: fromEvent(objl, "pressup"),
        pressc$: fromEvent(objc, "pressup"),
        pressr$: fromEvent(objr, "pressup"),
        // 移动
        panstart$: fromEvent(obj, "panstart"),
        pan$: fromEvent(obj, "panmove"),
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

export default function actionInit({
    el,
    ell,
    elc,
    elr,
}, sendState) {
    wsInit()

    const vtps = new VTPState(sendState)

    const {
        tapl$,
        tapc$,
        tapr$,
        pressl$,
        pressc$,
        pressr$,
        panstart$,
        pan$,
        panend$,
        swipeleft$,
        swiperight$,
        swipeup$,
        swipedown$,
        pinchin$,
        pinchout$,
        /*rotate$,*/
    } = initAction(el, ell, elc, elr)

    debug(
        /*rotate$,*/
    )

    /*
    // 模式切换
    swipeleft$.subscribe(e => vtps.rmode())
    swiperight$.subscribe(e => vtps.lmode())

    // mode-0 速度调整
    // mode-1 上下滚轮
    swipeup$.subscribe(e => {
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
    */

    // 速度调整
    swipeleft$.subscribe(e => vtps.lspeed())
    swiperight$.subscribe(e => vtps.rspeed())
    // 上下滚轮
    swipeup$.subscribe(e => {
        // 滚轮（上）
        sendAction({
            type: 'scroll-up',
            speed: vtps.speed(),
        })
    })
    swipedown$.subscribe(e => {
        // 滚轮（下）
        sendAction({
            type: 'scroll-down',
            speed: vtps.speed(),
        })
    })

    // 鼠标点击
    tapl$.subscribe(e => {
        sendAction({
            type: 'left',
        })
    })
    tapc$.subscribe(e => {
        sendAction({
            type: 'center',
        })
    })
    tapr$.subscribe(e => {
        sendAction({
            type: 'right',
        })
    })

    /*
    // 主键抬起&放下
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
    */

    // 按键抬起&放下
    makeDownAndUpAction(pressl$, 'left')
    makeDownAndUpAction(pressc$, 'center')
    makeDownAndUpAction(pressr$, 'right')

    // 鼠标移动
    panstart$.pipe(
        concatMap(s => pan$.pipe(
            skip(5),
            map(e => e.changedPointers[0]),
            map(me => ({
                x: me.clientX, // - se.clientX,
                y: me.clientY, // - se.clientY,
            })),
            takeUntil(panend$),
        )),
    ).subscribe(e => {
        sendAction({
            type: 'move',
            speed: vtps.speed(),
            x: e.x,
            y: e.y,
        })
    })
    panend$.pipe(
        map(e => e.changedPointers[0]),
        map(e => ({
            x: e.clientX,
            y: e.clientY,
        })),
    ).subscribe(e => {
        sendAction({
            type: 'reset',
            x: e.x,
            y: e.y,
        })
    })
}

function makeDownAndUpAction($, data) {
    $.pipe(
        filter((v, i) => (i & 1) === 0),
    ).subscribe(() => {
        sendAction({
            type: 'mouse-down',
            data,
        })
    })
    $.pipe(
        filter((v, i) => (i & 1) === 1),
    ).subscribe(() => {
        sendAction({
            type: 'mouse-up',
            data,
        })
    })
}
