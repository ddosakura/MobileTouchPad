// test portrait/landscape

import { create, of, fromEvent, concat } from 'rxjs'
import { map } from 'rxjs/operators'

const mql = window.matchMedia("(orientation: landscape)")
console.log(mql)

mql.addListener(function(e) {
    console.log(e)
})

const landscapeOb = concat(
    of(mql),
    fromEvent(mql, 'change'),
).pipe(map(e => e.matches))

export {
    landscapeOb
}
