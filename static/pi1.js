function pi1_click_start() {
    var pi = 3.1415926535;
    var f = document.getElementById("pi1-work-freq").value;
    var l = document.getElementById("pi1-l").value;
    if (f >= 2 && f < 3) {
        l = 8;
    }
    if (f >= 3 && f < 5) {
        l = 5.4;
    }
    if (f >= 5 && f < 7) {
        l = 3.2;
    }
    if (f >= 7 && f < 10) {
        l = 2.3;
    }
    if (f >= 10 && f < 15) {
        l = 1.6;
    }
    if (f >= 15 && f < 20) {
        l = 1.1;
    }
    if (f >= 20 && f < 25) {
        l = 0.8;
    }
    if (f >= 25 && f < 30) {
        l = 0.64;
    }
    if (f >= 30 && f < 40) {
        l = 0.53;
    }
    if (f >= 40 && f < 50) {
        l = 0.53;
    }
    if (f >= 50 && f < 70) {
        l = 0.32;
    }
    if (f >= 70 && f < 90) {
        l = 0.23;
    }
    if (f >= 90 && f < 110) {
        l = 0.18;
    }
    if (f >= 110 && f < 133) {
        l = 0.15;
    }
    if (f >= 133) {
        alert("Illegal input!");
    }
    var l = document.getElementById("pi1-l").value = l;
    var w = 2 * pi * f * 1e6;
    var c3 = 11000 / f / 1e12;
    document.getElementById("pi1-c3").value = c3 * 1e12;
    var ll = l / 1000000.0;
    var Gmin = 0.0006,
        Gmax = (0.02 ^ 2 + Math.pow(w * c3,2)) / 0.02,
        Bmin = -0.7,
        Bmax = 0.125,
        consta1 = 0.02 / (0.02 * 0.02 + Math.pow(w * c3,2)),
        consta2 = w * c3 / (0.02 * 0.02 + Math.pow(w * c3,2)),
        consta3 = (1 / Bmax - Math.sqrt((1 / Bmax) ^ 2 - 4 * consta1 * consta1)) / 2,
        consta4 = Math.sqrt(consta1 / Gmin - consta1 * consta1),
        c2max = 1 / (100 - consta4 - consta2) / w * 1e12,
        c2min = 1 / (200 + consta4 - consta2) / w * 1e12;
    document.getElementById("pi1-c2-upper").value = c2max;
    document.getElementById("pi1-c2-lower").value = c2min;
    //var d1 = Math.floor(rmax - rmin),
    //    d2 = Math.floor((xmax - xmin) / 5);
    var d = Math.floor(c2max-c2min)/0.01;

    var c11 = new Array(d);
    var c2 = c2min,
        c2d = (c2max-c2min)/(d-1);

    for (var i = 0; i < d; ++i) {
        c2 = c2 + i*c2d;
        c11[i] = (w * ll - 1 / (w * c2 / 1e12) - consta2) / (consta1 * consta1 + Math.pow((w * ll - 1 / (w * c2 / 1e12) - consta2),2));
    }
    var c11min = c11[0],
        c11max = c11[0];
    for (var i = 0; i < d; ++i) {
        if (c11min > c11[i]) c11min = c11[i];
        if (c11max < c11[i]) c11max = c11[i];
    }

    var c1max = (-Bmin + c11min) / w * 1e12;
    var c1min = (-Bmax + c11max) / w * 1e12;
    document.getElementById("pi1-c1-lower").value = c1min;
    document.getElementById("pi1-c1-upper").value = c1max;
}

