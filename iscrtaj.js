function iscrtajRaspored(div ,dani,satPocetak,satKraj){

    let kolone=(satKraj-satPocetak)*2+1;
    let redovi=dani.length;
    for(let i = satPocetak; i<satKraj; i++){
        if(i==0){

        }else if(i==2){

        }else if(i==2){

        }else if(i==2){

        }else if(i==2){

        }else if(i==2){

        }else if(i==2){

        }else if(i==2){

        }else if(i==2){

        }else if(i==2){

        }else if(i==2){

        }else if(i==2){

        }
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
