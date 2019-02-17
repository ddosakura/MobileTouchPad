function ani(fn, options = {}) {
    // 1s, 60fps
    const {
        time = 1, fps = 60
    } = options

    const max = fps * time
    const delay = time * 1000 / fps

    let i = 1
    const t = setInterval(function () {
        fn(i, max, function() {
            clearInterval(t)
        })

        i++
        if (i > max) {
            clearInterval(t)
        }
    }, delay)
}

export default function initKB(el, w, h) {
    if (el.lock) {
        return
    }
    el.lock = true

    h -= 20
    el.width = w
    el.height = h

    // const ctx = el.getContext("2d")
    // window.ctx = ctx
    // console.log(ctx)

    // ctx.fillStyle = '#f00f'
    // ctx.fillRect(0, 0, c.width, c.height)

    // ctx.moveTo(0, 0)
    // ctx.lineTo(w, h)
    // ctx.moveTo(w, 0)
    // ctx.lineTo(0, h)
    // ctx.stroke()

    initAni(el, w, h)
}

function initAni(el, w, h) {
    const ctx = el.getContext("2d")

    ani(function(i, max, stop) {
        const per = i / max

        const W = w * per
        const H = h * per
        const sX = (w - W) / 2
        const sY = (h - H) / 2
        const eX = sX + W
        const eY = sY + H

        ctx.moveTo(sX, sY)
        ctx.lineTo(eX, eY)
        ctx.moveTo(eX, sY)
        ctx.lineTo(sX, eY)
        ctx.stroke()
    })
}

export function disableKB(el) {
    if (!el.lock) {
        return
    }
    el.lock = false

    // TODO:
    console.log("disabling")
    el.width = 0
    el.height = 0
}