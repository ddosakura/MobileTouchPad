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

function moveAction(e) {
    console.log(e)
}

function resetAction(e) {
    console.warn(e)
}

function clickAction(t, e) {
    console.log(t, e)
}

export default function touchInit(el) {
    window.el = el

    const ts$ = fromEvent(obj, "touchstart")
    const tm$ = fromEvent(obj, "touchmove")
    const te$ = fromEvent(obj, "touchend")

    ts$.pipe(
        map(e => e.touches[0]),
        concatMap(se => tm$.pipe(
            map(e => e.changedTouches[0]),
            map(me => ({
                x: me.clientX - se.clientX,
                y: me.clientY - se.clientY,
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
                clickAction('l', ee.p)
            } else {
                clickAction('r', ee.p)
            }
        })
    })
}