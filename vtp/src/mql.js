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

const mql = window.matchMedia("(orientation: landscape)")

const eventAgent = Observable.create(ob => {
    mql.addListener(function (e) {
        ob.next(e)
    })
})


const landscape$ = concat( of (mql),
    // fromEvent(mql, 'change'),
    eventAgent,
).pipe(map(e => e.matches))

// const replayLandscape$ = new ReplaySubject(1)
// landscape$.subscribe(e => {
//     replayLandscape$.next(e)
// })

export {
    landscape$,
    // replayLandscape$,
}