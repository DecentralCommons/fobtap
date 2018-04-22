const config = require('./configuration')
const uuidV1 = require('uuid/v1')
const request = require('superagent')
const cryptoUtils = require('./crypto')
const utils = require('./utils')

const state = {
    token: ''
}

function initialize(){
    console.log('initializing connection')
    utils.auth(config.brainLocation, config.resourceId, config.secret, (err, token)=>{
        if (err) {
            console.log('initialize error:', err )
        }
        state.token = token
        console.log('state updated', state)
    })
}

module.exports = {
    state,
    initialize
}
