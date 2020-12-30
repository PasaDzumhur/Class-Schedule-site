
let okvir2=document.getElementById("okvir2");
iscrtajRaspored(okvir2,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],9,21);
if(dodajAktivnost(okvir2,"WT","predavanje",9,12,"Srijeda")=="Greška") alert("Greška");
if(dodajAktivnost(okvir2,"WT","vježbe",19,20.5,"Ponedjeljak")=="Greška") alert("Greška");
if(dodajAktivnost(okvir2,"VVS","vježbe",10.5,12,"Utorak")=="Greška") alert("Greška");
if(dodajAktivnost(okvir2,"OOI","predavanje",12,15,"Utorak")=="Greška") alert("Greška");
if(dodajAktivnost(okvir2,"OIS","predavanje",15,18,"Utorak")=="Greška") alert("Greška");
if(dodajAktivnost(okvir2,"RG","vježbe",12,14,"Srijeda")=="Greška") alert("Greška");
if(dodajAktivnost(okvir2,"OOI","vježbe",15,16,"Srijeda")=="Greška") alert("Greška");
if(dodajAktivnost(okvir2,"PJP","vježbe",12,13,"Petak")=="Greška") alert("Greška");
if(dodajAktivnost(okvir2,"PJP","predavanje",9,12,"Petak")=="Greška") alert("Greška");
if(dodajAktivnost(okvir2,"RG","predavanje",9,11,"Četvrtak")=="Greška") alert("Greška");
if(dodajAktivnost(okvir2,"RG","tutorijal",11,12,"Četvrtak")=="Greška") alert("Greška");
if(dodajAktivnost(okvir2,"VVS","predavanje",12,15,"Četvrtak")=="Greška") alert("Greška");
if(dodajAktivnost(okvir2,"DM","predavanje",9,12,"Petak")=="Greška") alert("Greška");