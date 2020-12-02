var modul = (function (){
    var iscrtajRaspored=function (div ,dani,satPocetak,satKraj) {
        if (satPocetak >= satKraj || satPocetak<0 || satPocetak>24 || satKraj<0 || satPocetak>24 ||
        !Number.isInteger(satPocetak) || !Number.isInteger(satKraj)) {
            //alert("Ne moze to tako...");
            div.innerHTML="Greška";
            return;
        }

        let kolone = (satKraj - satPocetak) * 2 + 1;
        let redovi = dani.length;
        let rupa1 = document.createElement("div");
        rupa1.setAttribute("class", "red0");
        div.appendChild(rupa1);
        rupa1.style.gridColumn = "1/3";
        rupa1.style.gridRow = "1";
        rupa1.style.borderBottomStyle = "none";
        for (let i = satPocetak; i < satKraj; i = i + 0.5) {
            if (i != satKraj && (i == 0 || i == 2 || i == 4 || i == 6 || i == 8 || i == 10 || i == 12 || i == 15 || i == 17 || i == 19 || i == 21 || i == 23)) {
                let vrijeme = document.createElement("div");
                let kolikoJe = document.createTextNode(i + ":00");
                vrijeme.appendChild(kolikoJe);
                vrijeme.setAttribute("class", "red0");
                vrijeme.setAttribute("id", "satiJe" + i);
                div.appendChild(vrijeme);
                vrijeme.style.alignContent = "left";
                vrijeme.style.gridRow = "1";
            } else {

                let rupa = document.createElement("div");
                div.appendChild(rupa);
                rupa.setAttribute("class", "red0");
                rupa.setAttribute("id", "satiJe" + i);
                rupa.style.gridRow = "1";
            }

        }
        div.style.gridTemplateColumns = "100px repeat(" + kolone + ",1fr)";
        div.style.gridTemplateRows = "30px repeat(" + redovi + ",1fr)";
        for (let i = 0; i < redovi; i++) {
            for (let j = 1; j < kolone; j++) {
                let divPom = document.createElement("div");
                let klase = "";
                if (i == 0) klase = klase + "red1";
                if (j % 2 == 0) klase = klase + " " + "crta";
                else klase = klase + " " + "crtice";
                divPom.setAttribute("class", klase);
                divPom.setAttribute("id", "rupa" + (i + 1) + "-" + j);
                //divPom.style.gridRow=(i+2);
                //divPom.style.gridColumn=(j+2);
                div.appendChild(divPom);
            }
        }
        for (let i = 0; i < dani.length; i++) {
            let divPom = document.createElement("div");
            let dan = document.createTextNode(dani[i]);
            divPom.setAttribute("id", dani[i]);
            divPom.setAttribute("class", "kolona0")
            divPom.appendChild(dan);
            div.appendChild((divPom));
            divPom.style.gridRow = (i + 2);
            divPom.style.gridColumn = "1/3";
            divPom.style.borderRightStyle = "solid";
            divPom.style.fontSize = "x-large";
            divPom.style.alignContent = "center";
        }
    }



    var dodajAktivnost=function (raspored, naziv, tip, vrijemePocetak, vrijemeKraj, dan){
        if(raspored==null || raspored.querySelectorAll(".red0").length==0) return "Greška";

        if(vrijemePocetak>=vrijemeKraj) return "Greška";
        let dani = raspored.querySelectorAll(".kolona0");
        let glupaProvjera = false;
        //for(let i = 0 ; i<dani.length; i++) console.log(dani[i].getAttribute("id"));
        let kolona;
        for(let i = 0 ; i<dani.length; i++){
            if(dani[i].getAttribute("id")==dan){
                glupaProvjera=true;
                kolona=i+1;
            }

        }
        if(!glupaProvjera) {
            //alert("Ne valja ti taj raspored");
            return "Greška";
        }
        let vremena = raspored.querySelectorAll(".red0");
        //for(let i = 0 ; i<vremena.length; i++) console.log(vremena[i].getAttribute("id"));
        let idPocetka = vremena[1].getAttribute("id").slice(6);
        let pocetakRasporeda = parseFloat(idPocetka);
        let idKraja = vremena[vremena.length-1].getAttribute("id").slice(6);
        let krajRasporeda = parseFloat(idKraja)+0.5;
        if(vrijemePocetak<pocetakRasporeda || vrijemeKraj>krajRasporeda){

            //alert("Ne valja ti taj raspored ");
            return "Greška";
        }
        let pocetak = (vrijemePocetak-pocetakRasporeda)*2;
        let kraj = (vrijemeKraj-vrijemePocetak)*2;
        for(let i = pocetak+1; i<pocetak+kraj+1; i++){
            if(raspored.querySelectorAll("#rupa"+kolona+"-"+i).length==0){
                //alert("Poklapanje u rasporedu");
                return "Greška";
            }
        }
        let grid_item = document.createElement("div");
        grid_item.setAttribute("class","grid-item");
        let imePredmeta = document.createTextNode(naziv);
        let tipPredavanja = document.createTextNode(tip);
        let ime = document.createElement("p");
        let vrsta = document.createElement("p");
        grid_item.appendChild(ime);
        grid_item.appendChild(vrsta);
        ime.appendChild(imePredmeta);
        vrsta.appendChild(tipPredavanja);
        ime.setAttribute("class","imePredmeta");
        vrsta.setAttribute("class","tipNastave");
        raspored.appendChild(grid_item);

        console.log("pocetak rasporeda; " + pocetakRasporeda);
        console.log("kraj rasporeda: " + krajRasporeda);
        console.log("pocetakPredavanja: " + vrijemePocetak);
        console.log("krajPredavanja: " + vrijemeKraj);
        console.log("pocetak: " + pocetak + " kraj: " + kraj);
        console.log("kolona: "+ kolona);
        for(let i = pocetak+1; i<pocetak+kraj+1; i++){

            console.log("rupa" + kolona + "-" + i);
            let izbrisani=raspored.querySelectorAll("#rupa"+kolona+"-"+i);
            
            izbrisani[0].remove();

        }
        raspored.appendChild(grid_item);
        grid_item.style.gridRow=(kolona+1);
        console.log((pocetak+3));
        console.log((kraj+3));
        grid_item.style.gridColumnStart=(pocetak+3);
        grid_item.style.gridColumnEnd=(pocetak+kraj+3);

        grid_item.style.borderBottomStyle="solid";
        grid_item.style.textAlign="center";
        if((pocetak+kraj)%2==0) grid_item.style.borderRightStyle="solid";
        else grid_item.style.borderRightStyle="dotted";

        return "success";


    }
        return {
        iscrtajRaspored: iscrtajRaspored,
        dodajAktivnost: dodajAktivnost
    }


}());


