var select,option;
function setGrupe(){
    console.log("test1");
    var ajaxGrupe = new XMLHttpRequest();
    ajaxGrupe.onreadystatechange = function() {// Anonimna funkcija
        if (ajaxGrupe.readyState == 4 && ajaxGrupe.status == 200){
            //predmeti = JSON.parse(this.responseText);
            let grupe = JSON.parse(this.responseText);
            for(let i = 0; i<grupe.length; i++) {
                console.log(grupe[i]["naziv"]);
                option = document.createElement("option");
                option.text = grupe[i]["naziv"];
                console.log(option.value);
                select = document.getElementById("grupe");
                select.appendChild(option);


            }
            console.log("test2");
        }
    }
    ajaxGrupe.open("GET",'/v2/grupe',true);
    ajaxGrupe.send();
}
window.onload=setGrupe();
