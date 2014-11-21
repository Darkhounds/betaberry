describe("Session :: net/darkhounds/betaberry/cli/js/services/api.js", function() {
    //
    this.timeout(5000);
    
    beforeEach(function()                                                       {
        angular.mock.module('core.darkhounds.net');
        angular.mock.module('betaberry.darkhounds.net');
    });
    
    var session;
    it("Service session should exist ", inject(function(serviceSession)         {
        session = serviceSession;
        expect(session).to.exist;
    }));
    
    it("Should return a profile named 'Jhon Doe' with 1000 credits", function(done){
        var listener = session.$on('changed', function()                        {
            listener();
            expect(session.getName()).to.equal("Jhon Doe");
            expect(session.getCredits()).to.equal(1000);
            done();
        });
        session.login("test@test.com", "1234567");
    });
    
    it("Upon logout should have no name nor credits", function(done)            {
        var listener = session.$on('changed', function()                        {
            listener();
            expect(session.getName()).to.equal("");
            expect(session.getCredits()).to.equal(0);
            done();
        });
        session.logout();
    });
    
    // it.skip("", function(done){ });
});