let assert = chai.assert;
describe('modul', function (){
    describe('#Testovi za iscrtajRaspored', function (){
        it('Broj kolona mora biti jednak broju dana',function (){
            let okvir=document.createElement("div");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],9,21);
            let kolone = okvir.querySelectorAll(".kolona0").length;
            assert.equal(kolone,5);
        });
        it('Sad su samo 3 dana , pa i 3 kolone',function (){
            let okvir = document.createElement("div");
            modul.iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda"],9,21);
            assert.equal(okvir.querySelectorAll(".kolona0").length,3);
        });
        it('')
    })
})