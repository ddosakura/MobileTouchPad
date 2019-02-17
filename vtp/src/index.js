import {
    fromEvent,
} from 'rxjs'
//import {
//    landscape$,
//} from './mql'
// import configInit from './config'
// import touchInit from './touch'

import actionInit from './actions'
import initKB, {
    disableKB,
} from './keyboard'
import initMKB from './mkb'

window.onload = function () {
    // 禁止 iOS 下的页面异常滚动
    //document.body.ontouchmove= e => e.preventDefault()
    document.body.addEventListener('touchmove', e => e.preventDefault(), {
        passive: false
    })

    const rootEl = document.getElementById("root")

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

    const mkb = document.getElementById("m-inputer")
    const kb = document.getElementById("inputer")
    fromEvent(new Hammer(stateEl), 'tap').subscribe(() => {
        mkb.className = 'hide'
        disableKB(kb)
    })

    const elI = document.getElementById("mi")
    const elT = document.getElementById("m-tap")
    const elS = document.getElementById("m-send")
    const elU = document.getElementById("m-up")
    const elD = document.getElementById("m-down")
    const elR = document.getElementById("m-reset")
    initMKB(elI, elT, elS, elU, elD, elR)

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
        elr: objEl_R,
        initKB: function () {
            initKB(kb, rootEl.clientWidth, rootEl.clientHeight)
        },
        initMKB: function () {
            mkb.className = ''
            elI.focus()
        },
    }, function (state) {
        stateEl.innerHTML = state
    })
}