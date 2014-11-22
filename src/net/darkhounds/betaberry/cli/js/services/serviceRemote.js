angular.module('betaberry.darkhounds.net').factory('serviceRemote', [
    function()                                                                  {
        var service         = {};
        
        function _createRequest()                                               {
            // return observable.create({response:{data: null, error: null}});
            return {response:{data: null, error: null}};
        }
        
        var _sessionMockup  = null;
        service.login       = function(email, password, callback)               {
            // TODO: Do the actual http request to the server API
            //
            var request            = _createRequest();
            if (_sessionMockup) request.response.error = {code:'sessionNotClosed', msg:'Session Not Closed!'};
            else                                                                {
                _sessionMockup          = 
                request.response.data   = {name: "Jhon", lastName:"Doe", credits:1000};
            }
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
            if (callback && typeof callback === "function") callback(request.response);
            //
            return request;
        };
        
        var _betMockup      = null;
        var _puzzleMockup   = null;
        service.bet         = function(amount, level, callback)                 {
            // TODO: Do an actual server API request

            var request            = _createRequest();
            if (!_sessionMockup) request.response.error = {code: "sessionClosed", msg: "Session Closed!"};
            else if (_betMockup) request.response.error = {code: "betOpened", msg: "Bet Already Opened!"};
            else if (_sessionMockup.credits < amount) request.response.error = {code: "betToHigh", msg: "Bet is To High"};
            else if (level < 1 || level > 4) request.response.error = {code: "betInvalidLevel", msg: "Bet has an invalid level"};
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

        var _playedCells    = [];
        service.play        = function(cell, callback)                          {
            // TODO: Do the actual http request to the server API
            //
            var request                 = _createRequest();
            if (!_sessionMockup)    request.response.error = {code: "sessionClosed", msg: "Session Closed!"};
            else if (!_betMockup)   request.response.error = {code: "betClosed", msg: "No Bet Opened!"};
            
            var token                   = _puzzleMockup[cell[0]][cell[1]];
            cell.push(token);
            _playedCells.push(cell);
            
            request.response.data       = {
                closed: (_playedCells.length >= _betMockup.level || token == "trap" || token == "berrie"),
                slots: _playedCells.slice()
            };
            
            if (request.response.data.closed)                                   {
                request.response.data.gain  = _endGame(_playedCells, _betMockup);
                _sessionMockup.credits      = _sessionMockup.credits + request.response.data.gain;
                if (_sessionMockup.credits < 0) _sessionMockup.credits = 0;
                request.response.data.credits = _sessionMockup.credits;
                //
                _betMockup          = null;
                _puzzleMockup       = null;
                _playedCells.length = 0;
            }
            
            if (callback && typeof callback === "function") callback(request.response);
            
            return request;
        };
        
//        function _getTokensFrom(cells)                                          {
//            var tokens  = [];
//            for (var id in cells) tokens.push(_puzzleMockup[cells[id][0]][cells[id][1]]);
//            return tokens;
//        }
        
        function _endGame(cells, bet)                                           {
            // var tokens      = _getTokensFrom(cells);
            
            var bee     = false;
            var trap    = false;
            var bonus   = 0;
            for (var i in cells) switch (cells[i][3])                           {
                case 'trap':    trap    = true; break;
                case 'bee':     bee     = true; break;
                case 'honney':  bonus   += 3; break;
                case 'berry':   bonus   += 1; break;
                default: break;
            }

            return ((trap?-3:(bee?-1:bonus)) * bet.amount) - bet.amount;
        }
        
        return service;
    }
]);
