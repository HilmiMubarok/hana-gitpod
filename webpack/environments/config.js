const environmentDev = require('./environment.dev')
const environmentProd = require('./environment.prod')

module.exports.setConfiguration = (env) => {
    if(env === 'development'){
        return environmentDev
    }else if(env === 'production'){
        return environmentProd;
    }
}