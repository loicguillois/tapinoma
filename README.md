tapinoma
===

Introduction
------------
This is a node module for connecting to ANT+ capable devices through an USB ANT stick. It aims to cover every sensors providing an ANT+ support. It's written in ES6 language.

See [http://www.thisisant.com/](http://www.thisisant.com/) for more informations regarding ANT+.

This library works fine on my Debian PC but I will give a try on my Windows desktop and Macbook, RaspberryPI... I hope it will works also. The only requirement is to run the application as a root user.

Requirements
-------
Node.js v6.9.1 LTS

tapinoma is built on top of usb node module which requires an USB library to be installed. Please see [https://www.npmjs.com/package/usb](https://www.npmjs.com/package/usb)

Install
-------

```
npm install tapinoma
```

Examples
-------------
Please, have a look to src/index.js

Sensor support
-------------

|          Sensor           |      Supported      |  Planned |                Comment                 |
|---------------------------|:-------------------:|---------:|---------------------------------------:|
| Heart Rate Monitor        |          X          |          |                                        |
| Bicycle Cadence           |          X          |          |                                        |
| FE-C                      |          X          |          | only data reception for the moment     |
| Bicycle Speed and Cadence |                     |     X    |                                        |
| Bicycle Power             |                     |     X    |                                        |
| Environment               |                     |     X    |                                        |
| Weight Scale              |                     |     X    |                                        |
| Sync                      |                     |     X    |                                        |

This list is not exhaustive, please see for a detailled list of sensors supporting ANT+ [https://www.thisisant.com/developer/ant-plus/device-profiles/#529_tab](https://www.thisisant.com/developer/ant-plus/device-profiles/#529_tab)

For the moment I use real hardware but I will try the ANT+ simulator in the future.

If you want me to prioritize the implementation of a sensor, please create an issue. You can contribute as well by doing a Pull Request if you are a developer ;-)

License
-------
Released under the GPL license. Please, see LICENSE for details.


Credits
-------
Some snippets comes from ant-plus and node-ant modules.
