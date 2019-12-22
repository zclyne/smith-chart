function T1_click_start() {
    let f = parseFloat($("#T1-work-freq").val()), l;
    if (f >= 2 && f < 3) {
        l = 8;
    }
    if (f >= 3 && f < 5) {
        l = 5;
    }
    if (f >= 5 && f < 8) {
        l = 3.2;
    }
    if (f >= 8 && f < 10) {
        l = 2;
    }
    if (f >= 10 && f < 15) {
        l = 1.6;
    }
	if (f >= 15 && f < 20) {
        l = 1;
	}
    if (f >= 20 && f < 25) {
        l = 0.8;
    }
    if (f >= 25 && f < 30) {
        l = 0.6;
    }
    if (f >= 30 && f < 40) {
        l = 0.5;
    }
    if (f >= 40 && f < 50) {
        l = 0.4;
    }
    if (f >= 50 && f < 70) {
        l = 0.3;
    }
    if (f >= 70 && f < 100) {
        l = 0.2;
    }
    if (f >= 100 && f <= 133) {
        l = 0.15;
    }
    if (f > 133) {
        alert("Illegal input!");
    }
    $("#T1-L").val(l);
    let w = 2 * pi * f * 1000000;
    let c3 = Math.sqrt(1/7500) / w;
    $("#T1-C3").val(c3 * 1000000000000);
    let ll = l / 1000000.0;
    let xmin = -90.0,
        xmax = 1000.0;
	let c2max=1/w/26*1000000000000;
	let c2min=1/w/100*1000000000000;
	let d= Math.floor(c2max-c2min);
	let c11=[];
	let c2 = c2min;
	for (let j = 0;j < d; ++j){
		c11[j] = 1 / (w * c3) / (2500 + 1 /Math.pow ((w * c3),2)) - 1 / (w * ll - 1 / (w * c2 / 1000000000000)) ;
		c2++;
	}
	let c11min = -c11[0] / ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c11[0] ^ 2) + xmax;
	for (let x=0; x< d;++x){
		if (c11min > -c11[x+1] / ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c11[x + 1] ^ 2) + xmax ){
			c11min= -c11[x+1] / ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c11[x + 1] ^ 2) + xmax;
		}
	}
	let c11max= -c11[0] / (((50 / (50 * 50 + 1 / (w * c3 * w * c3))) * (50 / (50 * 50 + 1 / (w * c3 * w * c3)))) + c11[0] * c11[0]) + xmin;
	for (let x=0; x < d;++x){
		if (c11max< -c11[x+1] / (((50 / (50 * 50 + 1 / (w * c3 * w * c3))) * (50 / (50 * 50 + 1 / (w * c3 * w * c3)))) + c11[x+1] * c11[x+1]) + xmin){
			c11max= -c11[x+1] / (((50 / (50 * 50 + 1 / (w * c3 * w * c3))) * (50 / (50 * 50 + 1 / (w * c3 * w * c3)))) + c11[x+1] * c11[x+1]) + xmin;
		}
	}

	$("#T1-C1-UPPER").val(1/c11max / w * 1000000000000);
    $("#T1-C1-LOWER").val(1/c11min / w * 1000000000000);

	$("#T1-C2-UPPER").val(c2max);
    $("#T1-C2-LOWER").val(c2min);
}

function T1_calculateRRange() {
    let f = $("#T1-work-freq").val() * 1000000.0;
    let c1min = $("#T1-C1-LOWER").val() / 1000000000000;
    let c1max = $("#T1-C1-UPPER").val() / 1000000000000;
    let c2min = parseFloat($("#T1-C2-LOWER").val());
    let c2max = parseFloat($("#T1-C2-UPPER").val());
	let c3= $("#T1-c3-reset").val() / 1000000000000;
    let w = 2 * pi * f;
	let ll = $("#T1-L").val() / 1000000;
    let a = new Complex(1, 0);
    let Zc3 = new Complex(50, 1/(w * c3));
	let Yc3 = complexDivide(a,Zc3);
	// TODO: check what is c2 here
	let Yc2 = new Complex(Yc3.r,Yc3.i- 1 / (w * ll - 1 / (w * c2 / 1000000000000)));
	$("#T1-r-real-upper").val(1/Yc2.r);
	let Yc2min = new Complex(Yc3.r,Yc3.i - 1 / (w * ll - 1 / (w * c2min / 1000000000000)));

	let Zc2min = complexDivide(a,Yc2min);
	if (Zc2min.r <= 0.001){
        Zc2min.r = 0.001;
	}
	$("#T1-r-real-lower").val(Zc2min.r);

	let d1 = Math.floor(c2max - c2min);
	let c111=[];
	let c2 = c2min;
	for (let j = 0;j < d1; ++j){
		c111[j] = 1 / (w * c3) / (2500 + 1 /Math.pow ((w * c3),2)) - 1 / (w * ll - 1 / (w * c2 / 1000000000000)) ;
		c2++;
	}
	let X1max= -c111[0] / ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c111[0] ^ 2) - 1 / (w * c1min);
	for (let i=0; i< d1;++i){
		if (X1max > -c111[i+1] /  ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c111[i+1] ^ 2) - 1 / (w * c1min)){
			X1max=-c111[i+1] /  ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c111[i+1] ^ 2) - 1 / (w * c1min);
		}
	}
	$("#T1-r-imag-upper").val(-X1max);
	let X1min= -c111[0] / ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c111[0] ^ 2) - 1 / (w * c1max);
	for (let i=0; i< d1 ;++i){
		if (X1min < -c111[i+1] / ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c111[i+1] ^ 2) - 1 / (w * c1max)){
			X1min= -c111[i+1] / ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c111[i+1] ^ 2) - 1 / (w * c1max);
		}
	}
    $("#T1-r-imag-lower").val(X1min*10);
}

function T1_calculateC() {
    let c3 = $("#T1-c3-reset").val() / 1000000000000;
    let ll = $("#T1-l-reset").val() /1000000;
    let f = $("#T1-work-freq").val() * 1000000;
    let w = 2 * pi * f;
    let zzr = parseFloat($("#T1-z-real").val());
    let zzi = parseFloat($("#T1-z-imag").val());
    let zload = new Complex();
    zload.r = zzr;
    zload.i = zzi;
    let a = new Complex(1, 0);

	let Zc2= new Complex(50,1/(w*c3));
	let Yc2= complexDivide(a,Zc2);
	let Zc1= new Complex(zzr,- Math.sqrt(zzr/Yc2.r-zzr*zzr));
	let Yc1= complexDivide(a,Zc1);


    let c1 = 1/(zload.i-Zc1.i)/w*1000000000000;
    let c2 = 1 / (w * ll - 1/(Yc1.i-Yc2.i)) / w * 1000000000000;

    $("#T1-c1-2").val(c1);
    $("#T1-c2-2").val(c2);
}