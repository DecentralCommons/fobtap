Instructions to set up fobtap raspberry pi. This requires a running setup of ao.

### 0. Materials
- Raspberry Pi (we are using Pi3 for the wireless)
- rfid reader: 125Khz USB RFID Contactless Proximity Sensor Smart ID Card Reader EM4100
- Something to control with the gpio pins: door, bitpepsi

### 1. Set up raspbian on a microsd card
Download the raspbian lite image from there site (https://www.raspberrypi.org/downloads/). Unzip it then write to your sd card. A good way to determine which drive is your sd card is by running `sudo fdisk -l` before and after plugging it in. Use that drive in the of= (output file) of the dd command.

- `unzip 2018-04-18-raspbian-stretch-lite.zip`
- `sudo dd bs=4M if=2018-04-18-raspbian-stretch-lite.img of=/dev/mmcblk0 conv=fsync`

### 2. Setup wifi (optional)

### 3. Install node

- `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`
- `nvm install stable`

### 4. Initialize fobtap

- `sudo apt install git`
- `git clone https://github.com/dctrl-ao/fobtap.git`
- `cd fobtap`
- `npm install`
- `node initialize.js`

At this point it will bring up a command prompt asking for information about the "resource" you are about to set up. You need to tell it the location of your ao server, you also need a valid member username and password to authorize the resources creation.

### 5. Setup fobtap as a service
