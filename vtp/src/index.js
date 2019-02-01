import {
    fromEvent,
} from 'rxjs'
import {
    landscape$,
} from './mql'
import configInit from './config'
import touchInit from './touch'

window.onload = function () {
    document.body.onmousemove = e => e.preventDefault()
    // const rootEl = document.getElementById("root")

    const stateEl = document.getElementById("state")
    landscape$.forEach(b => {
        if (b) {
            stateEl.innerText = "landscape # @"
        } else {
            stateEl.innerText = "portrait # @"
        }
    })

    const configEl = document.getElementById("config")
    const configBlockEl = document.getElementById("config-block")
    const configValEl = document.getElementById("config-val")
    configInit(configEl, configBlockEl, configValEl)

    const objEl = document.getElementById("obj")
    touchInit(objEl)
}