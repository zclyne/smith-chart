var pi = 3.1415926535;

function pi2_click_start() {
    let f = parseFloat($("#pi2-work-freq").val()), l;
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
    // 更新建议的电感L值
    $("#pi2-l").val(l);
    // 工作角频率为w
    let w = 2 * pi * f * 1000000;
    let c3 = 0.01 / w;
    // 设置默认的C3参数，单位为pF
    $("#pi2-c3").val((c3 * 1000000000000).toFixed(2));
    let ll = l / 1000000.0; // ll单位为H
    // 能匹配的阻抗范围
    let rmin = 1.0,
        rmax = 49.0,
        xmin = -100.0,
        xmax = 1000.0;
    // 设置c1的建议最小值和建议最大值
    $("#pi2-c1-upper").val(Math.sqrt((0.02 / rmin - 0.02 * 0.02) / w * 1000000000000).toFixed(2));
    $("#pi2-c1-lower").val(Math.sqrt((0.02 / rmax - 0.02 * 0.02) / w * 1000000000000).toFixed(2));
    let d1 = Math.floor(rmax - rmin),
        d2 = Math.floor((xmax - xmin) / 5);
    let c2 = [];
    for (let i = 0; i < d1; ++i) {
        c2[i] = [];
        for (let j = 0; j < d2; ++j) {
            c2[i][j] = 0;
        }
    }
    let rrr = [];
    for (let i = rmin, tempp = 0; i < rmax; i++, tempp++) {
        rrr[tempp] = 50 * (i) * Math.sqrt(0.02 / (i) - 0.02 * 0.02) * w;
    }
    let xxx = [];
    for (let i = xmin, tempp = 0; i < xmax; i += 5, tempp++) {
        xxx[tempp] = (i + w * ll) * w;
    }
    for (let i = 0; i < d1; i++) {
        for (let j = 0; j < d2; j++) {
            c2[i][j] = 1000000000000 / (xxx[j] - rrr[i]);

        }
    }
    let c2min = c2[0][0],
        c2max = c2[0][0];
    for (let i = 0; i < d1; i++) {
        for (let j = 0; j < d2; j++) {
            if (c2[i][j] < c2min) {
                c2min = c2[i][j];
            }
            if (c2[i][j] > c2max) {
                c2max = c2[i][j];
            }
        }
    }
    // 更新c2的建议最小值和最大值
    $("#pi2-c2-lower").val(c2min.toFixed(2));
    $("#pi2-c2-upper").val(c2max.toFixed(2));
}

// 计算负载的实部范围
function pi2_calculateRRange(l) {
    let pi = 3.1415926535;
    let f = $("#pi2-work-freq").val() * 1000000.0;
    let c1min = parseFloat($("#pi2-c1-lower").val());
    let c1max = parseFloat($("#pi2-c1-upper").val());
    let c2min = parseFloat($("#pi2-c2-lower").val());
    let c2max = parseFloat($("#pi2-c2-upper").val());
    let a = new Complex(1, 0);
    let yloadg = new Complex(0.02, 0);
    let d = Math.floor(c1max - c1min);
    let complex_array = [];


    complex_array[0] = new Complex(0,0);
    let ci = c1min;
    for (let i = 0; i < d; i++) {
        yloadg.i = 2 * pi * f * ci / 1000000000000;
        complex_array[i] = complexDivide(a, yloadg);
        ci++;
    }

    let rmax = complex_array[0].r;
    let rmin = complex_array[0].r;

    for (let i = 0; i < d; i++) {
        if (complex_array[i].r > rmax)
            rmax = complex_array[i].r;
        if (complex_array[i].r < rmin)
            rmin = complex_array[i].r;
    }
    $("#pi2-r-real-lower").val(rmin.toFixed(2));
    $("#pi2-r-real-upper").val(rmax.toFixed(2));


    let xpos = [];
    let xneg = [];
    for (let i = 0; i < d; i++) {
        xpos[i] = complex_array[i].i + 2 * pi * f * l - 1 / (c2min * 2 * pi * f / 1000000000000);
        xneg[i] = complex_array[i].i + 2 * pi * f * l - 1 / (c2max * 2 * pi * f / 1000000000000);
    }

    let xmax = xpos[0];
    let xmin = xneg[0];
    for (let i = 0; i < d; i++) {
        if (xmax < xpos[i]) xmax = xpos[i];
        if (xmin > xneg[i]) xmin = xneg[i];
    }
    xmax = 0 - xmax;
    xmin = 0 - xmin;
    $("#pi2-r-imag-lower").val(xmin.toFixed(2));
    $("#pi2-r-imag-upper").val(xmax.toFixed(2));

}

// 计算可匹配的负载与 C3 并联后的阻抗范围
function pi2_firstcalcu() {
    let l = $("#pi2-l").val() / 1000000.0;
    pi2_calculateRRange(l);
}

// 确定C3和l
function pi2_recalcu() {
    let l = $("#pi2-l-reset").val() / 1000000.0;
    let c3 = $("#pi2-c3-reset").val() * 1000000.0;
    pi2_calculateRRange(l, c3);
}

// 计算c1和c2的取值
function pi2_calculateC() {
    let c3 = $("#pi2-c3-reset").val() / 1000000000000;
    let l = parseFloat($("#pi2-l-reset").val());
    let f = $("#pi2-work-freq").val() * 1000000;
    let w = 2 * pi * f;
    let zzr = parseFloat($("#pi2-z-real").val());
    let zzi = parseFloat($("#pi2-z-imag").val());
    let zload = new Complex(zzr, zzi);
    let a = new Complex(1, 0);
    let yload = complexDivide(a, zload);
    let yload1 = new Complex(yload.r, yload.i + w * c3);
    let zload1 = complexDivide(a, yload1);

    let zloadg = new Complex(zload1.r, Math.sqrt(zload1.r * 50 - zload1.r * zload1.r));
    let yloadg = new Complex(0.02, complexDivide(a, zloadg).i);

    let c1 = -yloadg.i / (2 * pi * f) * 1000000000000;
    let c2 = 1 / (zload1.i - zloadg.i + 2 * pi * f * l / 1000000) / (2 * pi * f) * 1000000000000;

    $("#pi2-c1-2").val(c1.toFixed(2));
    $("#pi2-c2-2").val(c2.toFixed(2));
}