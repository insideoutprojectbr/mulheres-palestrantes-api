function dedupe(array){
    return Array.from(new Set(array))
}

function flatten(array){
    return array.reduce((total, item) => [...total, ...item], [])
}

export {dedupe, flatten}
