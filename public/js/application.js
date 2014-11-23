'use strict';

angular.module('betaberry.darkhounds.net', ['core.darkhounds.net']);

angular.module('betaberry.darkhounds.net').factory('serviceAPI', ['observable', 'serviceRemote',
    function(observable, serviceRemote)                                         {
        var service         = observable.create();
        
        service.login       = function(email, password, callback)               {
            var request     = serviceRemote.login(email, password, function(response){
                if (callback && typeof callback === "function") callback(response);
                if (!response.error) service.$broadcast('logedin', response.data);
            });
            //
            return service; 
        };
        
        service.logout      = function(callback)                                {
            var request     = serviceRemote.logout(function(response)           {
                if (callback && typeof callback === "function") callback(response);
                if (!response.error) service.$broadcast('logedout', response.data);
            });
            //
            return service;
        };
        
        service.bet         = function(amount, level, callback)                 {
            var request     = serviceRemote.bet(amount, level, function(response) {
                if (callback && typeof callback === "function") callback(response);
                if (!response.error) service.$broadcast('betted', response.data);
            });
            //
            return service;
        };

        service.play        = function(cell, callback)                          {
            var request     = serviceRemote.play(cell, function(response)       {
                if (callback && typeof callback === "function") callback(response);
                if (!response.error) service.$broadcast('played', response.data);
            });
            //
            return service;
        };
        
        return service;
    }
]);

angular.module('betaberry.darkhounds.net').factory('serviceGame', ['observable', 'serviceAPI',
    function(observable, serviceAPI)                                            {
        var service         = observable.create();

        var _bet                = null;
        service.hasBetted       = function()                                    {
            return !!_bet;
        };
        service.getBet          = function()                                    {
            return _bet;
        };
        service.getBetAmount    = function()                                    {
            return _bet?_bet.amount:0;
        };
        service.getBetLevel     = function()                                    {
            return _bet?_bet.level:1;
        };
        
        var _slots              = null;
        service.getSlots        = function()                                    {
            return _slots || [];
        };
        
        var _closed             = true;
        service.isClosed        = function()                                    {
            return _closed;
        };

        var _puzzle             = null;
        service.getPuzzle       = function()                                    {
            return _puzzle || [];
        };

        var _gain               = 0;
        service.getGain         = function()                                    {
            return _gain || [];
        };

        serviceAPI.$on('logedin', function(data)                                {
            _bet            = null;
            _closed         = false;
            _puzzle         = null;
            _slots          = null;
            _gain           = 0;
            service.$broadcast('changed');
        });
        serviceAPI.$on('logedout', function()                                   {
            _bet            = null;
            _closed         = false;
            _puzzle         = null;
            _slots          = null;
            _gain           = 0;
            service.$broadcast('changed');
        });
        serviceAPI.$on('betted', function(data)                                 {
            _bet            = data;
            _closed         = !_bet;
            _puzzle         = null;
            _slots          = null;
            _gain           = 0;
            service.$broadcast('changed');
        });
        serviceAPI.$on('played', function(data)                                 {
            _closed         = !_bet || data.closed;
            _puzzle         = data.puzzle || [];
            _slots          = data.slots || [];
            _gain           = data.gain || 0;
            service.$broadcast('changed');
        });
        
        service.bet         = function(amount, level, callback)                 {
            serviceAPI.bet(amount, level, callback);
            return service;
        };
        
        service.play        = function(cell, callback)                          {
            serviceAPI.play(cell, callback);
            return service;
        };
        
        return service;
    }
]);

