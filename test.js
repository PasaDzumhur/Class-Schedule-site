let assert = chai.assert;
describe('modul', function (){
    describe('#Testovi za iscrtajRaspored', function (){
        it('Broj kolona mora biti jednak broju dana',function (){
            let okvir=document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],9,21);
            let kolone = okvir.querySelectorAll(".kolona0").length;
            assert.equal(kolone,5);
            okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda"],9,21);
            assert.equal(okvir.querySelectorAll(".kolona0").length,3);
            okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak"],9,21);
            assert.equal(okvir.querySelectorAll(".kolona0").length,2);
            okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Petak"],9,21);
            assert.equal(okvir.querySelectorAll(".kolona0").length,4);
            okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Ponedjeljak"],9,21);
            assert.equal(okvir.querySelectorAll(".kolona0").length,1);



        });
        it('Vrijeme pocetka mora biti prije vremena kraja',function (){
            let okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],9,7);
            assert.equal(okvir.innerHTML,"Greška");

            okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],12,7);
            assert.equal(okvir.innerHTML,"Greška");

            okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Utorak","Srijeda","Četvrtak","Petak"],12,12);
            assert.equal(okvir.innerHTML,"Greška");


        });
        it('Vremena pocetka i kraja moraju biti cijeli brojevi',function (){

            let okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],9,21.5);
            assert.equal(okvir.innerHTML,"Greška");

            okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],12.5,15);
            assert.equal(okvir.innerHTML,"Greška");

            okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Utorak","Srijeda","Četvrtak","Petak"],12.5,17.5);
            assert.equal(okvir.innerHTML,"Greška");
        });

        //Zbog toga sto su i dani dio grida, broj kolona mora biti povecan
        it('Provjera broja kolona na osnovu pocetnog i kranjeg sata',function (){
            let okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],9,21);
            assert.equal(okvir.querySelectorAll(".red0").length,25);

            okvir=document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],9,20);
            assert.equal(okvir.querySelectorAll(".red0").length,23);
        });
        it('Testiranje broja redova i kolona istovremeno',function (){

            let okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],9,21);
            assert.equal(okvir.querySelectorAll(".red0").length * okvir.querySelectorAll(".kolona0").length ,125);

            okvir=document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Četvrtak","Petak"],9,20);
            assert.equal(okvir.querySelectorAll(".red0").length * okvir.querySelectorAll(".kolona0").length ,92);

        })

    });
    describe('Testovi za dodajAktivnost',function (){
        it('U rasporedu treba biti 5 predmeta',function (){
            let okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],9,21);
            modul.dodajAktivnost(okvir,"WT","predavanje",10,13,"Ponedjeljak");
            modul.dodajAktivnost(okvir,"OOI","predavanje",10,13,"Utorak");
            modul.dodajAktivnost(okvir,"OIS","predavanje",10,13,"Srijeda");
            modul.dodajAktivnost(okvir,"VVS","predavanje",10,13,"Četvrtak");
            modul.dodajAktivnost(okvir,"PJP","predavanje",10,13,"Petak");
            assert.equal(okvir.querySelectorAll(".grid-item").length,5);

        });
        it('Testiranje izuzetka kad je vrijeme kraja prije vremena pocetka',function (){
            let okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],9,21);
            let greska = modul.dodajAktivnost(okvir,"WT","predavanje",12,10,"Ponedjeljak");
            assert.equal(greska,"Greška");
            greska = modul.dodajAktivnost(okvir,"WT","predavanje",19,17,"Ponedjeljak");
            assert.equal(greska,"Greška")


        });
        it('testiranje kad okvir nije kreiran',function (){
            assert.equal("Greška",modul.dodajAktivnost(null,"WT","predavanje",11,13,"Ponedjeljak"));
            let okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            assert.equal(modul.dodajAktivnost(null,"WT","predavanje",11,13,"Ponedjeljak"),"Greška");
        });
        it('testiranje kada se dodaje predmet na dan koji nije u rasporedu',function (){
            let okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Utorak","Četvrtak","Petak"],9,21);
            assert.equal("Greška",modul.dodajAktivnost(okvir,"WT","predavanje",9,13,"Ponedjeljak"));
            assert.equal("Greška",modul.dodajAktivnost(okvir,"WT","predavanje",9,13,"Srijeda"));

        });
        it('testiranje kada se dolazi do poklapanja rasporeda',function (){
            let okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],9,21);
            modul.dodajAktivnost(okvir,"WT","predavanje",9,13,"Ponedjeljak");
            assert.equal("Greška",modul.dodajAktivnost(okvir,"OOI","predavanje",12,14,"Ponedjeljak"));
            assert.equal("Greška",modul.dodajAktivnost(okvir,"OIS","predavanje",12.5,14,"Ponedjeljak"));

        });
        it('test sa dosta poziva dodajAktivnost',function (){
            let okvir = document.createElement("div");
            okvir.setAttribute("id","okvir");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],9,21);
            modul.dodajAktivnost(okvir,"WT","predavanje",9,12,"Srijeda");
            modul.dodajAktivnost(okvir,"WT","vježbe",19,20.5,"Ponedjeljak");
            modul.dodajAktivnost(okvir,"VVS","vježbe",10.5,12,"Utorak");
            modul.dodajAktivnost(okvir,"OOI","predavanje",12,15,"Utorak");
            modul.dodajAktivnost(okvir,"OIS","predavanje",15,18,"Utorak");
            modul.dodajAktivnost(okvir,"RG","vježbe",12,14,"Srijeda");
            modul.dodajAktivnost(okvir,"OOI","vježbe",15,16,"Srijeda");
            modul.dodajAktivnost(okvir,"PJP","vježbe",12,13,"Petak");
            modul.dodajAktivnost(okvir,"PJP","predavanje",9,12,"Petak");
            modul.dodajAktivnost(okvir,"RG","predavanje",9,11,"Četvrtak");
            modul.dodajAktivnost(okvir,"RG","tutorijal",11,12,"Četvrtak");
            modul.dodajAktivnost(okvir,"VVS","predavanje",12,15,"Četvrtak");
            assert.equal(12,okvir.querySelectorAll(".grid-item").length);
            assert.equal("Greška",modul.dodajAktivnost(okvir,"DM","predavanje",9,12,"Petak"));
            assert.equal(12,okvir.querySelectorAll(".grid-item").length);


        })
    })

})