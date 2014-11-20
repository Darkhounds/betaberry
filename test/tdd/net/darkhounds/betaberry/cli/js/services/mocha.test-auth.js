describe("Auth :: net/darkhounds/betaberry/cli/js/services/auth.js", function() {
    //
    this.timeout(5000);
    
    var serviceAuth;
    
    beforeEach(function() {
        angular.mock.module('core.darkhounds.net');
        angular.mock.module('betaberry.darkhounds.net');
    });
    
    describe("Login", function() {
        var auth;
        beforeEach(inject(function(_auth_)                                      {
            auth = _auth_;
        }));
        
        it("Should return fail with a 'EmailBadFormat' code", function(done)    {
            auth.$on("auth.login", function(data)           {
                expect(data).to.not.exist;
                done();
            });
            auth.$on("auth.error.password", function(data)  {
                expect(data).to.not.exist;
                done();
            });
            auth.$on("auth.error.email", function(data)     {
                expect(data).to.exist;
                expect(data.code).to.equal("EmailBadFormat");
                done();
            });
            auth.login("test@test", "1234567");
        });
        
        it("Should return fail with a 'PasswordBadFormat' code", function(done) {
            inject(function(auth) {
                auth.$on("auth.login", function(data)           {
                    expect(data.code).to.not.exist;
                    done();
                });
                auth.$on("auth.error.email", function(data)  {
                    expect(data.code).to.not.exist;
                    done();
                });
                auth.$on("auth.error.password", function(data)     {
                    expect(data).to.exist;
                    expect(data.code).to.equal("PasswordBadFormat");
                    done();
                });
                auth.login("test@test.pt", "123");
            });
        });
        
        it("Should return a profile named 'Jhon Doe' with 100 credits", function(done) {
            inject(function(auth) {
                auth.$on("auth.error.email", function(data)     {
                    expect(data.code).to.not.exist;
                    done();
                });
                auth.$on("auth.error.password", function(data)  {
                    expect(data.code).to.not.exist;
                    done();
                });
                auth.$on("auth.login", function(data)           {
                    expect(data).to.exist;
                    expect(data.name).to.equal("Jhon");
                    expect(data.lastName).to.equal("Doe");
                    expect(data.credits).to.equal(1000);
                    done();
                });
                auth.login("test@test.com", "1234567");
            });
        });
    });
});