
const config = require('../configuration')
const Kefir = require('kefir')
const Gpio = require('onoff').Gpio

// pins connected to hoppers (dispense):
const pin17 = new Gpio(17, 'out')
// const pin18 = new Gpio(18, 'out') // prev used for hardware test

// pins attached to hopper empty reader // 22 - hopper 1
const pin22 = new Gpio(22, 'in', 'both') // hopperOneCam
const pin23 = new Gpio(23, 'in', 'both')

// pin attached to goal light
const pin27 = new Gpio(27, 'out')

// pins attached to motor (for safety if motor stays on we can kill)

// XXX - information on empty hoppers
const pin22Stream = Kefir.stream(emitter => pin22Emit = emitter.emit)

pin22.watch((err, value) => {
    console.log("pin22: ", {value})
    pin22Emit(value)
})
//
// pin23.watch((err, value) => {
//     console.log("pin23: ", {value})
// })

function checkHoppers () {
    pin22.read((err, value) => {
        console.log("pin22", {value})
    })
    pin23.read((err, value) => {
        console.log("pin23", {value})
    })
}

// pin18.writeSync(1)
pin17.writeSync(0)

var emit
var dispenseStream = Kefir.stream(emitter => {
    emit = emitter.emit
}).skipDuplicates()
  .filter(ev => ev.resourceId === config.resourceId)
  .filter( ev => ev.type === 'resource-used' )
  .map(ev => (ev.amount || 1))

module.exports = function( ev ){
    emit(ev)
}

bitPepsi(dispenseStream)

// payment logic recieves stream of payments and ensures payouts are spaced out
function bitPepsi(paymentStream) {
    var heartbeat
    const _beat = {}
    const heartStream = Kefir.stream(beat => {
        heartbeat = setInterval(beat.emit, 1000, {
            isHeartbeat: true
        })
        _beat['emit'] = beat.emit
    })
    const timingLayer = Kefir
        .merge([paymentStream, heartStream])
        .scan((status, timingEvent) => {
            if (timingEvent.isHeartbeat) {
                if (status.wait > 0) {
                    status.trigger = false
                    status.wait -= 1;
                } else if (status.pending >= 1) {
                    status.trigger = true;
                    status.pending -= 1
                    status.wait = 12
                } else {
                    clearInterval(heartbeat)
                    heartbeat = false;
                }
                return status
            } else {
                if (timingEvent >= 1 && status.wait < 1){
                    status.trigger = true
                    status.pending -= 1
                    status.wait += 11
                }
                status.pending += timingEvent
                if (!heartbeat) {
                    heartbeat = setInterval(_beat.emit, 1000, {
                        isHeartbeat: true
                    });
                }
                return status
            }
        }, {
            trigger: false,
            wait: 0,
            pending: 0
        })

    const outputStream = timingLayer
        .filter(status => status.trigger)
        .onValue(beer)
}

pin22Stream.onValue( v => {
    console.log('pin22 triggered, turning off', {v})
    if (v == 0){
        pin17.writeSync(0)
    }
})

function beer(){
    console.log('triggering 17, 27 light')
    pin17.writeSync(1) // can hopper
    pin27.writeSync(1) // goal light

    // pin18.writeSync(0)
    // instead of it a set number of milli-seconds
    setTimeout(()=> {
        pin27.writeSync(0)
    }, 3333)
}
