let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../local");

//Assertion Style
//chai.assert();
chai.should();

chai.use(chaiHttp);
let assert = chai.assert;

describe('Spirala 3 testovi', () =>{
    describe('GET predmeti testovi', () =>{
        it('Mora vratiti sve predmete',(done) =>{
            chai.request(server)
                .get("/predmeti").end(((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            }))
        })
    })
})

