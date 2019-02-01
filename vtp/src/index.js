import * as Rx from 'rxjs'
import { landscapeOb } from './mql'

console.log(Rx)

window.onload = function() {
    const rootEl = document.getElementById("root")
    const stateEl = document.getElementById("state")
    
    landscapeOb.forEach(b => {
        if (b) {
            stateEl.innerText = "landscape # @"
        } else {
            stateEl.innerText = "portrait # @"
        }
    })
}