angular.module('betaberry.darkhounds.net').factory('serviceRemote', [
    function()                                                                  {
        var service         = {};
        
        function _createRequest()                                               {
            // return observable.create({response:{data: null, error: null}});
            return {response:{data: null, error: null}};
        }

        var _betMockup      = null;
        var _puzzleMockup   = null;
        var _playedCells    = [];
        var _sessionMockup  = null;
        service.login       = function(email, password, callback)               {
            // TODO: Do the actual http request to the server API
            //
            var request            = _createRequest();
            if (_sessionMockup) request.response.error = {code:'sessionNotClosed', msg:'Session Not Closed!'};
            else                                                                {
                _sessionMockup          = {name: "Jhon", lastName:"Doe", credits:1000};
                request.response.data   = {name: "Jhon", lastName:"Doe", credits:1000};
            }
            //
            _resetBetAndPuzzle();
            //
            if (callback && typeof callback === "function") callback(request.response);
            //
            return request;
        };
        
//        function validateEmail (email)                                          {
//            var pattern  = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//            return pattern.test(email);
//        };
//      
//        function validatePassword (password)                                    {
//            return password.length > 6;
//        };
        function _resetBetAndPuzzle()                                           {
            _betMockup          = null;
            _puzzleMockup       = null;
            _playedCells.length = 0;
        }
        
        service.logout      = function(callback)                                {
            // TODO: Do the actual http request to the server API
            //
            var request            = _createRequest();
            if (!_sessionMockup) request.response.error  = {code:'sessionNotOpened', msg:'Session Not Opened!'};
            else                                                                {
                _sessionMockup          = null;
                request.response.data   = {};
            }
            //
            _resetBetAndPuzzle();
            //
            if (callback && typeof callback === "function") callback(request.response);
            //
            return request;
        };
        
        service.bet         = function(amount, level, callback)                 {
            // TODO: Do an actual server API request

            var request            = _createRequest();
            if (!_sessionMockup) request.response.error = {code: "sessionClosed", msg: "Session closed"};
            else if (_betMockup) request.response.error = {code: "betOpened", msg: "Bet Already opened"};
            else if (!amount || isNaN(amount) || amount < 1) request.response.error = {code: "betInvalidAmount", msg: "Invalid bet amount"};
            else if (amount > _sessionMockup.credits) request.response.error = {code: "betToHigh", msg: "Bet is to high"};
            else if (!level || isNaN(level) || level < 1 || level > 4) request.response.error = {code: "betInvalidLevel", msg: "Bet has an invalid level"};
            else                                                                {
                _puzzleMockup           = _createPuzzle();
                _betMockup              =
                request.response.data   = {amount: amount, level: level};
            }
            
            if (callback && typeof callback === "function") callback(request.response);
            //
            return request;
        };
        
        var _honey      = 1;
        var _berries    = 2;
        var _traps      = 1;
        var _bees       = 2;
        function _createPuzzle()                                                {
            var cellPool    = _createGrid(5, null, true);
            var tokens  = {
                honney:     _drawCells(cellPool, _honey),
                berries:    _drawCells(cellPool, _berries),
                traps:      _drawCells(cellPool, _traps),
                bees:       _drawCells(cellPool, _bees)
            };

            var puzzle      = _createGrid(5, "");
            _setCellsToType(puzzle, tokens.honney,  "honey");
            _setCellsToType(puzzle, tokens.berries, "berry");
            _setCellsToType(puzzle, tokens.traps,   "trap");
            _setCellsToType(puzzle, tokens.bees,    "bee");
            
            console.log("Puzzle", puzzle);
            
            return puzzle;
        }
        
        function _createGrid(size, defaultValue, autoFill)                      {
            var table = [];
            for (var i = 0; i < size; i++)                                      {
                table[i] = [];
                for (var j = 0; j < size; j++) table[i][j] = autoFill?j:defaultValue;
            }
            return table;
        }
        
        function _drawCells(grid, count)                                        {
            var cells   = [];
            for (var i = 0; i < count; i++) cells.push(_drawCell(grid));
            return cells;
        }
        
        function _drawCell(grid)                                                {
            var rowID       = Math.round(Math.random() * (grid.length - 1));
            var cellID      = Math.round(Math.random() * (grid[rowID].length - 1));
            var cell        = [rowID, grid[rowID].splice(cellID, 1)[0]];
            if (!grid[rowID].length) grid.splice(rowID, 1);
            //
            return cell;
        }
        
        function _setCellsToType(grid, cells, type)                             {
            for (var id in cells) grid[cells[id][0]][cells[id][1]] = type;
        }

        service.play        = function(cell, callback)                          {
            // TODO: Do the actual http request to the server API
            //
            var request                 = _createRequest();
            if (!_sessionMockup)    request.response.error = {code: "sessionClosed", msg: "Session Closed"};
            else if (!_betMockup)   request.response.error = {code: "betClosed", msg: "No Bet Opened"};
            else if (_checkPlayedCell(_playedCells, cell)) request.response.error = {code: "slotAlreadyPlayed", msg: "The played slot was already played"};
            if (!request.response.error)                                        {
                var token                   = _puzzleMockup[cell[0]][cell[1]];
                cell.push(token);
                _playedCells.push(cell);

                request.response.data       = {
                    closed: (_playedCells.length >= _betMockup.level || token == "trap" || token == "bee"),
                    slots: _playedCells.slice()
                };

                if (request.response.data.closed)                               {
                    var gain                        = _endGame(_playedCells, _betMockup);
                    //
                    _sessionMockup.credits          = _sessionMockup.credits + gain;
                    if (_sessionMockup.credits < 0) _sessionMockup.credits = 0;
                    //
                    request.response.data.gain      = gain;
                    request.response.data.credits   = _sessionMockup.credits;
                    request.response.data.puzzle    = _parsePuzzle(_puzzleMockup);
                    //
                    _resetBetAndPuzzle();
                }
            }

            if (callback && typeof callback === "function") callback(request.response);
            
            return request;
        };
        
        function _checkPlayedCell(cells, cell)                                  {
            for (var i in cells)
                if (cells[i][0] == cell[0] && cells[i][1] == cell[1])
                    return true;
            //
            return false;
        }
        
        function _parsePuzzle(puzzle)                                           {
            var parsed = [];
            
            for (var i in puzzle)
                for (var j in puzzle[i])
                    parsed.push([i*1, j*1, puzzle[i][j]]);

            return parsed;
        }

        function _endGame(cells, bet)                                           {
            var bee     = false;
            var trap    = false;
            var bonus   = 0;
            for (var i in cells) switch (cells[i][2])                           {
                case 'trap':    trap    = true; break;
                case 'bee':     bee     = true; break;
                case 'honey':   bonus   += 3; break;
                case 'berry':   bonus   += 2; break;
                default: break;
            }
            var gain = ((trap?-3:(bee?-1:bonus)) * bet.amount) - bet.amount;
            
            return gain;
        }
        
        return service;
    }
]);

