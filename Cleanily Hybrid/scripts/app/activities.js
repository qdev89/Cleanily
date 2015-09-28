/**
 * Activities view model
 */

var app = app || {};

app.Activities = (function () {
    'use strict'

    // Activities model
    var activitiesModel = (function () {

        //var activityModel = {

        //    id: 'Id',
        //    fields: {
        //        Text: {
        //            field: 'Text',
        //            defaultValue: ''
        //        },
        //        CreatedAt: {
        //            field: 'CreatedAt',
        //            defaultValue: new Date()
        //        },
        //        Picture: {
        //            fields: 'Picture',
        //            defaultValue: null
        //        },
        //        UserId: {
        //            field: 'UserId',
        //            defaultValue: null
        //        },
        //        Likes: {
        //            field: 'Likes',
        //            defaultValue: []
        //        }
        //    },
        //    CreatedAtFormatted: function () {

        //        return app.helper.formatDate(this.get('CreatedAt'));
        //    },
        //    PictureUrl: function () {

        //        return app.helper.resolvePictureUrl(this.get('Picture'));
        //    },
        //    User: function () {

        //        //var userId = this.get('UserId');

        //        //var user = $.grep(app.Users.users(), function (e) {
        //        //    return e.Id === userId;
        //        //})[0];

        //        //return user ? {
        //        //    DisplayName: user.DisplayName,
        //        //    PictureUrl: app.helper.resolveProfilePictureUrl(user.Picture)
        //        //} : {
        //        //    DisplayName: 'Anonymous',
        //        //    PictureUrl: app.helper.resolveProfilePictureUrl()
        //        //};

        //        return {
        //            DisplayName: 'Anonymous'
        //        };
        //    },
        //    isVisible: function () {
        //        //var currentUserId = app.Users.currentUser.data.Id;
        //        //var userId = this.get('UserId');

        //        //return currentUserId === userId;
        //        return true;
        //    }
        //};

        var show = function () {
            function instantSearch() {
                var key = $('#activities-search').val();
                if (key.length >= 3) {
                    $.getJSON(appSettings.api.url + 'franchisee/checklists/autocomplete.json?query_string=' + key + '&user_email=' + appSettings.api.user_email + '&user_token=' + appSettings.api.auth_token, function (data) {
                        var dataSource = new kendo.data.DataSource({
                            transport: {
                                read: function (options) {
                                    try {
                                        app.mobileApp.hideLoading();
                                        options.success(data.checklists);
                                    } catch (err) {
                                        console.log(err);
                                    }
                                }
                            },
                            error: function (e) {
                                alert(JSON.stringify(error));
                            }
                        });
                        $("#activities-listview").kendoMobileListView({
                            dataSource: dataSource,
                            template: $("#activityTemplate").html()
                        });
                    });
                }
                else {
                    $("#activities-listview").kendoMobileListView({
                        dataSource: new kendo.data.DataSource(),
                        template: $("#activityTemplate").html()
                    });
                }
            }

            var timer;
            $('#activities-search').keyup(function () {
                timer && clearTimeout(timer);
                timer = setTimeout(instantSearch, 200);
            });



        }
        return {
            show: show
        }

    }());

    // Activities view model
    var activitiesViewModel = (function () {

        // Navigate to activityView When some activity is selected
        var activitySelected = function (addressId, customerId) {
            debugger;
            app.mobileApp.navigate('views/activityView.html?addressId=' + addressId + '&customerId=' + customerId);
        };
        // Navigate to app home
        var navigateHome = function () {

            app.mobileApp.navigate('#welcome');
        };

        // Logout user
        var logout = function () {

            app.helper.logout()
            .then(navigateHome, function (err) {
                app.showError(err.message);
                navigateHome();
            });
        };

        var currentDate = function () {
            var a = moment();
            return a.format("Do MMMM YYYY"); // "14th February  2010"
        }
        var show = function () {
            activitiesModel.show();
        };
        return {
            //activities: activitiesModel.activities,
            activitySelected: activitySelected,
            logout: logout,
            currentDate: currentDate(),
            show: show,
        };

    }());

    return activitiesViewModel;

}());
