const modeList = [
    'System Config',
    'TouchBar Mode',
]

export default class VTPState {
    constructor(s, sendState) {
        this.state = s
        this.sendState = sendState
        this.__update()
    }
    __update() {
        const mode = `[${modeList[this.state.mode]}]: `
        const speed = `speed-${this.state.speed}`
        this.sendState(`${mode}${speed}`)
    }
    update(s) {
        Object.assign(this.state, s)
        this.__update()
    }

    mode() {
        return this.state.mode
    }
    lmode() {
        if (this.state.mode>0) {
            this.state.mode--
        }
        this.__update()
    }
    rmode() {
        if (this.state.mode<modeList.length-1) {
            this.state.mode++
        }
        this.__update()
    }

    speed() {
        return this.state.speed
    }
    lspeed() {
        if (this.state.speed>1) {
            this.state.speed--
        }
        this.__update()
    }
    rspeed() {
        if (this.state.speed<10) {
            this.state.speed++
        }
        this.__update()
    }
}