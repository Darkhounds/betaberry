describe("Game :: net/darkhounds/betaberry/cli/js/services/api.js", function() {
    //
    this.timeout(5000);
    
    beforeEach(function()                                                       {
        angular.mock.module('core.darkhounds.net');
        angular.mock.module('betaberry.darkhounds.net');
    });
    
    var session;
    var game;
    it("Service session should exist ", inject(function(serviceGame, serviceSession) {
        session = serviceSession;
        game    = serviceGame;
        expect(game).to.exist;
    }));
    
    it("Should place a new bet of 100 credits at diff of 1", function(done)     {
        session.login("test@test.com", "1234567", function(response)            {
            expect(response).to.exist;
            expect(response.error).to.not.exist;
            var listener = game.$on("changed", function()                       {
                listener();
                expect(game.getBet()).to.exist;
                expect(game.getBetAmount()).to.equal(100);
                expect(game.getBetLevel()).to.equal(1);
                done();
            });
            game.bet(100, 1);
        });
    });
    
    // it.skip("", function(done){ });
});