angular.module('betaberry.darkhounds.net').factory('serviceSession', ['observable', 'serviceAPI',
    function(observable, serviceAPI)                                            {
        var service         = observable.create();
        
        var _session        = null;
        serviceAPI.$on('logedin', function(data)                                {
            _session = data;
            service.$broadcast('changed');
        });
        serviceAPI.$on('logedout', function()                                   {
            _session = null;
            service.$broadcast('changed');
        });
        serviceAPI.$on('played', function(data)                                 {
            if (!_session) retun;
            _session.credits = data.credits;
            service.$broadcast('changed');
        });
        
        service.login       = function(email, password, callback)               {
            serviceAPI.login(email, password, callback);
            return service;
        };
        
        service.logout      = function(callback)                                {
            serviceAPI.logout(callback);
            return service;
        };

        service.isOpen      = function()                                        {
            return !!_session;
        };
        service.getName     = function()                                        {
            if (!_session) return "";
            var name    = "";
            if (_session.name)       name += _session.name;
            if (_session.lastName)   name += (name?" ":"") + _session.lastName;
            return name;
        };
        service.getCredits  = function()                                        {
            return _session?_session.credits:0;
        };
        
        return service;
    }
]);

angular.module('betaberry.darkhounds.net').directive('board', [function()     {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/board.html',
        controller:     ['$scope', 'serviceSession', 'serviceGame', function($scope, serviceSession, serviceGame) {
            $scope.amount       = 10;
            $scope.isLogged     = serviceSession.isOpen();
            $scope.hasBetted    = serviceGame.hasBetted();
            $scope.isOver       = serviceGame.isClosed();
            $scope.gain         = serviceGame.getGain();
            $scope.rows         = [];
            
            serviceSession.$on('changed', function()                            {
                $scope.isLogged     = serviceSession.isOpen();
                $scope.hasBetted    = false;
                $scope.isOver       = false;
                $scope.gain         = 0;
                $scope.$apply();
            });

            serviceGame.$on('changed', function()                               {
                $scope.hasBetted    = serviceGame.hasBetted();
                $scope.isOver       = serviceGame.isClosed();
                $scope.gain         = serviceGame.getGain();
                // console.log("Gain:", $scope.gain);
                
                _updateRows($scope.rows, serviceGame.getSlots(), serviceGame.getPuzzle());
                $scope.$apply();
            });
            
            $scope.bet    = function(amount, level)                             {
                serviceGame.bet(amount, level);
            };

            $scope.play   = function(row, col)                                  {
                serviceGame.play([row, col]);
            };
            //
            function _updateRows(rows, slots, puzzle)                           {
                // Create the slots or mark them by default as hidden and hide
                // their token
                for (var i = 0; i < 5; i++)                                     {
                    if (!rows[i]) rows[i] = [];
                    for (var j = 0; j < 5; j++)                                 {
                        if (rows[i][j])                                         {
                            rows[i][j].hidden    = true;
                            rows[i][j].selected  = false;
                            rows[i][j].token     = '';
                        } else rows[i][j] = {row: i, col:j, hidden:true, selected: false, token: ''};
                    }
                }
                //
                // If a selection of slots has been made then then select them,
                // mark them as visible and disclose their token
                for (var k in slots)                                            {
                    var slot        = rows[slots[k][0]][slots[k][1]];
                    slot.token      = slots[k][2];
                    slot.hidden     = false;
                    slot.selected   = true;
                }
                //
                // If the puzzle has been disclosed then mark all the slots as
                // visible and show their token
                for (var k in puzzle)                                           {
                    var slot        = rows[puzzle[k][0]][puzzle[k][1]];
                    slot.token      = puzzle[k][2];
                    slot.hidden     = false;
                }
                //
            }
            _updateRows($scope.rows);
        }]
    };
}]);