function pi1_calculateRRange(l, c3) {
    var pi = 3.1415926535;
    //var l=document.getElementById("pi2-l").value/1000000.0;
    var f = document.getElementById("pi1-work-freq").value * 1e6;
    var L = document.getElementById("pi1-l").value / 1e6;
    var c1min = document.getElementById("pi1-c1-lower").value * 1.0;
    var c1max = document.getElementById("pi1-c1-upper").value * 1.0;
    var c2min = document.getElementById("pi1-c2-lower").value * 1.0;
    var c2max = document.getElementById("pi1-c2-upper").value * 1.0;
    var w = 2 * pi * f;
    //var c3=0.01/w;
    var c3 = document.getElementById("pi1-c3").value / 1e12;
    var a = new Complex(1, 0);
    var yloadg = new Complex(0.02, 0);
    var Yc3 = new Complex(0.02,w*c3);
    var Zc3 = complexDivide(a,Yc3);
    var Zc2 = new Complex(Zc3.r,0);
    //var zloadg = new Complex(0, 0);
    var d = Math.floor(c1max - c1min) * 10;
    var complex_array = new Array(d);

    complex_array[0] = new Complex(0,0);
    var ci = c2min;
    for (var i = 0; i < d; i++) {
        Zc2.i = Zc3.i + w * L - 1 / (w * ci / 1e12);
        complex_array[i] = complexDivide(a, Zc2);
        ci=ci+0.1;
    }

    var rmax = complex_array[0].r;
    var rmin = complex_array[0].r;

    for (var i = 0; i < d; i++) {
        if (complex_array[i].r > rmax)
            rmax = complex_array[i].r;
        if (complex_array[i].r < rmin)
            rmin = complex_array[i].r;
    }
    if (rmin<=0.0006){
        rmin = 0.0006
    }
    document.getElementById("pi1-r-real-lower").value = rmin;
    document.getElementById("pi1-r-real-upper").value = rmax;


    var xpos = new Array();
    var xneg = new Array();
    for (var i = 0; i < d; i++) {
        xpos[i] = complex_array[i].i + 2 * pi * f * c1min / 1e12;
        xneg[i] = complex_array[i].i + 2 * pi * f * c1max / 1e12;
    }

    var xmax = xpos[0];
    var xmin = xneg[0];
    for (var i = 0; i < d; i++) {
        if (xmax > xpos[i]) xmax = xpos[i];
        if (xmin < xneg[i]) xmin = xneg[i];
    }
    xmax = 0 - xmax;
    xmin = 0 - xmin;
    document.getElementById("pi1-r-imag-lower").value = xmin;
    document.getElementById("pi1-r-imag-upper").value = xmax;


}

function pi1_firstcalcu() {
    var l = document.getElementById("pi1-l").value / 1000000.0;
    var c3 = 0.01 / (2 * 3.1415926535 * document.getElementById("pi1-work-freq").value * 1000000.0);
    pi1_calculateRRange(l, c3);
}

function pi1_recalcu() {
    var l = document.getElementById("pi1-l-reset").value / 1000000.0;
    var c3 = document.getElementById("pi1-c3-reset").value * 1000000.0;
    pi1_calculateRRange(l, c3);
}

function pi1_calculateC() {
    var pi = 3.1415926535;
    var f = document.getElementById("pi1-work-freq").value * 1e6;
    var w = 2 * pi * f;
    var L = document.getElementById("pi1-l-reset").value / 1e6;
    var c3 = document.getElementById("pi1-c3-reset").value / 1e12;

    var zzr = document.getElementById("pi1-z-real").value * 1.0;
    var zzi = document.getElementById("pi1-z-imag").value * 1.0;
    var zload = new Complex(zzr,zzi);
    var a = new Complex(1, 0);
    var yload = complexDivide(a, zload);

    var Yc3 = new Complex(0.02,-w*c3);
    var Zc3 = complexDivide(a,Yc3);
    var Zc2 = new Complex(Zc3.r,0);
    Zc2.i = -Math.sqrt(Zc2.r/yload.r-Zc2.r*Zc2.r);
    var Yc2 = complexDivide(a,Zc2);

    var c1 = (Yc2.i - yload.i) / w * 1e12;
    var c2 = 1 / (w * (Zc2.i - Zc3.i + w * L)) * 1e12;

    document.getElementById("pi1-c1-2").value = c1;
    document.getElementById("pi1-c2-2").value = c2;

}