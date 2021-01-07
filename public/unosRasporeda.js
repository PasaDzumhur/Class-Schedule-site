//let fs = require('fs');


var predmeti,aktivnosti;
function dajPredmete(){
    var ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function() {// Anonimna funkcija
        if (ajax.readyState == 4 && ajax.status == 200){
            predmeti = JSON.parse(this.responseText);
        }
    }
    ajax.open("GET",'/predmet',true);
    ajax.send();



}
function dajAktivnosti(){
    var ajax2 = new XMLHttpRequest();

    ajax2.onreadystatechange = function() {// Anonimna funkcija
        if (ajax2.readyState == 4 && ajax2.status == 200){
            aktivnosti = JSON.parse(ajax2.responseText);
        }

    }

    ajax2.open("GET",'/aktivnosti',true);
    ajax2.send();


}

function unesi(){
    let naziv = document.getElementById("naziv").value;
    let tip = document.getElementById("tip").value;
    let pocetak = document.getElementById("pocetak").value;
    let kraj = document.getElementById("kraj").value;
    let dan = document.getElementById("dan").value;

    console.log("naziv: " + naziv);
    console.log("tip: " + tip);
    console.log("pocetak: " + pocetak);
    console.log("kraj: " + kraj);
    console.log("dan: " + dan);
    let json ={naziv : naziv, tip : tip, pocetak : pocetak, kraj : kraj, dan :dan};
    let postoji = false;
    for(let i = 0; i<predmeti.length; i++){
        if(predmeti[i]["naziv"]==naziv) postoji = true;
    }
    if(!postoji){
        var dodajPredmet = new XMLHttpRequest();
        dodajPredmet.onreadystatechange = function (){
            if(dodajPredmet.readyState==4 && dodajPredmet.status==200){
                console.log("dodan predmet");
            }

        };
        dodajPredmet.open("POST",'/predmet',true);
        dodajPredmet.setRequestHeader("Content-Type","application/json");
        dodajPredmet.send(JSON.stringify({naziv : naziv}));
    }
    var dodajAktivnost = new XMLHttpRequest();
    dodajAktivnost.onreadystatechange = function () {
        if(dodajAktivnost.readyState==4 && dodajAktivnost.status == 200){
            alert(JSON.parse(this.responseText).message);
            if(JSON.parse(this.responseText).message=="Aktivnost nije validna!" && !postoji){
                var izbrisiPredmet = new XMLHttpRequest();
                izbrisiPredmet.onreadystatechange = function (){
                    if(izbrisiPredmet.readyState==4 && izbrisiPredmet.status == 200){
                        console.log("izbrisan predmet");
                    }
                }
                izbrisiPredmet.open("DELETE", "/predmet/" + naziv,true);
                izbrisiPredmet.send();
            }
        }
    }

    dodajAktivnost.open("POST",'/aktivnost',true);
    dodajAktivnost.setRequestHeader("Content-Type","application/json");
    dodajAktivnost.send(JSON.stringify(json));


}
window.onload = function (){
    dajPredmete();
    dajAktivnosti();
}