angular.module('betaberry.darkhounds.net').directive('profile', [function()     {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/profile.html',
        controller:     ['$scope', 'serviceSession', function($scope, serviceSession) {
            $scope.isLogged     = serviceSession.isOpen();
            $scope.name         = "";
            $scope.credits      = serviceSession.isOpen();
            
            serviceSession.$on('changed', function()                            {
                $scope.isLogged = serviceSession.isOpen();
                $scope.name     = serviceSession.getName();
                $scope.credits  = serviceSession.getCredits();
                $scope.$apply();
            });
            
            $scope.login    = function()                                        {
                serviceSession.login($scope.username, $scope.password)
            };

            $scope.logout   = function()                                        {
                serviceSession.logout()
            };
            
        }]
    };
}]);

angular.module('betaberry.darkhounds.net').directive('slot', [function()     {
    return {
        scope:      {
            item: "="
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/slot.html',
        controller:     ['$scope', 'serviceGame', function($scope, serviceGame) {
            $scope.state    = "hidden";
            $scope.selected = false;
            
            $scope.play    = function()                                         {
                serviceGame.play([$scope.item.row, $scope.item.col])
            };
            
            $scope.$watch("item", function()                                    {
                $scope.state    = _switchState($scope.item);
                $scope.selected = $scope.item?$scope.item.selected:false;
            }, true);
            
            function _switchState (item)                                        {
                if (!item || item.hidden) return 'hidden';
                return item.token?item.token:'empty';
            }
        }]
    };
}]);

angular.module('betaberry.darkhounds.net').directive('viewport', [function()    {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/viewport.html',
        controller:     ['$scope', function($scope)                             {
            
        }]
    };
}]);
