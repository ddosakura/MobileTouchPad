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
import {
    landscape$,
} from './mql'

function debug(...v) {
    for (let i in v) {
        v[i].forEach(e => console.log(i, e))
    }
}

let P = 100

export default function configInit(area, obj, val) {
    function fresh(p) {
        val.innerHTML = p
        obj.style.top = (max * (101 - p) / 100 + min) + 'px'
    }

    const min = 10
    let max
    landscape$.subscribe(b => {
        max = area.clientHeight - 50
        fresh(P)
    })

    function countP(e) {
        const p = 101 - Math.round((e.y - min) / (max - min) * 100)
        P = p
        return p
    }

    // const ts$ = fromEvent(obj, "touchstart")
    const tm$ = fromEvent(obj, "touchmove").pipe(map(e => e.changedTouches[0]))
    // const te$ = fromEvent(obj, "touchend")

    const bb = tm$.pipe(
        map(e => ({
            x: e.clientX - 35,
            y: e.clientY - 35,
        })),
        // filter(e => e.y > min && e.y < maxH),
        map(countP),
        filter(p => p > 0 && p <= 100),
    )
    bb.subscribe(fresh)

    /*
    const bb = ts$.pipe(
        concatMap(se => tm$.pipe(
            map(me => ({
                left: me.clientX,
                top: me.clientY,
            })),
            takeUntil(te$),
        )),
    )
    */

    /*
    mouseDown$.pipe(
        concatMap(mouseDownEvent => mouseMove$.pipe(map(mouseMoveEvent => ({
                left: mouseMoveEvent.clientX - mouseDownEvent.offsetX,
                top: mouseMoveEvent.clientY - mouseDownEvent.offsetY
            })),
            takeUntil(mouseUp$)
        ))
    ).subscribe(position => {
        eleDrag.style.left = position.left + 'px'
        eleDrag.style.top = position.top + 'px'
    })
    */

    // debug(ts$, tm$, te$, bb)
}

export {
    P as speed,
}

// plan2 (hammerjs)

