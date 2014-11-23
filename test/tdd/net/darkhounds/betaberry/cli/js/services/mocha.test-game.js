describe("Game :: net/darkhounds/betaberry/cli/js/services/serviceGame.js", function()  {
    //
    this.timeout(5000);

    var session;
    var game;
    beforeEach(function(done)                                                   {
        angular.mock.module('betaberry.darkhounds.net');
        
        inject(function(serviceGame, serviceSession)                            {
            session = serviceSession;
            game    = serviceGame;
            done();
        });
    });
    
    beforeEach(function(done)                                                   {
        var listener = session.login("test@test.com", "1234567").$on("changed", function() {
            listener();
            done();
        });
    });
    
    it("Should place a new bet of 100 credits at diff of 1", function(done)     {
        var listenerRemover = game.bet(100, 1).$on("changed", function()        {
            listenerRemover();
            expect(game.getBet()).to.exist;
            expect(game.getBetAmount()).to.equal(100);
            expect(game.getBetLevel()).to.equal(1);
            expect(game.isClosed()).to.be.false;
            done();
        });
    });
    
    it("Should end the game", function(done)                                    {
        var listenerRemover = game.bet(100, 1).$on("changed", function()        {
            listenerRemover();
            listenerRemover = game.play([0,0]).$on("changed", function()        {
                listenerRemover();
                expect(game.getSlots()).to.have.length(1);
                expect(game.isClosed()).to.be.true;
                done();
            });
        });
    });
    
    afterEach(function(done)                                                    {
        var listenerRemover = session.logout().$on("changed", function()        {
            listenerRemover();
            done();
        });
    });
    // it.skip("", function(done){ });
});