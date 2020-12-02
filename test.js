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

    })

})