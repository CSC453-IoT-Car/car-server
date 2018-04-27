var car = require('./car.js');

var a1 = 'P9_23'
var a2 = 'P9_17' 
var b1 = 'P9_24'
var b2 = 'P9_26'
var pa = 'P9_21'
var pb = 'P9_22'
var oe = 'P9_41'

car.setPinouts(a1, a2, b1, b2, pa, pb, oe);

car.stop(a1, a2, b1, b2, pa, pb);