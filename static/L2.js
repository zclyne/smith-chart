function l2_click_start() {
    var pi = 3.1415926535;
    var f = document.getElementById("l2-work-freq").value;
    var l = document.getElementById("l2-l").value;
    if (f >= 2 & f <= 2.5) {
        l = 24;
    }
    if ( f > 2.5 & f <= 3) {
        l = 19;
    }
    if ( f > 3 & f <= 3.5) {
        l = 16;
    }
    if (f > 3.5 & f <= 4) {
        l =  13.6;
    }
    if (f > 4 & f <= 5) {
        l = 12;
    }
    if (f > 5 & f <= 6) {
        l = 9.6;
    }
    if ( f > 6 & f <= 7) {
        l = 8;
    }
    if ( f > 7 & f <= 8) {
        l = 6.8;
    }
    if (f > 8 & f <= 10) {
        l = 6;
    }
    if ( f > 10 & f <= 12) {
        l = 4.8;
    }
    if (f > 12 & f <= 15) {
        l = 4;
    }
    if ( f > 15 & f <= 18) {
        l = 3.2;
    }
    if ( f > 18 & f <= 20) {
        l = 2.7;
    }
    if (f > 20 & f <= 25) {
        l = 2.4;
    }
    if ( f > 25 & f <= 30) {
        l = 1.9;
    }
    if (f > 30 & f <= 35) {
        l = 1.6;
    }
    if (f > 35 & f <= 40) {
        l = 1.36;
    }
    if (f > 40 & f <= 50) {
        l = 1.2;
    }
    if (f > 50 & f <= 60) {
        l = 0.96;
    }
    if (f > 60 & f <= 70) {
        l = 0.8;
    }
    if (f > 70 & f <= 80) {
        l = 0.7;
    }
    if (f > 80 & f <= 90) {
        l = 0.6;
    }
    if (f > 90 & f <= 95) {
        l = 0.53;
    }
    if (f > 95 & f <= 100) {
        l = 0.5;
    }
    if (f > 100 & f <= 110) {
        l = 0.48;
    }
    if (f > 110 & f <= 120) {
        l = 0.43;
    }
    if (f > 120 & f <= 133) {
        l = 0.43;
    }
    if (f >= 133) {
        alert("Illegal input!");
    }
    var l = document.getElementById("l2-l").value = l;
    var w = 2 * pi * f * 1000000;
    var L = l / 1000000.0;
    var Gmin = 0.0006,
        Gmax = 0.02,
        Bmin = -0.1,
        Bmax = 0.009;
   
    var c2max = Math.floor(1 / (300 - Math.sqrt(50 / Gmin - 50 *50)) / w * 1000000000000),
        c2min = Math.floor(1 / (400 + Math.sqrt(50 / Gmin - 50 *50)) / w * 1000000000000);
    document.getElementById("l2-c2-lower").value = c2min;
    document.getElementById("l2-c2-upper").value = c2max;
    var d = Math.floor(c2max - c2min) / 0.1;

    var c11 = new Array();
    for (var i = 0; i < c2max-c2min; ++i) {
        c11[i] = (w * L - 1 / (w * (i+c2min)) * 1000000000000) / (50 * 50 + (w * L - 1 / (w * (i+c2min)) * 1000000000000) * (w * L - 1 / (w * (i+c2min)) * 1000000000000));
        }

    var c1min = (-Bmax + c11[0]) / w * 1000000000000;
    for (var j = 0; j < d-1; j++) {
        if (c1min < (-Bmax + c11[j + 1]) / w * 1000000000000) {
            c1min = (-Bmax + c11[j + 1]) / w * 1000000000000;
        }
        if (c1min > (-Bmax + c11[j + 1]) / w * 1000000000000) {
            c1min = c1min;
        }
    }
    var c1max = (-Bmin + c11[0]) / w * 1000000000000;
    for (var j = d; j >1; j--) {
        if (c1max > (-Bmin + c11[j + 1]) / w * 1000000000000) {
            c1max = (-Bmin + c11[j + 1]) / w * 1000000000000;
        }
        if (c1max < (-Bmin + c11[j + 1]) / w * 1000000000000) {
            c1max = c1max;
        }
    }

    document.getElementById("l2-c1-lower").value = c1min;
    document.getElementById("l2-c1-upper").value = c1max;
}

