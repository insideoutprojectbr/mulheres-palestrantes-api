const handleError = (err, ctx) => { // eslint-disable-line no-unused-vars
    console.log(err)
    let errors = [err.message]
    if (err.errors) {
        errors = Object.values(err.errors).map(value => value.message)
    }
    if (err.isJoi){
        errors = err.details.map(value => value.message)
    }
    ctx.status = err.status || 500
    ctx.body = {"errors": errors}
}

export {
    handleError
}
