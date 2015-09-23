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
            //// Activities data source. The Backend Services dialect of the Kendo UI DataSource component
            //// supports filtering, sorting, paging, and CRUD operations.
            //    var data = app.everlive.data('Activities');
            //    var query = new Everlive.Query();
            //    app.mobileApp.showLoading();
            //    data.get(query)
            //        .then(function (data) {
            //            if (data.result.length > 0) {
            //                $('#no-activities-span').hide();
            //                var dataSource = new kendo.data.DataSource({
            //                    transport: {
            //                        read: function (options) {
            //                            try {
            //                                app.mobileApp.hideLoading();
            //                                options.success(data.result);
            //                            } catch (err) {
            //                                console.log(err);
            //                            }
            //                        }
            //                    },
            //                    error: function (e) {
            //                        alert(JSON.stringify(error));
            //                    },
            //                    schema: { // describe the result format
            //                        model: activityModel
            //                    }
            //                });

            //              
            //            }
            //            else {
            //                $('#no-activities-span').show();
            //            }
            //        },
            //        function (error) {
            //            alert(JSON.stringify(error));
            //        });


            //$.getJSON('/data/customers.json', function (data) {
                //var dataSource = new kendo.data.DataSource({
                //    transport: {
                //        read: function (options) {
                //            try {
                //                app.mobileApp.hideLoading();
                //                options.success(data);
                //            } catch (err) {
                //                console.log(err);
                //            }
                //        }
                //    },
                //    error: function (e) {
                //        alert(JSON.stringify(error));
                //    },
                //    //schema: {
                //    //    // describe the result format
                //    //    model: activityModel
                //    //}
                //});
              
            //});
            $("#activities-listview").kendoMobileListView({
                dataSource: customers,
                template: $("#activityTemplate").html()
            });
        }
        return {
            show: show
        }

    }());

    // Activities view model
    var activitiesViewModel = (function () {

        // Navigate to activityView When some activity is selected
        var activitySelected = function (e) {
            app.mobileApp.navigate('views/activityView.html?uid=' + e);
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
