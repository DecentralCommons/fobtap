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
Add the following to /etc/network/interfaces

```
auto lo

iface lo inet loopback
iface eth0 inet dhcp

allow-hotplug wlan0
auto wlan0


iface wlan0 inet dhcp
        wpa-ssid "ssid"
        wpa-psk "password"
```

### 3. Setup SSH

- Enter sudo raspi-config in a terminal window

A configuration window will open: Select Interfacing Options , Navigate to and select SSH , Choose Yes, Select Ok, Choose Finish

- sudo systemctl enable ssh
- sudo systemctl start ssh

### 4. Install node

- `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`
- `nvm install stable`

### 5. Initialize fobtap

- `sudo apt install git`
- `git clone https://github.com/dctrl-ao/fobtap.git`
- `cd fobtap`
- `npm install`
- `node initialize.js`

At this point it will bring up a command prompt asking for information about the "resource" you are about to set up. You need to tell it the location of your ao server, you also need a valid member username and password to authorize the resources creation.

### 6. Setup fobtap as a service

Add the following to /etc/systemd/system/fobtap.Service

```
[Unit]
Description=fobtap-daemon
After=network.target

[Service]
User=pi
ExecStart=/path/to/node/bin/node /home/pi/fobtap/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
