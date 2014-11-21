describe("Remote :: net/darkhounds/betaberry/cli/js/services/api.js", function() {
    //
    this.timeout(5000);
    
    beforeEach(function()                                                       {
        angular.mock.module('core.darkhounds.net');
        angular.mock.module('betaberry.darkhounds.net');
    });
    
    var remote;
    it("Service remote should exist ", inject(function(serviceRemote)           {
        remote = serviceRemote;
        expect(remote).to.exist;
    }));
    
    describe("Auth", function()                                                 {
        it("Should return a profile named 'Jhon Doe' with 1000 credits", function(done) {
            remote.login("test@test.com", "1234567", function(response)         {
                expect(response).to.exist;
                expect(response.data).to.exist;
                expect(response.data.name).to.equal("Jhon");
                expect(response.data.lastName).to.equal("Doe");
                expect(response.data.credits).to.equal(1000);
                done();
            });
        });
        it("Should return the error code 'sessionNotClosed' ", function(done)   {
            remote.login("test@test.com", "1234567", function(response)         {
                expect(response).to.exist;
                expect(response.error.code).to.equal('sessionNotClosed');
                done();
            });
        });
        it("Should logout successfully", function(done)                         {
            remote.logout(function(response)                                    {
                expect(response).to.exist;
                expect(response.error).to.not.exist;
                done();
            });
        });
        it("Should return the error code 'sessionNotOpen' ", function(done)     {
            remote.logout(function(response)                                    {
                expect(response).to.exist;
                expect(response.error.code).to.equal('sessionNotOpened');
                done();
            });
        });
    });
});