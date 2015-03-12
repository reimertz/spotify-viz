/* jshint ignore:start */
"use strict";angular.module("spotifyViz",["ngAnimate","ngCookies","ngTouch","ngSanitize","ui.router","ngMaterial","controllers.logout","controllers.home","controllers.splash","controllers.compute","controllers.vizualize","spotify","qAllSettled"]).config(["$stateProvider","$urlRouterProvider","$mdThemingProvider","SpotifyProvider",function(e,t,l,a){a.setClientId("835d8a553e434b99b9f2314d3fe6d90d"),a.setRedirectUri("https://reimertz.github.io/spotify-viz/callback.html"),a.setScope("playlist-read-private user-follow-read user-library-read"),l.theme("default").primaryPalette("red").accentPalette("yellow"),e.state("splash",{url:"/",templateUrl:"partials/splash.html",controller:"SplashCtrl",authenticate:!1}).state("main",{url:"/main",templateUrl:"partials/main.html",controller:"MainCtrl",authenticate:!0}).state("computeHack",{url:"/compute",templateUrl:"partials/compute.html",controller:"ComputeCtrl",authenticate:!0}).state("compute",{url:"/compute",templateUrl:"partials/compute.html",controller:"ComputeCtrl",params:{user:void 0,challenger:void 0},authenticate:!0}).state("vizualizeHack",{url:"/vizualize",templateUrl:"partials/vizualize.html",controller:"VizualizeCtrl",authenticate:!0}).state("vizualize",{url:"/vizualize",templateUrl:"partials/vizualize.html",controller:"VizualizeCtrl",params:{user:void 0,challenger:void 0,globalAverages:void 0},authenticate:!0}).state("logout",{url:"/logout",templateUrl:"partials/splash.html",controller:"LogoutCtrl",authenticate:!0}),t.otherwise("/")}]).run(["$state","$rootScope",function(e,t){t.$on("$stateChangeStart",function(t,l){!l.authenticate&&localStorage.userId?(t.preventDefault(),e.go("main")):l.authenticate&&!localStorage.userId&&(t.preventDefault(),e.go("splash"))}),function(){if(!document.getElementById("facebook-jssdk")){var e=document.getElementsByTagName("script")[0],t=document.createElement("script");t.id="facebook-jssdk",t.src="//connect.facebook.net/en_US/all.js",e.parentNode.insertBefore(t,e)}}()}]),angular.module("qAllSettled",[]).config(["$provide",function(e){e.decorator("$q",["$delegate",function(e){var t=e;return t.allSettled=function(e){return t.all(e.map(function(e){return e.then(function(e){return{state:"fulfilled",value:e}},function(e){return{state:"rejected",reason:e}})}))},t}])}]),angular.module("controllers.home",[]).controller("MainCtrl",["$scope","$state","$q","$timeout","Spotify",function(e,t,l,a,s){function r(){s.setAuthToken(localStorage["spotify-token"]),s.getCurrentUser().then(function(t){console.log(t),e.user=t},function(){t.go("logout")})}e.invalidUser=!1,e.user={},e.challenger={},r(),e.checkUserId=function(l){s.getUser(l).then(function(a){e.challenger=a,s.userFollowingContains("user",l).then(function(l){e.challenger.IsFollowingUser=l,t.go("compute",{user:e.user,challenger:e.challenger})})},function(){e.invalidUser=!0})},e.logout=function(){t.go("logout")}}]),angular.module("controllers.logout",[]).controller("LogoutCtrl",["$state",function(e){localStorage.removeItem("userId"),localStorage.removeItem("spotify-token"),e.go("splash")}]),angular.module("controllers.splash",[]).controller("SplashCtrl",["$scope","$state","$interval","Spotify",function(e,t,l,a){function s(){e.currentCategory+=1}e.currentCategory=0,l(s,2500),e.login=function(){a.login().then(function(){a.getCurrentUser().then(function(e){localStorage.userId=e.id,t.go("main")})})}}]),angular.module("controllers.compute",[]).controller("ComputeCtrl",["$scope","$state","$stateParams","$q","$http","$timeout","Spotify","$mdDialog",function(e,t,l,a,s,r,o,n){function i(e){var t=a.defer(),l=0;return e.forEach(function(a,s){a.tracks.items.map(function(e){l+=e.track.popularity}),e.length-1===s&&t.resolve(l)}),t.promise}function c(e){var t=[];return t.push(d(0).then(function(){return o.getUserPlaylists(e,{offset:0})})),t.push(d(200).then(function(){return o.getUserPlaylists(e,{offset:25})})),t.push(d(400).then(function(){return o.getUserPlaylists(e,{offset:50})})),t.push(d(600).then(function(){return o.getUserPlaylists(e,{offset:75})})),t.push(d(800).then(function(){return o.getUserPlaylists(e,{offset:100})})),t.push(d(1e3).then(function(){return o.getUserPlaylists(e,{offset:100})})),t.push(d(1200).then(function(){return o.getUserPlaylists(e,{offset:125})})),t.push(d(1400).then(function(){return o.getUserPlaylists(e,{offset:150})})),t.push(d(1800).then(function(){return o.getUserPlaylists(e,{offset:175})})),t.push(d(2e3).then(function(){return o.getUserPlaylists(e,{offset:200})})),a.allSettled(t).then(function(e){var t=[];return e.forEach(function(e){"fulfilled"===e.state&&(t=t.concat(e.value.items))}),t})}function u(e,t){var l=[],s=0,r=0,n=0,i=0,c=0,u=0,h=0;return t.forEach(function(t,a){t.owner.id===e?(s+=t.tracks.total,r+=t.collaborative?1:0,n+=t["public"]?1:0,l.push(d(100*a).then(function(){return o.getPlaylist(e,t.id)}))):(u+=1,h+=t.tracks.total)}),a.allSettled(l).then(function(t){var l=[];return t.forEach(function(t){console.log(t),"fulfilled"===t.state&&(console.log(t.value.followers.total),l.push(t.value),t.value.owner.id===e?i+=t.value.followers.total:c+=t.value.followers.total)}),{playlists:l,totalSongs:s,totalCollaboratives:r,totalPublics:n,totalPlaylistFollowers:i,totalOtherPlaylistFollowers:c,totalOtherPlaylists:u,totalOtherSongs:h}})}function d(e){var t=a.defer();return r(t.resolve,e),t.promise}return l.user&&l.challenger?(e.user=l.user,e.challenger=l.challenger,e.user.playlists=[],e.challenger.playlists=[],e.status="Fetching Playlists..",e.showAlert=function(e){var l="user"===e?"It seems that you don't have any public playlists.. So you lost before it has even begun!":"It seems that your friend doesn't have any public playlists.. Try with someone else!",a=n.confirm({clickOutsideToClose:!1}).title("We couldn't find any playlists!").content(l).ariaLabel("Lucky day").ok("Got it!");n.show(a).then(function(){return t.go("main")})},a.all([c(e.user.id),c(e.challenger.id)]).then(function(l){var o=[];return e.user.playlists=l[0],e.challenger.playlists=l[1],0===e.user.playlists.length?e.showAlert("user"):0===e.challenger.playlists.length?e.showAlert("challenger"):(e.status="Analyzing Playlist data...",o.push(u(e.user.id,e.user.playlists)),o.push(u(e.challenger.id,e.challenger.playlists)),void a.all(o).then(function(l){e.status="Analyzing popularity data..",angular.extend(e.user,e.user,l[0]),angular.extend(e.challenger,e.challenger,l[1]),a.all([i(e.user.playlists),i(e.challenger.playlists)]).then(function(l){e.status="Getting international average data...",e.user.popularity=parseInt((l[0]/e.user.totalSongs).toFixed(2)),e.challenger.popularity=parseInt((l[1]/e.challenger.totalSongs).toFixed(2)),delete e.user.playlists,delete e.challenger.playlists,r(function(){s.post("https://spotify-viz-server-reimertz.c9.io/average",{user:e.user,challenger:e.challenger}).success(function(l){e.status="Finalizing data...",r(function(){t.go("vizualize",{user:e.user,challenger:e.challenger,globalAverages:l})},1e3)}).error(function(e,t){console.log(t)})},1e3)})}))}),void(e.cancel=function(){t.go("main")})):t.go("main")}]),angular.module("controllers.vizualize",[]).controller("VizualizeCtrl",["$scope","$state","$stateParams","$q","$timeout","Spotify",function(e,t,l){function a(){e.user.image=e.user.images[0]?e.user.images[0].url.replace("https://","//"):"images/category_avatar1.png",e.challenger.image=e.challenger.images[0]?e.challenger.images[0].url.replace("https://","//"):"images/category_avatar2.png"}function s(){e.user.popularity=parseInt(e.user.popularity),e.challenger.popularity=parseInt(e.challenger.popularity),e.hipsterClass=e.user.popularity<e.challenger.popularity?"user":"challenger",e.wonHipster=e[e.hipsterClass],e.wonHipsterName=e.wonHipster.name,e.lostHipster=e.wonHipster===e.user?e.challenger:e.user,e.lostHipsterName=e.lostHipster.name,e.wonHipster.wins+=1,e.userHipsterPercentage=e.user.popularity/(e.user.popularity+e.challenger.popularity)*100,e.challengerHipsterPercentage=e.challenger.popularity/(e.user.popularity+e.challenger.popularity)*100,e.userHipsterPercentage=g(e.userHipsterPercentage),e.challengerHipsterPercentage=g(e.challengerHipsterPercentage)}function r(){e.superstarClass=e.user.followers.total>e.challenger.followers.total?"user":"challenger",e.wonSuperstar=e[e.superstarClass],e.wonSuperstarName=e.wonSuperstar.name,e.lostSuperstar=e.wonSuperstar===e.user?e.challenger:e.user,e.lostSuperstarName=e.lostSuperstar.name,e.wonSuperstar.wins+=1,e.userSuperstarPercentage=e.user.followers.total/(e.user.followers.total+e.challenger.followers.total)*100,e.challengerSuperstarPercentage=e.challenger.followers.total/(e.user.followers.total+e.challenger.followers.total)*100,e.userSuperstarPercentage=e.user.followers.total/(e.user.followers.total+e.challenger.followers.total)*100,e.challengerSuperstarPercentage=e.challenger.followers.total/(e.user.followers.total+e.challenger.followers.total)*100,e.userSuperstarPercentage=g(e.userSuperstarPercentage),e.challengerSuperstarPercentage=g(e.challengerSuperstarPercentage)}function o(){e.giverClass=e.user.totalPublics>e.challenger.totalPublics?"user":"challenger",e.wonGiver=e[e.giverClass],e.wonGiverName=e.wonGiver.name,e.lostGiver=e.wonGiver===e.user?e.challenger:e.user,e.lostGiverName=e.lostGiver.name,e.wonGiver.wins+=1,e.userGiverPercentage=e.user.totalPublics/(e.user.totalPublics+e.challenger.totalPublics)*100,e.challengerGiverPercentage=e.challenger.totalPublics/(e.user.totalPublics+e.challenger.totalPublics)*100,e.userGiverPercentage=g(e.userGiverPercentage),e.challengerGiverPercentage=g(e.challengerGiverPercentage)}function n(){e.hoarderClass=e.user.totalSongs>e.challenger.totalSongs?"user":"challenger",e.wonHoarder=e[e.hoarderClass],e.wonHoarderName=e.wonHoarder.name,e.lostHoarder=e.wonHoarder===e.user?e.challenger:e.user,e.lostHoarderName=e.lostHoarder.name,e.wonHoarder.wins+=1,e.userHoarderPercentage=e.user.totalSongs/(e.user.totalSongs+e.challenger.totalSongs)*100,e.challengerHoarderPercentage=e.challenger.totalSongs/(e.user.totalSongs+e.challenger.totalSongs)*100,e.userHoarderPercentage=g(e.userHoarderPercentage),e.challengerHoarderPercentage=g(e.challengerHoarderPercentage)}function i(){e.trendsetterClass=e.user.totalPlaylistFollowers>e.challenger.totalPlaylistFollowers?"user":"challenger",e.wonTrendsetter=e[e.trendsetterClass],e.wonTrendsetterName=e.wonTrendsetter.name,e.lostTrendsetter=e.wonTrendsetter===e.user?e.challenger:e.user,e.lostTrendsetterName=e.lostTrendsetter.name,e.wonTrendsetter.wins+=1,e.userTrendsetterPercentage=e.user.totalPlaylistFollowers/(e.user.totalPlaylistFollowers+e.challenger.totalPlaylistFollowers)*100,e.challengerTrendsetterPercentage=e.challenger.totalPlaylistFollowers/(e.user.totalPlaylistFollowers+e.challenger.totalPlaylistFollowers)*100,e.userTrendsetterPercentage=g(e.userTrendsetterPercentage),e.challengerTrendsetterPercentage=g(e.challengerTrendsetterPercentage)}function c(){e.copycatClass=e.user.totalOtherPlaylistFollowers<e.challenger.totalOtherPlaylistFollowers?"user":"challenger",e.wonCopycat=e[e.copycatClass],e.wonCopycatName=e.wonCopycat.name,e.lostCopycat=e.wonCopycat===e.user?e.challenger:e.user,e.lostCopycatName=e.lostCopycat.name,e.wonCopycat.wins+=1,e.userCopycatPercentage=e.user.totalOtherPlaylists/(e.user.totalOtherPlaylists+e.challenger.totalOtherPlaylists)*100,e.challengerCopycatPercentage=e.challenger.totalOtherPlaylists/(e.user.totalOtherPlaylists+e.challenger.totalOtherPlaylists)*100,e.userCopycatPercentage=g(e.userCopycatPercentage),e.challengerCopycatPercentage=g(e.challengerCopycatPercentage)}function u(){e.summaryClass=e.user.wins>e.challenger.wins?"user":"challenger",e.wonSummary=e[e.summaryClass]}function d(){var t=[];t.push("You"),t.push(100*Math.max(e.user.popularity/e.globalAverages.totalPopularityAverage||1,0).toFixed(2)),t.push(100*Math.max(e.user.followers.total/e.globalAverages.totalFollowers||1,0).toFixed(2)),t.push(100*Math.max(e.user.totalPublics/e.globalAverages.totalPublicsAverage||1,0).toFixed(2)),t.push(100*Math.max(e.user.totalSongs/e.globalAverages.totalSongsAverage||1,0).toFixed(2)),t.push(100*Math.max(e.user.totalOtherPlaylistFollowers/e.globalAverages.totalOtherPlaylistFollowersAverage||1,0).toFixed(2)),t.push(100*Math.max(e.user.totalOtherPlaylists/e.globalAverages.totalOtherPlaylistsAverage||1,0).toFixed(2));c3.generate({data:{labels:{format:function(e){return e+" %"}},columns:[t]},grid:{y:{lines:[{value:100,text:"Global Average","class":"baseline"}]}},tooltip:{show:!1},axis:{x:{type:"category",categories:["The Hipster","The Superstar","The Giver","The Hoarder","The Trendsetter","The Copycat"]}},legend:{hide:!0}})}function g(e){return e%5>=2.5?e-e%5+5:e-e%5}if(!l.user||!l.challenger||!l.globalAverages)return t.go("main");e.user=l.user,e.challenger=l.challenger,e.globalAverages=l.globalAverages,e.user.wins=0,e.challenger.wins=0,e.user.name=e.user.display_name||e.user.id,e.challenger.name=e.challenger.display_name||e.challenger.id,console.log(e.user),console.log(e.challenger),console.log(e.globalAverages),e.hide=!1,a(),s(),r(),o(),n(),i(),c(),u(),d(),e.again=function(){t.go("main")};var v,m,y,f,p,x,P,b,S,C,H,T;y=200,v=[[85,71,106],[174,61,99],[219,56,83],[244,92,68],[248,182,70]],f=2*Math.PI,p=document.getElementById("world"),P=p.getContext("2d"),window.w=0,window.h=0,H=function(){window.w=p.width=window.innerWidth},window.addEventListener("resize",H,!1),window.onload=function(){return setTimeout(H,0)},C=function(e,t){return(t-e)*Math.random()+e},b=function(e,t,l,a){return P.beginPath(),P.arc(e,t,l,0,f,!1),P.fillStyle=a,P.fill()},T=.5,window.requestAnimationFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){return window.setTimeout(e,1e3/60)}}(),m=function(){function e(){this.style=v[~~C(0,5)],this.rgb="rgba("+this.style[0]+","+this.style[1]+","+this.style[2],this.r=~~C(2,6),this.r2=2*this.r,this.replace()}return e.prototype.replace=function(){this.opacity=0,this.dop=.03*C(1,4),this.x=C(-this.r2,w-this.r2),this.y=C(-20,h-this.r2),this.xmax=w-this.r,this.ymax=h-this.r,this.vx=C(0,2)+8*T-5,this.vy=.7*this.r+C(-1,1)},e.prototype.draw=function(){var e;this.x+=this.vx,this.y+=this.vy,this.opacity+=this.dop,this.opacity>1&&(this.opacity=1,this.dop*=-1),(this.opacity<0||this.y>this.ymax)&&this.replace(),0<(e=this.x)&&e<this.xmax||(this.x=(this.x+this.xmax)%this.xmax),b(~~this.x,~~this.y,this.r,""+this.rgb+","+this.opacity+")")},e}(),x=function(){var e,t;for(t=[],S=e=1;y>=1?y>=e:e>=y;S=y>=1?++e:--e)t.push(new m);return t}(),window.step=function(){var e,t,l,a;for(requestAnimationFrame(step),P.clearRect(0,0,w,h),a=[],t=0,l=x.length;l>t;t++)e=x[t],a.push(e.draw());return a},step(),H(),$("body").panelSnap({panelSelector:".section",slideSpeed:200,keyboardNavigation:{enabled:!0,wrapAround:!1}})}]),function(e){try{e=angular.module("spotifyViz")}catch(t){e=angular.module("spotifyViz",[])}e.run(["$templateCache",function(e){e.put("partials/compute.html",'<div layout="column" class="compute-view"><div layout="column" class="swosh" layout-align="center center" flex="80"><h1>Calculating all the magic..</h1><md-progress-circular class="md-hue-8" md-mode="indeterminate"></md-progress-circular><h3>{{status}}</h3></div><div layout="column" layout-align="end center" flex="10"><md-button class="md-raised md-primary" ng-click="cancel()">Cancel</md-button></div></div>')}])}(),function(e){try{e=angular.module("spotifyViz")}catch(t){e=angular.module("spotifyViz",[])}e.run(["$templateCache",function(e){e.put("partials/logout.html",'<div layout="column" class="splash-view"><md-toolbar layout="row"><h1>Spotify Working Title App</h1></md-toolbar></div>')}])}(),function(e){try{e=angular.module("spotifyViz")}catch(t){e=angular.module("spotifyViz",[])}e.run(["$templateCache",function(e){e.put("partials/main-old.html",'<div layout="column" class="menu-view"><md-toolbar layout="row"><button ng-click="toggleSidenav(\'left\')" hide-gt-sm="" class="menuBtn"><span class="visuallyhidden">Menu</span></button><h1>AngularJS Material App</h1></md-toolbar><div layout="row" flex=""><md-sidenav class="md-sidenav-left md-whiteframe-z2" md-component-id="left" md-is-locked-open="$media(\'gt-sm\')"><md-list><md-item ng-repeat="it in avatars"><md-item-content><md-button ng-click="selectAvatar(it)" ng-class="{\'selected\' : it === selected }"><span class="{{it.classname}} avatar"></span> {{it.name}}</md-button></md-item-content></md-item></md-list></md-sidenav><md-content layout="column" flex="" class="content-wrapper md-padding" id="content"><span class="{{selected.classname}}" ng-class="{avatar:selected}" role="img" aria-label="{{selected.name}}"></span><h2>{{selected.name}}</h2><p>{{selected.content}}</p><md-button class="action actionBtn" ng-click="showActions($event)"><span class="visuallyhidden">Actions</span></md-button></md-content></div></div>')}])}(),function(e){try{e=angular.module("spotifyViz")}catch(t){e=angular.module("spotifyViz",[])}e.run(["$templateCache",function(e){e.put("partials/main.html",'<div layout="column" class="main-view"><div layout="column" class="swosh" layout-align="center center" flex="50"><h2>Enter the Spotify Id of your person you want to challenge</h2><form name="userIdForm"><div layout"column"=""><md-input-container class="md-accent" md-is-error="invalidUser" ng-click="userId=\'\'; invalidUser=false;"><label>User Id</label> <input ng-model="userId"><div ng-messages="userForm.bio.$error" ng-show="invalidUser"><div ng-message="invalidUser">User Id is non existing</div></div></md-input-container></div></form><md-button class="md-raised md-primary" ng-click="checkUserId(userId)">Let\'s do it!</md-button></div><div layout="column" layout-align="end center" flex="50"><md-button class="md-raised md-primary" ng-click="logout()">logout</md-button></div></div>')}])}(),function(e){try{e=angular.module("spotifyViz")}catch(t){e=angular.module("spotifyViz",[])}e.run(["$templateCache",function(e){e.put("partials/splash.html",'<section class="image section" layout="column" flex="100" ng-switch="" on="currentCategory%5"><div layout="column" flex="5"></div><div class="swosh" layout="column" layout-align="center center" flex="40" ng-switch-when="0"><img class="image-swosh" ng-src="images/category_hipster.png"><h1>Who is The Hipster?</h1></div><div class="swosh" layout="column" layout-align="center center" flex="40" ng-switch-when="1"><img class="image-swosh" ng-src="images/category_superstar.png"><h1>Who is The Superstar?</h1></div><div class="swosh" layout="column" layout-align="center center" flex="40" ng-switch-when="2"><img class="image-swosh" ng-src="images/category_giver.png"><h1>Who is The Giver?</h1></div><div class="swosh" layout="column" layout-align="center center" flex="40" ng-switch-when="4"><img class="image-swosh" ng-src="images/category_hoarder.png"><h1>Who is The Hoarder?</h1></div><div class="swosh" layout="column" layout-align="center center" flex="40" ng-switch-when="5"><img class="image-swosh" ng-src="images/category_trendsetter.png"><h1>Who is The Trendsetter?</h1></div><div class="swosh" layout="column" layout-align="center center" flex="40" ng-switch-when="6"><img class="image-swosh" ng-src="images/category_copycat.png"><h1>Who is The Copy Cat?</h1></div><div layout="column" flex="50" layout-align="start center"><h1>Login with your Spotify profile to find out!</h1><md-button class="md-raised md-primary" ng-click="login()">Login to Spotify</md-button></div></section>')}])}(),function(e){try{e=angular.module("spotifyViz")}catch(t){e=angular.module("spotifyViz",[])}e.run(["$templateCache",function(e){e.put("partials/vizualize.html",'<section class="ready section" layout="column" flex="100"><div class="image" layout="column" layout-align="center center" flex="40"><h1>Are you Ready?</h1></div><div layout="row" layout-align="center center" flex="30"><div flex="40"><img class="swosh" ng-src="{{user.image}}"></div><div flex="20"><h1>VS.</h1></div><div flex="40"><img class="swosh" ng-src="{{challenger.image}}"></div></div><div layout="row" layout-align="center center" flex="20"><div flex="40"><h1>{{user.display_name || user.id}}</h1></div><div flex="20"></div><div flex="40"><h1>{{challenger.display_name || challenger.id}}</h1></div></div><div layout="column" flex="10" layout-align="start center"><div flex="" class="jump"><h2>scroll to start</h2></div></div></section><section class="hipster section" layout="column" flex="100"><div layout="column" flex="5"></div><div layout="column" class="swosh" layout-align="center center" flex="25"><img class="image-swosh" ng-src="images/category_hipster.png"></div><div layout="column" class="swosh" layout-align="start center" flex="10"><h1 ng-if="wonHipsterName">{{wonHipsterName}} is The Hipster</h1><h1 ng-if="!wonHipsterName">"It\'s a draw!"</h1></div><div layout="row" class="swosh" layout-align="start center" flex="10"><div flex="15"></div><div flex="70"><h3>Mainstream? Naahh! Obviously you have your very own taste in music, instead of listening to the regular popular songs.</h3></div><div flex="15"></div></div><div layout="column" flex="15"></div><div layout="row" class="{{hipsterClass}}-won" flex="15"><div layout="row" flex="50" class="user"><div flex="{{challengerHipsterPercentage}}" class="rest"></div><div flex="{{userHipsterPercentage}}" class="left-bar"><h1>{{user.popularity}}</h1></div></div><div layout="row" flex="50" class="challenger"><div flex="{{challengerHipsterPercentage}}" class="right-bar"><h1>{{challenger.popularity}}</h1></div><div flex="{{userHipsterPercentage}}" class="rest"></div></div></div><div layout="column" class="swosh" layout-align="start center" flex="20"><h4>{{wonHipsterName}} had the average of {{wonHipster.popularity}} and beat {{lostHipsterName}} who had an average of {{lostHipster.popularity}}.</h4></div></section><section class="superstar section" layout="column" flex="100"><div layout="column" flex="5"></div><div layout="column" class="swosh" layout-align="center center" flex="25"><img class="image-swosh" ng-src="images/category_superstar.png"></div><div layout="column" class="swosh" layout-align="start center" flex="10"><h1 ng-if="wonSuperstarName">{{wonSuperstarName}} is The Superstar</h1><h1 ng-if="!wonSuperstarName">"It\'s a draw!"</h1></div><div layout="row" class="swosh" layout-align="start center" flex="10"><div flex="15"></div><div flex="70"><h3>Wow, look at you, and how many followers you have. You must be a superstar!</h3></div><div flex="15"></div></div><div layout="column" flex="15"></div><div layout="row" class="superstar {{superstarClass}}-won" flex="15"><div layout="row" flex="50" class="user"><div flex="{{challengerSuperstarPercentage}}" class="rest"></div><div flex="{{userSuperstarPercentage}}" class="left-bar"><h1>{{user.followers.total}}</h1></div></div><div layout="row" flex="50" class="challenger"><div flex="{{challengerSuperstarPercentage}}" class="right-bar"><h1>{{challenger.followers.total}}</h1></div><div flex="{{userSuperstarPercentage}}" class="rest"></div></div></div><div layout="column" class="swosh" layout-align="start center" flex="20"><h4>{{wonSuperstarName}} had {{wonSuperstar.followers.total - lostSuperstar.followers.total}} more followers than {{lostSuperstarName}}</h4></div></section><section class="giver section" layout="column" flex="100"><div layout="column" flex="5"></div><div layout="column" class="swosh" layout-align="center center" flex="25"><img class="image-swosh" ng-src="images/category_giver.png"></div><div layout="column" class="swosh" layout-align="start center" flex="10"><h1 ng-if="wonGiverName">{{wonGiverName}} is The Giver</h1><h1 ng-if="!wonGiverName">"It\'s a draw!"</h1></div><div layout="row" class="swosh" layout-align="start center" flex="10"><div flex="15"></div><div flex="70"><h3>\'Sharing is caring\' is your motto. We love listening to your many public playlists, thanks for that!</h3></div><div flex="15"></div></div><div layout="column" flex="15"></div><div layout="row" class="giver {{giverClass}}-won" flex="15"><div layout="row" flex="50" class="user"><div flex="{{challengerGiverPercentage}}" class="rest"></div><div flex="{{userGiverPercentage}}" class="left-bar"><h1>{{user.totalPublics}}</h1></div></div><div layout="row" flex="50" class="challenger"><div flex="{{challengerGiverPercentage}}" class="right-bar"><h1>{{challenger.totalPublics}}</h1></div><div flex="{{userGiverPercentage}}" class="rest"></div></div></div><div layout="column" class="swosh" layout-align="start center" flex="20"><h4>{{wonGiverName}} have {{wonGiver.totalPublics - lostGiver.totalPublics}} more public playlists than {{lostGiverName}} and could be considered a generous person!</h4></div></section><section class="hoarder section" layout="column" flex="100"><div layout="column" flex="5"></div><div layout="column" class="swosh" layout-align="center center" flex="25"><img class="image-swosh" ng-src="images/category_hoarder.png"></div><div layout="column" class="swosh" layout-align="start center" flex="10"><h1 ng-if="wonHoarderName">{{wonHoarderName}} is The Hoarder</h1><h1 ng-if="!wonHoarderName">"It\'s a draw!"</h1></div><div layout="row" class="swosh" layout-align="start center" flex="10"><div flex="15"></div><div flex="70"><h3>You have amassed the most songs in your library! But be honest, do you really listen to all of them?</h3></div><div flex="15"></div></div><div layout="column" flex="15"></div><div layout="row" class="hoarder {{hoarderClass}}-won" flex="15"><div layout="row" flex="50" class="user"><div flex="{{challengerHoarderPercentage}}" class="rest"></div><div flex="{{userHoarderPercentage}}" class="left-bar"><h1>{{user.totalSongs}}</h1></div></div><div layout="row" flex="50" class="challenger"><div flex="{{challengerHoarderPercentage}}" class="right-bar"><h1>{{challenger.totalSongs}}</h1></div><div flex="{{userHoarderPercentage}}" class="rest"></div></div></div><div layout="column" class="swosh" layout-align="start center" flex="20"><h4>{{wonHoarderName}} have collected {{wonHoarder.totalSongs}} songs over the years..</h4></div></section><section class="trendsetter section" layout="column" flex="100"><div layout="column" flex="5"></div><div layout="column" class="swosh" layout-align="center center" flex="25"><img class="image-swosh" ng-src="images/category_trendsetter.png"></div><div layout="column" class="swosh" layout-align="start center" flex="10"><h1 ng-if="wonTrendsetterName">{{wonTrendsetterName}} is The Trendsetter</h1><h1 ng-if="!wonTrendsetterName">"It\'s a draw!"</h1></div><div layout="row" class="swosh" layout-align="start center" flex="10"><div flex="15"></div><div flex="70"><h3>Trend - trendier - you! You clearly know what\'s in, and your many playlist followers think so, too!</h3></div><div flex="15"></div></div><div layout="column" flex="15"></div><div layout="row" class="trendsetter {{trendsetterClass}}-won" flex="15"><div layout="row" flex="50" class="user"><div flex="{{challengerTrendsetterPercentage}}" class="rest"></div><div flex="{{userTrendsetterPercentage}}" class="left-bar"><h1>{{user.totalPlaylistFollowers}}</h1></div></div><div layout="row" flex="50" class="challenger"><div flex="{{challengerTrendsetterPercentage}}" class="right-bar"><h1>{{challenger.totalPlaylistFollowers}}</h1></div><div flex="{{userTrendsetterPercentage}}" class="rest"></div></div></div><div layout="column" class="swosh" layout-align="start center" flex="20"><h4>{{wonTrendsetterName}} has a total of {{wonTrendsetter.totalPlaylistFollowers}} followers in his/her playlists. Wow!</h4></div></section><section class="copycat section" layout="column" flex="100"><div layout="column" flex="5"></div><div layout="column" class="swosh" layout-align="center center" flex="25"><img class="image-swosh" ng-src="images/category_copycat.png"></div><div layout="column" class="swosh" layout-align="start center" flex="10"><h1 ng-if="wonCopycatName">{{wonCopycatName}} is The Copycat</h1><h1 ng-if="!wonCopycatName">"It\'s a draw!"</h1></div><div layout="row" class="swosh" layout-align="start center" flex="10"><div flex="15"></div><div flex="70"><h3>Either you doubt your own taste, or you are lazy…anyway, you freeload others\' playlists most, have a cookie!</h3></div><div flex="15"></div></div><div layout="column" flex="15"></div><div layout="row" class="copycat {{copycatClass}}-won" flex="15"><div layout="row" flex="50" class="user"><div flex="{{challengerCopycatPercentage}}" class="rest"></div><div flex="{{userCopycatPercentage}}" class="left-bar"><h1>{{user.totalOtherPlaylists}}</h1></div></div><div layout="row" flex="50" class="challenger"><div flex="{{challengerCopycatPercentage}}" class="right-bar"><h1>{{challenger.totalOtherPlaylists}}</h1></div><div flex="{{userCopycatPercentage}}" class="rest"></div></div></div><div layout="column" class="swosh" layout-align="start center" flex="20"><h4>{{wonCopycatName}} are following {{wonCopycat.totalOtherPlaylists}} playlists with a total of {{wonCopycat.totalOtherSongs}} songs. What a Copycat!</h4></div></section><section class="summary section" layout="column" flex="100"><canvas id="world"></canvas><div layout="column" flex="5"></div><div layout="column" class="swosh" layout-align="center center" flex="25"><img class="image-swosh" ng-src="{{wonSummary.image || challenger.image}}"></div><div layout="column" class="swosh" layout-align="start center" flex="10"><h1 ng-if="wonSummary">{{wonSummary.name}} is the Winner!</h1><h1 ng-if="!wonSummary">"It\'s a draw!"</h1></div><div layout="row" class="hipster small {{hipsterClass}}-won" flex="5"><div layout="row" flex="25"></div><div layout="row" flex="25" class="user"><div flex="{{challengerHipsterPercentage}}" class="rest"></div><div flex="{{userHipsterPercentage}}" class="left-bar"></div></div><div layout="row" flex="25" class="challenger"><div flex="{{challengerHipsterPercentage}}" class="won"></div><div flex="{{userHipsterPercentage}}" class="rest"></div></div><div layout="row" flex="25"></div></div><div layout="row" class="superstar small {{superstarClass}}-won" flex="5"><div layout="row" flex="25"></div><div layout="row" flex="25" class="user"><div flex="{{challengerSuperstarPercentage}}" class="rest"></div><div flex="{{userSuperstarPercentage}}" class="left-bar"></div></div><div layout="row" flex="25" class="challenger"><div flex="{{challengerSuperstarPercentage}}" class="right-bar"></div><div flex="{{userSuperstarPercentage}}" class="rest"></div></div><div layout="row" flex="25"></div></div><div layout="row" class="giver small {{giverClass}}-won" flex="5"><div layout="row" flex="25"></div><div layout="row" flex="25" class="user"><div flex="{{challengerGiverPercentage}}" class="rest"></div><div flex="{{userGiverPercentage}}" class="left-bar"></div></div><div layout="row" flex="25" class="challenger"><div flex="{{challengerGiverPercentage}}" class="right-bar"></div><div flex="{{userGiverPercentage}}" class="rest"></div></div><div layout="row" flex="25"></div></div><div layout="row" class="hoarder small {{hoarderClass}}-won" flex="5"><div layout="row" flex="25"></div><div layout="row" flex="25" class="user"><div flex="{{challengerHoarderPercentage}}" class="rest"></div><div flex="{{userHoarderPercentage}}" class="left-bar"></div></div><div layout="row" flex="25" class="challenger"><div flex="{{challengerHoarderPercentage}}" class="right-bar"></div><div flex="{{userHoarderPercentage}}" class="rest"></div></div><div layout="row" flex="25"></div></div><div layout="row" class="trendsetter small {{trendsetterClass}}-won" flex="5"><div layout="row" flex="25"></div><div layout="row" flex="25" class="user"><div flex="{{challengerTrendsetterPercentage}}" class="rest"></div><div flex="{{userTrendsetterPercentage}}" class="left-bar"></div></div><div layout="row" flex="25" class="challenger"><div flex="{{challengerTrendsetterPercentage}}" class="right-bar"></div><div flex="{{userTrendsetterPercentage}}" class="rest"></div></div><div layout="row" flex="25"></div></div><div layout="row" class="copycat small {{copycatClass}}-won" flex="5"><div layout="row" flex="25"></div><div layout="row" flex="25" class="user"><div flex="{{challengerCopycatPercentage}}" class="rest"></div><div flex="{{userCopycatPercentage}}" class="left-bar"></div></div><div layout="row" flex="25" class="challenger"><div flex="{{challengerCopycatPercentage}}" class="right-bar"></div><div flex="{{userCopycatPercentage}}" class="rest"></div></div><div layout="row" flex="25"></div></div><div layout="row" class="{{summaryClass}}-won" flex="5"><div layout="row" flex="25" class="user"><div flex="{{challengerSummaryPercentage}}" class="rest"></div><div flex="{{userSummaryPercentage}}" class="won"></div></div><div layout="row" flex="25" class="challenger"><div flex="{{challengerSummaryPercentage}}" class="won"></div><div flex="{{userSummaryPercentage}}" class="rest"></div></div></div><div layout="column" class="swosh" layout-align="start center" flex="20"><h4>{{wonSummary.name}} won in {{wonSummary.wins}} categories and is therefore the allmighty winner!</h4></div></section><section class="average section star" layout="column" flex="100"><canvas id="world"></canvas><div layout="column" flex="5"></div><div layout="column" class="swosh" layout-align="center center" flex="25"><img class="image-swosh" ng-src="images/category_earth.png"></div><div layout="column" class="swosh" layout-align="start center" flex="10"><h1>How do you compare to the rest of the world?</h1></div><div layout="column" class="swosh" layout-align="center center" flex="50"><div id="chart"></div></div><div layout="column" class="swosh" layout-align="end center" flex="10"><h4>The global average is base on {{globalAverages.totalUsers}} users</h4></div></section><section class="share section jump" layout="column" flex="20"><div layout="column" class="swosh" layout-align="center center" flex="100"><h1>Want to Challenge another friend ?</h1><md-button class="md-raised md-primary" ng-click="again()">Let\'s do it!</md-button></div></section>')
}])}();