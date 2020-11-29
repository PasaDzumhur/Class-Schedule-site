function iscrtajRaspored(div ,dani,satPocetak,satKraj){

    let kolone=(satKraj-satPocetak)*2+1;
    let redovi=dani.length;
    let rupa1 = document.createElement("div");
    rupa1.setAttribute("class","red0");
    div.appendChild(rupa1);
    rupa1.style.gridColumn="1/3";
    rupa1.style.gridRow="1";
    for(let i = satPocetak; i<satKraj; i = i + 0.5){
        if(i!=satKraj &&(i==0 || i==2 || i==4 || i==6 || i ==8 || i==10 || i==12 || i==15 || i==17 || i==19 || i==21 || i==23 )){
            let vrijeme = document.createElement("div");
            let kolikoJe = document.createTextNode(i+":00");
            vrijeme.appendChild(kolikoJe);
            vrijeme.setAttribute("class","red0");
            vrijeme.setAttribute("id","satiJe"+i);
            div.appendChild(vrijeme);
            vrijeme.style.alignContent="left";
            vrijeme.style.gridRow="1";
        }else {
            let rupa = document.createElement("div");
            div.appendChild(rupa);
            rupa.setAttribute("class","red0");
            rupa.setAttribute("id","satiJe"+i);
            rupa.style.gridRow="1";
        }

    }
    div.style.gridTemplateColumns="100px repeat("+kolone+",1fr)";
    div.style.gridTemplateRows="30px repeat("+redovi+",1fr)";
    for(let i = 0; i<redovi; i++){
        for(let j = 1; j<kolone; j++){
            let divPom=document.createElement("div");
            let klase = "";
            if(i==0) klase = klase + "red1";
            if(j%2==0) klase = klase+ " " +"crta";
            else klase = klase + " " + "crtice";
            divPom.setAttribute("class",klase);
            divPom.setAttribute("id","rupa"+(i+1)+"-"+j);
            divPom.style.gridRow=(i+2);
            divPom.style.gridColumn=(j+2);
            okvir.appendChild(divPom);
        }
    }
    for(let i = 0; i<dani.length; i++){
        let divPom = document.createElement("div");
        let dan = document.createTextNode(dani[i]);
        divPom.setAttribute("id",dani[i]);
        divPom.setAttribute("class","kolona0")
        divPom.appendChild(dan);
        div.appendChild((divPom));
        divPom.style.gridRow=(i+2);
        divPom.style.gridColumn="1/3";
        divPom.style.borderRightStyle="solid";
        divPom.style.fontSize="x-large";
        divPom.style.alignContent="center";
    }


}

function dodajAktivnost(raspored, naziv, tip, vrijemePocetak, vrijemeKraj,dan){
    let dani = raspored.querySelectorAll(".kolona0");
    let glupaProvjera = false;
    /*
    for(let i = 0 ; i<dani.length; i++){
        if(dani[i].getAttribute("id")==dan) glupaProvjera=true;
        kolona = i;
    }
    if(!glupaProvjera) return ;*/
    let vremena = raspored.querySelectorAll(".red0");
    let idPocetka = vremena[0].getAttribute("id").slice(6);
    let pocetakRasporeda = parseFloat(idPocetka);
    let idKraja = vremena[vremena.length-1].getAttribute("id").slice(6);
    let krajRasporeda = parseFloat(idKraja);
    if(vrijemePocetak<=pocetakRasporeda || vrijemeKraj<=krajRasporeda){
        return ;
    }
    let grid_item = document.createElement("div","grid-item");
    let imePredmeta = document.createTextNode(naziv);
    let tipPredavanja = document.createTextNode(tip);
    let ime = document.createElement("p");
    let vrsta = document.createElement("p");
    ime.appendChild(imePredmeta);
    vrsta.appendChild(tipPredavanja);
    ime.setAttribute("imePredmeta");
    vrsta.setAttribute("tipNastave");
    raspored.appendChild(grid_item);
    let pocetak = (vrijemePocetak-pocetakRasporeda)*2+2;
    let kraj = (vrijemeKraj-vrijemePocetak)*2+2;
    for(let i = pocetak; pocetak<kraj; pocetak = pocetak + 0.5){
        raspored.removeAttribute("id","rupa"+kolona+"-"+i);
    }
    grid_item.style.gridRow=(kolona+1);
    grid_item.style.gridColumn=pocetak+"/"+kraj;
    raspored.appendChild(grid_item);


}

let okvir = document.getElementById("okvir");
iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],9,21);
dodajAktivnost(okvir,"WT","predavanje",9,12,"Ponedjeljak");
