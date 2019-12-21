function T1_click_start() {
    var pi = 3.1415926535;
    var f = document.getElementById("T1-work-freq").value;
    var l = document.getElementById("T1-L").value;
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
    var l = document.getElementById("T1-L").value = l;
    var w = 2 * pi * f * 1000000;
    var c3 = Math.sqrt(1/7500) / w;
    document.getElementById("T1-C3").value = c3 * 1000000000000;
    var ll = l / 1000000.0;
    var rmin = 1.0,
        rmax = 200,
        xmin = -90.0,
        xmax = 1000.0;
	var c2max=1/w/26*1000000000000;
	var c2min=1/w/100*1000000000000;
	var d= Math.floor(c2max-c2min);
	var consta1= Math.sqrt((50 / (50 * 50 + 1 / (w * c3 *w * c3))) / rmin - (50 / (50 * 50 + 1 / (w * c3 *w * c3))) * (50 / (50 * 50 + 1 / (w * c3 *w * c3))))
    var consta2= 1 / (consta1 + 1 / (w * c3) / (50 * 50+ 1 / (w * c3 * w * c3)))  
	var d1 = Math.floor(rmax - rmin),
        d2 = Math.floor((xmax - xmin) / 5);
	var c11=new Array();
	var c2 = c2min;
	for (var j = 0;j < d; ++j){
		c11[j] = 1 / (w * c3) / (2500 + 1 /Math.pow ((w * c3),2)) - 1 / (w * ll - 1 / (w * c2 / 1000000000000)) ;
		c2=c2+1;
	}
	var c11min = -c11[0] / ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c11[0] ^ 2) + xmax;
	for (var x=0; x< d;++x){
		if (c11min > -c11[x+1] / ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c11[x + 1] ^ 2) + xmax ){
			c11min= -c11[x+1] / ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c11[x + 1] ^ 2) + xmax;
		}
		if (c11min <= ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c11[x + 1] ^ 2) + xmax){
			c11min=c11min;
		}
	}
	var c11max= -c11[0] / (((50 / (50 * 50 + 1 / (w * c3 * w * c3))) * (50 / (50 * 50 + 1 / (w * c3 * w * c3)))) + c11[0] * c11[0]) + xmin;
	for (var x=0; x < d;++x){
		if (c11max< -c11[x+1] / (((50 / (50 * 50 + 1 / (w * c3 * w * c3))) * (50 / (50 * 50 + 1 / (w * c3 * w * c3)))) + c11[x+1] * c11[x+1]) + xmin){
			c11max= -c11[x+1] / (((50 / (50 * 50 + 1 / (w * c3 * w * c3))) * (50 / (50 * 50 + 1 / (w * c3 * w * c3)))) + c11[x+1] * c11[x+1]) + xmin;
		}
		if(c11max >= -c11[x+1] / (((50 / (50 * 50 + 1 / (w * c3 * w * c3))) * (50 / (50 * 50 + 1 / (w * c3 * w * c3)))) + c11[x+1] * c11[x+1]) + xmin) {
			c11max=c11max;
		}
	}
			
	document.getElementById("T1-C1-UPPER").value = 1/c11max / w * 1000000000000;
    document.getElementById("T1-C1-LOWER").value = 1/c11min	/ w * 1000000000000;
	
	document.getElementById("T1-C2-UPPER").value = (c2max );
    document.getElementById("T1-C2-LOWER").value = (c2min );
    
}

