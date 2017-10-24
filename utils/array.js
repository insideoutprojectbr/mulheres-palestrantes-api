function dedup(array){
    return Array.from(new Set(array))
}

function flatten(array){
    return array.reduce((total, item) => [...total, ...item], [])
}

export {dedup, flatten}
