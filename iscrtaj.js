function iscrtajRaspored(div ,dani,satPocetak,satKraj){

    let kolone=(satKraj-satPocetak)*2+1;
    let redovi=dani.length;
    let rupa1 = document.createElement("div");
    rupa1.setAttribute("class","red0");
    okvir.appendChild(rupa1);
    rupa1.style.gridColumn="1/3";
    rupa1.style.gridRow="1";
    for(let i = satPocetak; i<satKraj; i = i + 0.5){
        if(i!=satKraj &&(i==0 || i==2 || i==4 || i==6 || i ==8 || i==10 || i==12 || i==15 || i==17 || i==19 || i==21 || i==23 )){
            let vrijeme = document.createElement("div");
            let kolikoJe = document.createTextNode(i+":00");
            vrijeme.appendChild(kolikoJe);
            vrijeme.setAttribute("class","red0");
            okvir.appendChild(vrijeme);
            vrijeme.style.alignContent="left";
            vrijeme.style.gridRow="1";
        }else {
            let rupa = document.createElement("div");
            okvir.appendChild(rupa);
            rupa.setAttribute("class","red0");
            rupa.style.gridRow="1";
        }
        /*
        if(i==0){
            let vrijeme = document.createElement("div");
            let kolikoJe = document.createTextNode("0:00");
            vrijeme.appendChild(kolikoJe);
            vrijeme.setAttribute("class","red0");
            vrijeme.style.gridColumn=(i-satPocetak);
            vrijeme.style.gridRow="0";
            okvir.appendChild(vrijeme);
        }else if(i==2){
            let vrijeme = document.createElement("div");
            let kolikoJe = document.createTextNode("2:00");
            vrijeme.appendChild(kolikoJe);
            vrijeme.setAttribute("class","red0");
            vrijeme.style.gridColumn=(i-satPocetak);
            vrijeme.style.gridRow="0";

            okvir.appendChild(vrijeme);

        }else if(i==4){
            let vrijeme = document.createElement("div");
            let kolikoJe = document.createTextNode("4:00");
            vrijeme.appendChild(kolikoJe);
            vrijeme.setAttribute("class","red0");
            vrijeme.style.gridColumn=(i-satPocetak);
            vrijeme.style.gridRow="0";

            okvir.appendChild(vrijeme);
        }else if(i==6){
            let vrijeme = document.createElement("div");
            let kolikoJe = document.createTextNode("6:00");
            vrijeme.appendChild(kolikoJe);
            vrijeme.setAttribute("class","red0");
            vrijeme.style.gridColumn=(i-satPocetak);
            vrijeme.style.gridRow="0";
            okvir.appendChild(vrijeme);
        }else if(i==8){
            let vrijeme = document.createElement("div");
            let kolikoJe = document.createTextNode("8:00");
            vrijeme.appendChild(kolikoJe);
            vrijeme.setAttribute("class","red0");
            vrijeme.style.gridColumn=(i-satPocetak);
            vrijeme.style.gridRow="0";
            okvir.appendChild(vrijeme);

        }else if(i==10){
            let vrijeme = document.createElement("div");
            let kolikoJe = document.createTextNode("10:00");
            vrijeme.appendChild(kolikoJe);
            vrijeme.setAttribute("class","red0");
            vrijeme.style.gridColumn=(i-satPocetak);
            vrijeme.style.gridRow="0";
            okvir.appendChild(vrijeme);

        }else if(i==12){
            let vrijeme = document.createElement("div");
            let kolikoJe = document.createTextNode("12:00");
            vrijeme.appendChild(kolikoJe);
            vrijeme.setAttribute("class","red0");
            vrijeme.style.gridColumn=(i-satPocetak);
            vrijeme.style.gridRow="0";
            okvir.appendChild(vrijeme);

        }else if(i==15){
            let vrijeme = document.createElement("div");
            let kolikoJe = document.createTextNode("15:00");
            vrijeme.appendChild(kolikoJe);
            vrijeme.setAttribute("class","red0");
            vrijeme.style.gridColumn=(i-satPocetak);
            vrijeme.style.gridRow="0";
            okvir.appendChild(vrijeme);

        }else if(i==17){
            let vrijeme = document.createElement("div");
            let kolikoJe = document.createTextNode("17:00");
            vrijeme.appendChild(kolikoJe);
            vrijeme.setAttribute("class","red0");
            vrijeme.style.gridColumn=(i-satPocetak)+"/"+(i-satPocetak);
            vrijeme.style.gridRow="0";
            okvir.appendChild(vrijeme);

        }else if(i==19){
            let vrijeme = document.createElement("div");
            let kolikoJe = document.createTextNode("19:00");
            vrijeme.appendChild(kolikoJe);
            vrijeme.setAttribute("class","red0");
            vrijeme.style.gridColumn=(i-satPocetak)+"/"+(i-satPocetak);
            vrijeme.style.gridRow="0";
            okvir.appendChild(vrijeme);

        }else if(i==21){
            let vrijeme = document.createElement("div");
            let kolikoJe = document.createTextNode("21:00");
            vrijeme.appendChild(kolikoJe);
            vrijeme.setAttribute("class","red0");
            vrijeme.style.gridColumn=(i-satPocetak)+"/"+(i-satPocetak);
            vrijeme.style.gridRow="0";
            okvir.appendChild(vrijeme);

        }else {
            let rupa = document.createElement("div");
            rupa.setAttribute("class","red0");
            rupa.style.gridColumn=(i-satPocetak);
            rupa.style.gridRow="0";
            okvir.appendChild(rupa);


        }*/
    }
    okvir.style.gridTemplateColumns="100px repeat("+kolone+",1fr)";
    okvir.style.gridTemplateRows="30px repeat("+redovi+",1fr)";
    for(let i = 0; i<redovi; i++){
        for(let j = 1; j<kolone; j++){
            let div=document.createElement("div");
            let klase = "";
            if(i==0) klase = klase + "red1";
            if(j%2==0) klase = klase+ " " +"crta";
            else klase = klase + " " + "crtice";
            div.setAttribute("class",klase);
            div.setAttribute("id","rupa"+i+"-"+j);
            div.style.gridRow=(i+2);
            div.style.gridColumn=(j+2);
            okvir.appendChild(div);
        }
    }
    for(let i = 0; i<dani.length; i++){
        let div = document.createElement("div");
        let dan = document.createTextNode(dani[i]);
        div.setAttribute("id",dani[i]);
        div.setAttribute("class","kolona0")
        div.appendChild(dan);
        okvir.appendChild((div));
        div.style.gridRow=(i+2);
        div.style.gridColumn="1/3";
        div.style.borderRightStyle="solid";
        div.style.fontSize="x-large";
        div.style.alignContent="center";
    }
    /*
    let item1=document.createElement("div");
    item1.setAttribute("id","grid-item1");
    item1.setAttribute("class","grid-item");
    let item1p1=document.createElement("p");
    let text = document.createTextNode("RMA");
    item1p1.setAttribute("class","imePredmeta");
    item1p1.appendChild(text);
    item1.appendChild(item1p1);
    text = document.createTextNode("Predavanje");
    let item1p2 = document.createElement("p");
    item1p2.setAttribute("class","tipNastave");
    item1p2.appendChild(text);
    item1.appendChild(item1p2);
    okvir.appendChild(item1);

    for(let i = 3; i<9; i++){
        document.getElementById("rupa0-"+i).style.display="none";
    }*/



}

let okvir = document.getElementById("okvir");
iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],9,21);
