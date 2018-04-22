
const config = require('./configuration')
const request = require('superagent')
const cryptoUtils = require('./crypto')
const fobtapStream = require('./fobtapStream')
const utils = require('./utils')

require('./reactions/' + config.reaction)

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
                  // TODO:
                  // if (config.reaction === 'door' && filter.contains( cryptoUtils.createHash(fob))){
                  //     console.log('fob passed bloom filter')
                  //     door()
                  // }
                  // return console.log('err res from server, may be down need a fallback', err)
              } else {
                  console.log('fobtap registered!')
              }
          })
  })





})
