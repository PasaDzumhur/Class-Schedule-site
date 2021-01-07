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
    alert(predmeti);
    alert(aktivnosti)


}
window.onload = function (){
    dajPredmete();
    dajAktivnosti();
}
