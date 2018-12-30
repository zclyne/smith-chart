function pi2_click_start() {
    var pi = 3.1415926535;
    var f = document.getElementById("pi2-work-freq").value;
    var l = document.getElementById("pi2-l").value;
    if (f >= 1 && f < 2) {
        l = 21;
    }
    if (f >= 2 && f < 5) {
        l = 11;
    }
    if (f >= 5 && f < 10) {
        l = 4;
    }
    if (f >= 10 && f < 15) {
        l = 1.6;
    }
    if (f >= 15 && f < 20) {
        l = 1.4;
    }
    if (f >= 20 && f < 25) {
        l = 1;
    }
    if (f >= 25 && f < 30) {
        l = 0.8;
    }
    if (f >= 30 && f < 40) {
        l = 0.7;
    }
    if (f >= 40 && f < 50) {
        l = 0.45;
    }
    if (f >= 50 && f < 80) {
        l = 0.4;
    }
    if (f >= 80 && f < 100) {
        l = 0.8;
    }
    if (f >= 100 && f < 120) {
        l = 0.8;
    }
    if (f >= 120 && f < 133) {
        l = 0.8;
    }
    if (f >= 133) {
        alert("Illegal input!");
    }
    var l = document.getElementById("pi2-l").value = l;
    var w = 2 * pi * f * 1000000;
    var c3 = 0.01 / w;
    document.getElementById("pi2-c3").value = c3 * 1000000000000;
    var ll = l / 1000000.0;
    var rmin = 1.0,
        rmax = 49.0,
        xmin = -100.0,
        xmax = 1000.0;
    document.getElementById("pi2-c1-upper").value = Math.sqrt(0.02 / rmin - 0.02 * 0.02) / w * 1000000000000;
    document.getElementById("pi2-c1-lower").value = Math.sqrt(0.02 / rmax - 0.02 * 0.02) / w * 1000000000000;
    var d1 = Math.floor(rmax - rmin),
        d2 = Math.floor((xmax - xmin) / 5);
    var c2 = new Array();
    for (var i = 0; i < d1; ++i) {
        c2[i] = new Array();
        for (var j = 0; j < d2; ++j) {
            c2[i][j] = 0;
        }
    }
    var rrr = new Array();
    var tempp = 0;
    for (var i = rmin; i < rmax; i++) {
        var s11 = 50 * (i) * Math.sqrt(0.02 / (i) - 0.02 * 0.02) * w;
        rrr[tempp] = s11;
        ++tempp;
    }
    var xxx = new Array();
    tempp = 0;
    for (var i = xmin; i < xmax; i += 5) {
        var y11 = (i + w * ll) * w;
        xxx[tempp] = y11;
        ++tempp;
    }
    for (var i = 0; i < d1; i++) {
        for (var j = 0; j < d2; j++) {
            c2[i][j] = 1.0 * 1000000000000 / (xxx[j] - rrr[i]);

        }
    }
    var c2min = c2[0][0],
        c2max = c2[0][0];
    for (var i = 0; i < d1; i++) {
        for (var j = 0; j < d2; j++) {
            if (c2[i][j] < c2min) {
                c2min = c2[i][j];
            }
            if (c2[i][j] > c2max) {
                c2max = c2[i][j];
            }
        }
    }
    document.getElementById("pi2-c2-lower").value = c2min;
    document.getElementById("pi2-c2-upper").value = c2max;
}

function pi2_calculateRRange(l, c3) {
    var pi = 3.1415926535;
    //var l=document.getElementById("pi2-l").value/1000000.0;
    var f = document.getElementById("pi2-work-freq").value * 1000000.0;
    var c1min = document.getElementById("pi2-c1-lower").value;
    var c1max = document.getElementById("pi2-c1-upper").value;
    var c2min = document.getElementById("pi2-c2-lower").value;
    var c2max = document.getElementById("pi2-c2-upper").value;
    var w = 2 * pi * f;
    //var c3=0.01/w;
    var a = new Complex(1, 0);
    var yloadg = new Complex(0.02, 0);
    var zloadg = new Complex(0, 0);
    var d = Math.floor(c1max - c1min);
    var complex_array = new Array();


    complex_array[0] = new Complex(0,0);
    var ci = c1min;
    for (var i = 0; i < d; i++) {
        yloadg.i = 2 * pi * f * ci / 1000000000000;
        complex_array[i] = complexDivide(a, yloadg);
        ci++;
    }

    var rmax = complex_array[0].r;
    var rmin = complex_array[0].r;

    for (var i = 0; i < d; i++) {
        if (complex_array[i].r > rmax)
            rmax = complex_array[i].r;
        if (complex_array[i].r < rmin)
            rmin = complex_array[i].r;
    }
    document.getElementById("pi2-r-real-lower").value = rmin;
    document.getElementById("pi2-r-real-upper").value = rmax;


    var xpos = new Array();
    var xneg = new Array();
    for (var i = 0; i < d; i++) {
        xpos[i] = complex_array[i].i + 2 * pi * f * l - 1 / (c2min * 2 * pi * f / 1000000000000);
        xneg[i] = complex_array[i].i + 2 * pi * f * l - 1 / (c2max * 2 * pi * f / 1000000000000);
    }

    var xmax = xpos[0];
    var xmin = xneg[0];
    for (var i = 0; i < d; i++) {
        if (xmax < xpos[i]) xmax = xpos[i];
        if (xmin > xneg[i]) xmin = xneg[i];
    }
    xmax = 0 - xmax;
    xmin = 0 - xmin;
    document.getElementById("pi2-r-imag-lower").value = xmin;
    document.getElementById("pi2-r-imag-upper").value = xmax;

}

function pi2_firstcalcu() {
    var l = document.getElementById("pi2-l").value / 1000000.0;
    var c3 = 0.01 / (2 * 3.1415926535 * document.getElementById("pi2-work-freq").value * 1000000.0);
    pi2_calculateRRange(l, c3);
}

function pi2_recalcu() {
    var l = document.getElementById("pi2-l-reset").value / 1000000.0;
    var c3 = document.getElementById("pi2-c3-reset").value * 1000000.0;
    calculateRRange(l, c3);
}

function pi2_calculateC() {
    var pi = 3.1415926535;

    var c3 = document.getElementById("pi2-c3-reset").value / 1000000000000;
    var l = document.getElementById("pi2-l-reset").value;
    var f = document.getElementById("pi2-work-freq").value * 1000000;
    var w = 2 * pi * f;
    var zzr = document.getElementById("pi2-z-real").value;
    var zzi = document.getElementById("pi2-z-imag").value;
    var zload = new Complex();
    zload.r = zzr;
    zload.i = zzi;
    var a = new Complex(1, 0);
    var yload = complexDivide(a, zload);
    var yload1 = new Complex();
    yload1.r = yload.r;
    yload1.i = yload.i + w * c3;
    var zload1 = complexDivide(a, yload1);


    var zloadg = new Complex(zload1.r, Math.sqrt(zload1.r * 50 - zload1.r * zload1.r));
    var yloadg = new Complex(0.02, complexDivide(a, zloadg).i);

    var c1 = -yloadg.i / (2 * pi * f) * 1000000000000;
    var c2 = 1 / (zload1.i - zloadg.i + 2 * pi * f * l / 1000000) / (2 * pi * f) * 1000000000000;

    document.getElementById("pi2-c1-2").value = c1;
    document.getElementById("pi2-c2-2").value = c2;

}