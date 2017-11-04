function filterFieldsFromObject(object, fields=[]){
    return Object.entries(object).reduce((total, [key, value]) => Object.assign(total, value !== null && fields.indexOf(key) === -1 ? {[key]: value} : {}), {})
}

export {filterFieldsFromObject}
