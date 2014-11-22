describe("Session :: net/darkhounds/betaberry/cli/js/services/serviceSession.js", function() {
    //
    this.timeout(5000);

    var api;
    var session;
    beforeEach(function()                                                       {
        angular.mock.module('betaberry.darkhounds.net');
        
        inject(function(serviceAPI, serviceSession)                             {
            api     = serviceAPI;
            session = serviceSession;
        });
    });
    
    it("Should return a profile named 'Jhon Doe' with 1000 credits", function(done){
        var listenerRemover = session.login("test@test.com", "1234567").$on('changed', function() {
            listenerRemover();
            expect(session.getName()).to.equal("Jhon Doe");
            expect(session.getCredits()).to.equal(1000);
            done();
        });
    });
    
    it("Upon logout should have no name nor credits", function(done)            {
        session.login("test@test.com", "1234567", function()                    {
            session.logout(function()                                           {
                expect(session.getName()).to.equal("");
                expect(session.getCredits()).to.equal(0);
                done();
            });
        });
    });
    
    describe("Betting", function()                                              {
        beforeEach(function (done)                                              {
            var listenerRemover = session.$on("changed", function()             {
                listenerRemover();
                done();
            });
            session.login("test@test.com", "1234567", function()                {
                api.bet(100, 1);
            });
        });

        it("Should be notified when a game is over", function(done)             {
            var credits = session.getCredits();
            var listenerRemover = session.$on("changed", function()             {
                listenerRemover();
                expect(session.getCredits()).to.equal(credits + gain);
                done();
            });
            var gain;
            api.play([0,0], function(response)                                  {
                gain = response.data.gain;
            });
        });
        
        afterEach(function (done)                                               {
            api.logout(function() { done();                                     });
        });
    });
    
    
    
    // it.skip("", function(done){ });
});