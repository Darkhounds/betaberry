"use strict";angular.module("betaberry.darkhounds.net",["core.darkhounds.net"]),angular.module("betaberry.darkhounds.net").factory("serviceAPI",["observable","serviceRemote","serviceMessages",function(a,b,c){var d=a.create();return d.login=function(a,e,f){b.login(a,e,function(a){f&&"function"==typeof f&&f(a),a.error?c.add("error",a.error.msg):d.$broadcast("logedin",a.data)});return d},d.logout=function(a){b.logout(function(b){a&&"function"==typeof a&&a(b),b.error||d.$broadcast("logedout",b.data)});return d},d.bet=function(a,c,e){b.bet(a,c,function(a){e&&"function"==typeof e&&e(a),a.error||d.$broadcast("betted",a.data)});return d},d.play=function(a,c){b.play(a,function(a){c&&"function"==typeof c&&c(a),a.error||d.$broadcast("played",a.data)});return d},d}]),angular.module("betaberry.darkhounds.net").factory("serviceGame",["observable","serviceAPI",function(a,b){var c=a.create(),d=null;c.hasBetted=function(){return!!d},c.getBet=function(){return d},c.getBetAmount=function(){return d?d.amount:0},c.getBetLevel=function(){return d?d.level:1};var e=null;c.getSlots=function(){return e||[]};var f=!0;c.isClosed=function(){return f};var g=null;c.getPuzzle=function(){return g||[]};var h=0;return c.getGain=function(){return h||[]},b.$on("logedin",function(){d=null,f=!1,g=null,e=null,h=0,c.$broadcast("changed")}),b.$on("logedout",function(){d=null,f=!1,g=null,e=null,h=0,c.$broadcast("changed")}),b.$on("betted",function(a){d=a,f=!d,g=null,e=null,h=0,c.$broadcast("changed")}),b.$on("played",function(a){f=!d||a.closed,g=a.puzzle||[],e=a.slots||[],h=a.gain||0,c.$broadcast("changed")}),c.bet=function(a,d,e){return b.bet(a,d,e),c},c.play=function(a,d){return b.play(a,d),c},c}]),angular.module("betaberry.darkhounds.net").factory("serviceMessages",["observable",function(a){var b=a.create(),c=[];return b.add=function(a,d,e){var f={type:a,text:d,end:e,callback:function(){b.remove(f,arguments)}};c.push(f),this.$broadcast("changed",f)},b.getNext=function(){return c.length?c[0]:null},b.getCount=function(){return c.length},b.remove=function(a,b){var d=c.indexOf(a);0>d||("function"==typeof a.end&&a.end.apply(this,b),c.splice(d,1))},b}]),angular.module("betaberry.darkhounds.net").factory("serviceRemote",["serviceValidator",function(a){function b(){return{response:{data:null,error:null}}}function c(){p=null,q=null,r.length=0}function d(){var a=e(o,null,!0),b={honney:f(a,t),berries:f(a,u),traps:f(a,v),bees:f(a,w)},c=e(o,"");return h(c,b.honney,"honey"),h(c,b.berries,"berry"),h(c,b.traps,"trap"),h(c,b.bees,"bee"),c}function e(a,b,c){for(var d=[],e=0;a>e;e++){d[e]=[];for(var f=0;a>f;f++)d[e][f]=c?f:b}return d}function f(a,b){for(var c=[],d=0;b>d;d++)c.push(g(a));return c}function g(a){var b=Math.round(Math.random()*(a.length-1)),c=Math.round(Math.random()*(a[b].length-1)),d=[b,a[b].splice(c,1)[0]];return a[b].length||a.splice(b,1),d}function h(a,b,c){for(var d in b)a[b[d][0]][b[d][1]]=c}function i(a,b){for(var c in a)if(a[c][0]==b[0]&&a[c][1]==b[1])return!0;return!1}function j(a){var b=[];for(var c in a)for(var d in a[c])b.push([1*c,1*d,a[c][d]]);return b}function k(a,b){var c=!1,d=!1,e=0;for(var f in a)switch(a[f][2]){case"trap":d=!0;break;case"bee":c=!0;break;case"honey":e+=3;break;case"berry":e+=2}e||!d&&!c||(e=1);var g=(d?-3:c?-2:1)*e*b.amount*b.level-b.amount;return g}function l(a,b,c){var d=[];d.push(0>=a||0>=b?null:c[a-1][b-1]),d.push(0>=a?null:c[a-1][b]),d.push(0>=a||b>=o-1?null:c[a-1][b+1]),d.push(0>=b?null:c[a][b-1]),d.push(b>=o-1?null:c[a][b+1]),d.push(a>=o-1||0>=b?null:c[a+1][b-1]),d.push(a>=o-1?null:c[a+1][b]),d.push(a>=o-1||b>=o-1?null:c[a+1][b+1]);var e=0;for(var f in d)d[f]&&(e+=m(d[f]));return e}function m(a){switch(a){case"bee":return 1;case"trap":return 1;case"berry":return-1;case"honey":return-1;default:return 0}}var n={},o=5,p=null,q=null,r=[],s=null;n.login=function(d,e,f){var g=b();return a.checkEmail(d)?a.checkPassword(e)?s?g.response.error={code:"sessionNotClosed",msg:"Session Not Closed"}:(s={name:"Jhon",lastName:"Doe",credits:1e3},g.response.data={name:"Jhon",lastName:"Doe",credits:1e3}):g.response.error={code:"invallidPassword",msg:"Invalid Password"}:g.response.error={code:"invallidEmail",msg:"Invalid Email"},c(),f&&"function"==typeof f&&f(g.response),g},n.logout=function(a){var d=b();return s?(s=null,d.response.data={}):d.response.error={code:"sessionNotOpened",msg:"Session Not Opened"},c(),a&&"function"==typeof a&&a(d.response),d},n.bet=function(a,c,e){var f=b();return s?p?f.response.error={code:"betOpened",msg:"Bet Already opened"}:!a||isNaN(a)||1>a?f.response.error={code:"betInvalidAmount",msg:"Invalid bet amount"}:a>s.credits?f.response.error={code:"betToHigh",msg:"Bet is to high"}:!c||isNaN(c)||1>c||c>4?f.response.error={code:"betInvalidLevel",msg:"Bet has an invalid level"}:(q=d(),p=f.response.data={amount:a,level:c}):f.response.error={code:"sessionClosed",msg:"Session closed"},e&&"function"==typeof e&&e(f.response),f};var t=1,u=2,v=1,w=2;return n.play=function(a,d){var e=b();if(s?p?i(r,a)&&(e.response.error={code:"slotAlreadyPlayed",msg:"The played slot was already played"}):e.response.error={code:"betClosed",msg:"No Bet Opened"}:e.response.error={code:"sessionClosed",msg:"Session Closed"},!e.response.error){var f=q[a[0]][a[1]];if(a.push(f),a.push(l(a[0],a[1],q)),r.push(a),e.response.data={closed:r.length>=p.level||"trap"==f||"bee"==f,slots:r.slice()},e.response.data.closed){var g=k(r,p);s.credits=s.credits+g,s.credits<0&&(s.credits=0),e.response.data.gain=g,e.response.data.credits=s.credits,e.response.data.puzzle=j(q),c()}}return d&&"function"==typeof d&&d(e.response),e},n}]),angular.module("betaberry.darkhounds.net").factory("serviceSession",["observable","serviceAPI","serviceValidator","serviceMessages",function(a,b,c,d){var e=a.create(),f=null;return b.$on("logedin",function(a){f=a,e.$broadcast("changed")}),b.$on("logedout",function(){f=null,e.$broadcast("changed")}),b.$on("played",function(a){f.credits=a.credits,e.$broadcast("changed")}),e.login=function(a,f,g){return c.checkEmail(a)?c.checkPassword(f)?b.login(a,f,g):d.add("error","Invalid Password"):d.add("error","Invalid Email"),e},e.logout=function(a){return b.logout(a),e},e.isOpen=function(){return!!f},e.getName=function(){if(!f)return"";var a="";return f.name&&(a+=f.name),f.lastName&&(a+=(a?" ":"")+f.lastName),a},e.getCredits=function(){return f?f.credits:0},e}]),angular.module("betaberry.darkhounds.net").factory("serviceValidator",["observable",function(a){var b=a.create();return b.checkEmail=function(a){var b=/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;return b.test(a)},b.checkPassword=function(a){return a.length>6},b}]),angular.module("betaberry.darkhounds.net").directive("board",[function(){return{scope:{},transcode:!0,replace:!0,templateUrl:"html/templates/board.html",controller:["$scope","serviceSession","serviceGame",function(a,b,c){function d(a,b,c){for(var d=0;5>d;d++){a[d]||(a[d]=[]);for(var e=0;5>e;e++)a[d][e]?(a[d][e].hidden=!0,a[d][e].selected=!1,a[d][e].token=""):a[d][e]={row:d,col:e,hidden:!0,selected:!1,token:""}}for(var f in b){var g=a[b[f][0]][b[f][1]];g.token=b[f][2],g.danger=b[f][3],g.hidden=!1,g.selected=!0}for(var f in c){var g=a[c[f][0]][c[f][1]];g.token=c[f][2],g.hidden=!1}}a.amount=10,a.isLogged=b.isOpen(),a.hasBetted=c.hasBetted(),a.isOver=c.isClosed(),a.gain=c.getGain(),a.rows=[],b.$on("changed",function(){a.isLogged=b.isOpen(),a.hasBetted=!1,a.isOver=!1,a.gain=0,a.$apply()}),c.$on("changed",function(){a.hasBetted=c.hasBetted(),a.isOver=c.isClosed(),a.gain=c.getGain(),d(a.rows,c.getSlots(),c.getPuzzle()),a.$apply()}),a.bet=function(a,b){c.bet(a,b)},a.play=function(a,b){c.play([a,b])},d(a.rows)}]}}]),angular.module("betaberry.darkhounds.net").directive("popups",[function(){return{scope:{},transcode:!0,replace:!0,templateUrl:"html/templates/popups.html",controller:["$scope","serviceMessages",function(a,b){function c(){a.message=a.message||b.getNext()}a.message=null,b.$on("changed",function(){c(),a.$apply()}),a.close=function(){b.remove(a.message),a.message=null,c()}}]}}]),angular.module("betaberry.darkhounds.net").directive("profile",[function(){return{scope:{},transcode:!0,replace:!0,templateUrl:"html/templates/profile.html",controller:["$scope","serviceSession","serviceGame",function(a,b,c){a.isLogged=b.isOpen(),a.username="test@test.com",a.password="1234567",a.name="",a.name="",a.credits=b.getCredits(),b.$on("changed",function(){a.isLogged=b.isOpen(),a.name=b.getName(),a.credits=!c.hasBetted()||c.isClosed()?b.getCredits():a.credits,a.$apply()}),a.login=function(){b.login(a.username,a.password)},a.logout=function(){b.logout()}}]}}]),angular.module("betaberry.darkhounds.net").directive("slot",[function(){return{scope:{item:"="},transcode:!0,replace:!0,templateUrl:"html/templates/slot.html",controller:["$scope","serviceGame",function(a,b){function c(a){return!a||a.hidden?"hidden":a.token?a.token:"empty"}a.state="hidden",a.selected=!1,a.danger=0,a.play=function(){a.item.selected||b.play([a.item.row,a.item.col])},a.$watch("item",function(){a.state=c(a.item),a.selected=a.item?a.item.selected:!1,a.danger=a.item&&a.item.danger?Math.round(a.item.danger/8*100):0},!0)}]}}]),angular.module("betaberry.darkhounds.net").directive("viewport",[function(){return{scope:{},transcode:!0,replace:!0,templateUrl:"html/templates/viewport.html",controller:["$scope",function(){}]}}]);