// XXX broken old format


const Kefir = require('kefir')
const Gpio = require('onoff').Gpio
const pin17 = new Gpio(17, 'out')
const pin18 = new Gpio(18, 'out')
const pin27 = new Gpio(27, 'out')

// pin18 goes low while pin 17 goes high pin trigger
pin18.writeSync(1)
pin17.writeSync(0)

let dispenseStream = Kefir.stream(emitter => {
    emit = emitter.emit
}).log()

module.exports = emit

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

function beer(){
    pin17.writeSync(1)
    pin27.writeSync(1)
    // pin18.writeSync(0)
    setTimeout(()=>{
        pin17.writeSync(0)
        // pin18.writeSync(1)
    }, 533)
    setTimeout(()=> {
        pin27.writeSync(0)
    }, 3333)
}
