// test portrait/landscape

import {
    Observable,
    ReplaySubject,
    of ,
    /*fromEvent,*/ concat
} from 'rxjs'
import {
    map
} from 'rxjs/operators'

// const mql = window.matchMedia("(orientation: landscape)")
const mql = window.matchMedia("(orientation: portrait)")
window.mql = mql

const eventAgent = Observable.create(ob => {
    console.log("init ea", ob)
    mql.addListener(function (e) {
        console.log(e)
        ob.next(e)
    })
})
eventAgent.forEach(console.warn)


const landscape$ = concat( of (mql),
    // fromEvent(mql, 'change'),
    eventAgent,
).pipe(map(e => !e.matches))

// const replayLandscape$ = new ReplaySubject(1)
// landscape$.subscribe(e => {
//     replayLandscape$.next(e)
// })

export {
    landscape$,
    // replayLandscape$,
}