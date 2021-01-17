var select,option,textArea,selectedOption;
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

function unesi(){
    textArea = document.getElementById("podaci");
    let textAreaPodaci = textArea.value;
    let red = textAreaPodaci.split('\n');
    let json = [];
    select = document.getElementById("grupe");
    selectedOption=select.options[select.selectedIndex].text;
    //selectedOption.replace(" ", "%")
    red.forEach(podatak => {
        podatak = podatak.split(',');
        console.log({ime : podatak[0] , indeks : podatak[1]});
        json.push({ime : podatak[0] , indeks : podatak[1]});
    })
    var ajaxStudenti = new XMLHttpRequest();
    ajaxStudenti.onreadystatechange = function (){
        if(ajaxStudenti.readyState == 4 && ajaxStudenti.status == 200){
            console.log("odradjen");
            let text = this.responseText;
            document.getElementById("podaci").value=text;
        }
    }
    //console.log(json);

    ajaxStudenti.open("POST",'/v2/viseStudenata/'+selectedOption, true);
    ajaxStudenti.setRequestHeader("Content-type","application/json");
    ajaxStudenti.send(JSON.stringify(json));
}
window.onload=setGrupe();