function l2_calculateRRange() {
    
    var pi = 3.1415926535;
    var L=document.getElementById("l2-l").value/1000000.0*1.0;
    var f = document.getElementById("l2-work-freq").value * 1000000.0;
    var c1min = document.getElementById("l2-c1-lower").value*1.0;
    var c1max = document.getElementById("l2-c1-upper").value*1.0;
    var c2min = document.getElementById("l2-c2-lower").value*1.0;
    var c2max = document.getElementById("l2-c2-upper").value*1.0;
    var w = 2 * pi * f*1.0;
    var c3=0.01/w;
    var a = new Complex(1, 0);
    var yloadg = new Complex(0, 0);
    var zloadg = new Complex(50, 0);
    var d = Math.floor(c2max - c2min);
    var complex_array = new Array();
    complex_array[0] = new Complex(0,0);
    var temp = 0;
    for (var ci = c2min; ci < c2max; ci++) {
        zloadg.i = 2 * pi * f * L - 1000000000000 / (2 * pi * f * ci);
        complex_array[temp] = complexDivide(a, zloadg);
        temp++;
    }

    var gmax = complex_array[0].r*1.0;
    var gmin = complex_array[0].r*1.0;

    for (var i = 0; i < temp; i++) {
        if (complex_array[i].r > gmax)
            gmax = complex_array[i].r;
        if (complex_array[i].r < gmin)
            gmin = complex_array[i].r;
    }
    document.getElementById("l2-g-real-lower").value = gmin;
    document.getElementById("l2-g-real-upper").value = gmax;


    var xpos = new Array();
    var xneg = new Array();
    for (var i = 0; i < c2max-c2min; i++) {
        xpos[i] = complex_array[i].i + 2 * pi * f* c1max *1.0 / (1000000000000);
        xneg[i] = complex_array[i].i + 2 * pi * f *c1min *1.0 /  (1000000000000);
    }

    var xmax = xpos[0];
    var xmin = xneg[0];
    for (var i = 0; i < c2max-c2min; i++) {
        if (xmax < xpos[i]) xmax = xpos[i];
        if (xmin > xneg[i]) xmin = xneg[i];
    }
    xmax = 0 - xmax;
    xmin = 0 - xmin;
    document.getElementById("l2-g-imag-lower").value = xmax;
    document.getElementById("l2-g-imag-upper").value = xmin;

}


function l2_calculateC1() {
    var pi = 3.1415926535;
    var l = document.getElementById("l2-s4-l").value;
    var f = document.getElementById("l2-work-freq").value * 1000000.0;
    var w = 2 * pi * f;
    var zzr = document.getElementById("l2-s4-zr").value;
    var zzi = document.getElementById("l2-s4-zi").value;
    var zload = new Complex(zzr, zzi);
    var a = new Complex(1, 0);
    var yload = complexDivide(a, zload);

    var yloadg = new Complex(yload.r, Math.sqrt(yload.r / 50 - yload.r * yload.r));
    var zloadg = new Complex(50, complexDivide(a, yloadg).i);

    var c1 = (yloadg.i-yload.i) / (2 * pi * f) * 1000000000000;
    var c2 = 1 / (zloadg.i + 2 * pi * f * l ) / (2 * pi * f) * 1000000000000;

    document.getElementById("l2-1-c1").value = c1;
    document.getElementById("l2-1-c2").value = c2;


}
function l2_calculateC2() {
    var pi = 3.1415926535;
    var l = document.getElementById("l2-s4-l").value;
    var f = document.getElementById("l2-work-freq").value * 1000000.0;
    var w = 2 * pi * f;
    var zzr = document.getElementById("l2-s4-zr").value;
    var zzi = document.getElementById("l2-s4-zi").value;
    var zload = new Complex(zzr, zzi);
    var a = new Complex(1, 0);
    var yload = complexDivide(a, zload);

    var yloadg = new Complex(yload.r, -Math.sqrt(yload.r / 50 - yload.r * yload.r));
    var zloadg = new Complex(50, complexDivide(a, yloadg).i);

    var c1 = (yloadg.i - yload.i) / (2 * pi * f) * 1000000000000;
    var c2 = 1 / (zloadg.i + 2 * pi * f * l) / (2 * pi * f) * 1000000000000;

    document.getElementById("l2-1-c1").value = c1;
    document.getElementById("l2-1-c2").value = c2;

}