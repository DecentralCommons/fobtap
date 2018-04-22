
const config = require('./configuration')
const request = require('superagent')
const cryptoUtils = require('./crypto')
const fobtapStream = require('./fobtapStream')
const state = require('./state')

require('./reactions/' + config.reaction)

state.initialize()

fobtapStream
  .throttle(2345, {trailing: false})
  .onValue(fob => {
    console.log('making request with token', state.state.token)
    
    request
        .post(config.brainLocation + 'fobtap')
        .set('Authorization', state.state.token || 'xxx')
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
