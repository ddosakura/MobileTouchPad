import {
    fromEvent,
} from 'rxjs'
//import {
//    landscape$,
//} from './mql'
// import configInit from './config'
// import touchInit from './touch'

import actionInit from './actions'

window.onload = function () {
    // 禁止 iOS 下的页面异常滚动
    //document.body.ontouchmove= e => e.preventDefault()
    document.body.addEventListener('touchmove', e => e.preventDefault(), {
        passive: false
    })

    // const rootEl = document.getElementById("root")

    const stateEl = document.getElementById("state")
    /*
    landscape$.forEach(b => {
        console.log(b)
        if (b) {
            stateEl.innerText = "landscape # @"
        } else {
            stateEl.innerText = "portrait # @"
        }
    })
    */

    /*
    const configEl = document.getElementById("config")
    const configBlockEl = document.getElementById("config-block")
    const configValEl = document.getElementById("config-val")
    configInit(configEl, configBlockEl, configValEl)
    */

    const objEl = document.getElementById("obj")
    const objEl_L = document.getElementById("obj-left")
    const objEl_C = document.getElementById("obj-center")
    const objEl_R = document.getElementById("obj-right")
    // touchInit(objEl)
    actionInit({
        el: objEl,
        ell: objEl_L,
        elc: objEl_C,
        elr: objEl_R
    }, function (state) {
        stateEl.innerHTML = state
    })
}