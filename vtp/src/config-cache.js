function load() {
    const c = localStorage.getItem('config')
    return c ? JSON.parse(c) : {}
}

function save(o) {
    const c = Object.assign(load(), o)
    localStorage.setItem('config', JSON.stringify(c))
}

export {
    load,
    save,
}