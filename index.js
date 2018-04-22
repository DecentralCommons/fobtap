
const config = require('./configuration')
const request = require('superagent')
const cryptoUtils = require('./crypto')
const fobtapStream = require('./fobtapStream')
const utils = require('./utils')
const reaction = require('./reactions/' + config.reaction)
const io = require('socket.io-client')
const socket = io('ws://' + config.brainLocation)

utils.auth(config.brainLocation, config.resourceId, config.secret, (err, token)=> {

  console.log('starting fobtap stream with auth:', token)

  fobtapStream
    .throttle(2345, {trailing: false})
    .onValue(fob => {

      console.log('attempting to register fobtap with token:', token)

      request
          .post(config.brainLocation + 'fobtap')
          .set('Authorization', token )
          .send({
              fob,
              resourceId: config.resourceId
          })
          .end( (err, res)=>{
              if (err) {
                  console.log({err})
              } else {
                  console.log('fobtap registered!')
              }
          })
  })

  socket.on('connect', ()=> {

      socket.emit('authentication', {
          token
      })
          socket.on('authenticated', () => {
              console.log('Connected with authentication!!!!*!~!!*~!~!~*~~')

              socket.on('eventstream', ev => {
                  console.log('evstream', ev)
                  if (
                      ev.ownerId === config.resourceId &&
                      (ev.type === 'invoice-paid' || ev.type === 'resource-used')
                  ){
                      let amount = 1
                      reaction(amount)
                  }
              })
          })
      })
})
