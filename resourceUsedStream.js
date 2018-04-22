const io = require('socket.io-client')
const Kefir = require('kefir')
const request = require('superagent')
const config = require('./configuration')
const utils = require('./utils')
const socket = io('ws://' + config.brainLocation)

var resourceUsed //
module.exports = Kefir.stream(emitter => {
    resourceUsed = emitter.emit
}).log('resourceUsedStream')

console.log('starting resource used stream')

socket.on('connect', ()=> {
    console.log('socket connected')
    utils.auth( config.brainLocation, config.resourceId, config.secret, (err, token)=>{

        console.log('authenticated', {err, token})
        socket.emit('authentication', {
            token
        })

        socket.on('authenticated', () => {
          console.log('Connected with authentication!!!!*!~!!*~!~!~*~~')

          socket.on('eventstream', ev => {
            console.log('evstream', ev)
            if (
                ev.type === 'invoice-paid' &&
                ev.ownerId === config.resourceId
            ){
                let amount = 1
                resourceUsed(amount)
            }

            if (
                ev.type === 'resource-used' &&
                ev.resourceId === config.resourceId
            ){
                let amount = 1
                resourceUsed(amount)
            }
          })
        })
    })



})
