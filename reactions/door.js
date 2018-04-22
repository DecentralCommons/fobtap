
const Gpio = require('onoff').Gpio
const pin = new Gpio(17, 'out')

function door(){
    console.log('door ')
    pin.writeSync(1)
    setTimeout(()=>{
        pin.writeSync(0)
    }, 12345)
}

module.exports = door
