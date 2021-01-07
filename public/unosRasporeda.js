//let fs = require('fs');


var predmeti,aktivnosti;
var naziv,tip,pocetak,kraj,dan;
window.onload = function (){
    /*
    fs.readFile("predmeti.txt",function read ( err, buf){
        if(err) throw err;
        predmeti = buf.toString().split('\n');
    })
    fs.readFile("aktivnosti.txt", function read(err, buf){
        if(err) throw err;
        aktivnosti = buf.toString().split('\n');
    })*/
    predmeti = dajPredmete(ispisi());
    aktivnosti = dajAktivnosti(ispisi());
    naziv = document.getElementById("naziv");
    tip = document.getElementById("tip");
    pocetak = document.getElementById("pocetak");
    kraj = document.getElementById("kraj");
    dan = document.getElementById("dan");
    document.getElementById("unesi").addEventListener("click",function (){unesi(naziv,tip,pocetak,kraj,dan)});
}
function ispisi(sadzraj){
    console.log(sadzraj);
}
function dajPredmete(fnCallback){
    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {// Anonimna funkcija
        if (ajax.readyState == 4 && ajax.status == 200){
            predmeti = ajax.responseText;
            fnCallback(predmeti);

        }
        else if (ajax.readyState == 4){
            fnCallback("prazno");
        }

    }


    ajax.open("GET","http://localhost:3000/predmet",true);
    ajax.setRequestHeader("Content-Type", "application/json");

}
function dajAktivnosti(){
    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {// Anonimna funkcija
        if (ajax.readyState == 4 && ajax.status == 200){
            predmeti = ajax.responseText;
            fnCallback(aktivnosti);

        }
        else if (ajax.readyState == 4){
            fnCallback("prazno");
        }

    }

    ajax.open("GET","http://localhost:3000/aktivnosti",true);
    ajax.setRequestHeader("Content-Type", "application/json");


}

function unesi(naziv,tip,pocetak,kraj,dan){
    console.log("naziv: " + naziv.innerHTML);
    console.log("tip: " + tip.innerHTML);
    console.log("pocetak: " + pocetak.innerHTML);
    console.log("kraj: " + kraj.innerHTML);
    console.log("dan: " + dan.innerHTML);

}