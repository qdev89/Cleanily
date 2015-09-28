/**
 * Login view model
 */

var app = app || {};

app.Login = (function () {
    'use strict';

    var loginViewModel = (function () {

        var isInMistSimulator = (location.host.indexOf('icenium.com') > -1);

        var $loginUsername;
        var $loginPassword;

        var isFacebookLogin = app.isKeySet(appSettings.facebook.appId) && app.isKeySet(appSettings.facebook.redirectUri);
        var isGoogleLogin = app.isKeySet(appSettings.google.clientId) && app.isKeySet(appSettings.google.redirectUri);
        var isLiveIdLogin = app.isKeySet(appSettings.liveId.clientId) && app.isKeySet(appSettings.liveId.redirectUri);
        var isAdfsLogin = app.isKeySet(appSettings.adfs.adfsRealm) && app.isKeySet(appSettings.adfs.adfsEndpoint);
        var isAnalytics = analytics.isAnalytics();

        var init = function () {

            if (!app.isKeySet(appSettings.everlive.apiKey)) {
                app.mobileApp.navigate('views/noApiKey.html', 'fade');
            }

            $loginUsername = $('#loginUsername');
            $loginPassword = $('#loginPassword');

            if (!isFacebookLogin) {
                $('#loginWithFacebook').addClass('disabled');
                console.log('Facebook App ID and/or Redirect URI not set. You cannot use Facebook login.');
            }
            if (!isGoogleLogin) {
                $('#loginWithGoogle').addClass('disabled');
                console.log('Google Client ID and/or Redirect URI not set. You cannot use Google login.');
            }
            if (!isLiveIdLogin) {
                $('#loginWithLiveID').addClass('disabled');
                console.log('LiveID Client ID and/or Redirect URI not set. You cannot use LiveID login.');
            }
            if (!isAdfsLogin) {
                $('#loginWithADSF').addClass('disabled');
                console.log('ADFS Realm and/or Endpoint not set. You cannot use ADFS login.');
            }
            if (!isAnalytics) {
                console.log('EQATEC product key is not set. You cannot use EQATEC Analytics service.');
            }
        };

        var show = function () {
            $loginUsername.val('edward@traditional-cleaning.com');
            $loginPassword.val('firstadminuser');
        };

        // Authenticate to use Backend Services as a particular user
        var login = function () {

            var username = $loginUsername.val();
            var password = $loginPassword.val();
            //app.mobileApp.navigate('views/activitiesView.html');
            var userLogin =
                {
                    "user_login":
                    {
                        "email": username,
                        "password": password
                    }
                };
            app.mobileApp.showLoading();
            $.ajax({
                url: appSettings.api.url + 'api/users/sign_in.json',
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    app.mobileApp.hideLoading();
                    if (data.success) {
                        appSettings.api.user_email = data.user_email;
                        appSettings.api.auth_token = data.user_token;
                        app.mobileApp.navigate('views/activitiesView.html');
                    } else {
                        alert("Email or passwork is incorrect. Please try again.");
                    }
                },
                data: userLogin,
                error: function (request, status, error) {
                    app.mobileApp.hideLoading();
                    var obj = JSON.parse(request.responseText);
                    alert(obj.message);
                }
            });

            //// Authenticate using the username and password
            //app.everlive.Users.login(username, password)
            //.then(function () {
            //    // EQATEC analytics monitor - track login type
            //    if (isAnalytics) {
            //        analytics.TrackFeature('Login.Regular');
            //    }

            //    app.mobileApp.hideLoading();
            //    return app.Users.load();
            //})
            //.then(function () {

            //    app.mobileApp.navigate('views/activitiesView.html');
            //})
            //.then(null,
            //      function (err) {
            //          app.mobileApp.hideLoading();
            //          app.showError(err.message);
            //      }
            //);
        };

        var showMistAlert = function () {
            alert(appSettings.messages.mistSimulatorAlert);
        };

        return {
            init: init,
            show: show,
            getYear: app.getYear,
            login: login,
        };

    }());

    return loginViewModel;

}());
