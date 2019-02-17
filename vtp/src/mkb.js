import {
    fromEvent,
} from 'rxjs'
import wsInit, {
    sendAction
} from './ws'

export default function initMKB(elI, elT, elS, elU, elD, elR) {
    console.log(elI, elT, elS)
    fromEvent(elT, 'click').subscribe(() => {
        sendAction({
            type: 'key',
            data: elI.value,
        })
        elI.focus()
    })
    fromEvent(elS, 'click').subscribe(() => {
        sendAction({
            type: 'input',
            data: elI.value,
        })
        elI.focus()
    })

    fromEvent(elU, 'click').subscribe(() => {
        sendAction({
            type: 'keyup',
            data: elI.value,
        })
        elI.value = ''
        elI.focus()
    })
    fromEvent(elD, 'click').subscribe(() => {
        sendAction({
            type: 'keydown',
            data: elI.value,
        })
        elI.value = ''
        elI.focus()
    })

    fromEvent(elR, 'click').subscribe(() => {
        elI.value = ''
        elI.focus()
    })
}