function T1_calculateRRange(l, c3) {
    var pi = 3.1415926535;
    //var l=document.getElementById("pi2-l").value/1000000.0;
    var f = document.getElementById("T1-work-freq").value * 1000000.0;
    var c1min = document.getElementById("T1-C1-LOWER").value/1000000000000;
    var c1max = document.getElementById("T1-C1-UPPER").value/1000000000000;
    var c2min = document.getElementById("T1-C2-LOWER").value*1;
    var c2max = document.getElementById("T1-C2-UPPER").value*1;
	var c3= document.getElementById("T1-c3-reset").value/1000000000000;
    var w = 2 * pi * f;
	var ll= document.getElementById("T1-L").value/1000000;
    //var c3=0.01/w;
    var a = new Complex(1, 0);
    var Zc3 = new Complex(50, 1/(w * c3));
    var d = Math.floor(c1max - c1min);
	var Yc3 = complexDivide(a,Zc3);
	var Yc2= new Complex(Yc3.r,Yc3.i- 1 / (w * ll - 1 / (w * c2 / 1000000000000)));
	var Zc2=complexDivide(a,Yc2);
	document.getElementById("T1-r-real-upper").value = 1/Yc2.r;
	var Yc2min=new Complex(Yc3.r,Yc3.i - 1 / (w * ll - 1 / (w * c2min / 1000000000000)));
	
	var Zc2min= complexDivide(a,Yc2min);
	if (Zc2min.r > 0.001){
		Zc2min.r=Zc2min.r;}
	else{
		Zc2min.r=0.001;}
	document.getElementById("T1-r-real-lower").value = Zc2min.r;
	
	var d1 = Math.floor(c2max - c2min);	
	var c111=new Array();
	var c2 = c2min;
	for (var j = 0;j < d1; ++j){
		c111[j] = 1 / (w * c3) / (2500 + 1 /Math.pow ((w * c3),2)) - 1 / (w * ll - 1 / (w * c2 / 1000000000000)) ;
		c2=c2+1;
	}
	var X1max= -c111[0] / ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c111[0] ^ 2) - 1 / (w * c1min);
	for (var i=0; i< d1;++i){
		if (X1max > -c111[i+1] /  ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c111[i+1] ^ 2) - 1 / (w * c1min)){
			X1max=-c111[i+1] /  ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c111[i+1] ^ 2) - 1 / (w * c1min);
		}
		else{
			X1max=X1max;
		}
	}
	document.getElementById("T1-r-imag-upper").value = -X1max;
	var X1min= -c111[0] / ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c111[0] ^ 2) - 1 / (w * c1max);
	for (var i=0; i< d1 ;++i){
		if (X1min < -c111[i+1] / ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c111[i+1] ^ 2) - 1 / (w * c1max)){
			X1min= -c111[i+1] / ((50 / (50 ^ 2 + 1 / (w * c3) ^ 2)) ^ 2 + c111[i+1] ^ 2) - 1 / (w * c1max);
		}
		else{
			X1min=X1min;
		}
	}
   
    document.getElementById("T1-r-imag-lower").value = X1min*10;
	
}

function T1_firstcalcu() {
    var l = document.getElementById("T1-L").value / 1000000.0;
    var c3 = 0.01 / (2 * 3.1415926535 * document.getElementById("T2-work-freq").value * 1000000.0);
    calculateRRange(l, c3);
}

function T1_recalcu() {
    var l = document.getElementById("T1-l-reset").value / 1000000.0;
    var c3 = document.getElementById("T1-c3-reset").value * 1000000.0;
    calculateRRange(l, c3);
}

function T1_calculateC() {
    var pi = 3.1415926535;

    var c3 = document.getElementById("T1-c3-reset").value / 1000000000000;
    var ll = document.getElementById("T1-l-reset").value/1000000;
    var f = document.getElementById("T1-work-freq").value * 1000000;
    var w = 2 * pi * f;
    var zzr = document.getElementById("T1-z-real").value*1;
    var zzi = document.getElementById("T1-z-imag").value*1;
    var zload = new Complex();
    zload.r = zzr;
    zload.i = zzi;
    var a = new Complex(1, 0);
    var yload = complexDivide(a, zload);
  
	var Zc2= new Complex(50,1/(w*c3));
	var Yc2= complexDivide(a,Zc2);
	var Zc1= new Complex(zzr,- Math.sqrt(zzr/Yc2.r-zzr*zzr));
	var Yc1= complexDivide(a,Zc1);

    

    var c1 = 1/(zload.i-Zc1.i)/w*1000000000000;
    var c2 = 1 / (w * ll - 1/(Yc1.i-Yc2.i)) / w * 1000000000000;

    document.getElementById("T1-c1-2").value = c1;
    document.getElementById("T1-c2-2").value = c2;


}