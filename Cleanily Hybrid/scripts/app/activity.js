/**
 * Activity view model
 */

var app = app || {};

app.Activity = (function () {
    'use strict'

    var $commentsContainer,
        listScroller;

    var activityViewModel = (function () {

        var activityUid, customer,
            activity = {};

        var init = function (e) {
        };

        var show = function (e) {
            listScroller = e.view.scroller;
            listScroller.reset();

            //activityUid = e.view.params.uid;
            // Get current activity (based on item uid) from Activities model
            //activity = app.Activities.activities.getByUid(activityUid);
            //$activityPicture[0].style.display = activity.Picture ? 'block' : 'none';

            //app.Comments.comments.filter({
            //    field: 'ActivityId',
            //    operator: 'eq',
            //    value: activity.Id
            //});

            activityUid = e.view.params.uid;


            activity.customer = customers[activityUid - 1];
            kendo.bind(e.view.element, activity, kendo.mobile.ui);

            //create dataSource
            var areaTypeList = new kendo.data.DataSource({
                    data: [
                    { id: 1, name: "Kitchen" },
                    { id: 2, name: "Bathroom" },
                    { id: 3, name: "Bedroom" },
                    { id: 4, name: "Custom Area Type" }
                ],
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            id: { type: "number" },
                            name: { type: "string" }
                        }
                    }
                }
            });
            var areaTypeDropList = new kendo.data.DataSource({
                data: [ /* still no data */],
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            id: { type: "number" },
                            item: { type: "string" }
                        }
                    }
                }
            });

            //display dataSource's data through ListView
            $("#areaTypeList").kendoMobileListView({
                dataSource: areaTypeList,
                template: "<div class='item'>#: name #</div>"
            });
            $("#areaTypeDropList").kendoMobileListView({
                dataSource: areaTypeDropList,
                template: "<div class='item'>#: name #</div>"
            });

            function addStyling(e) {
                this.element.css({
                    "border-color": "#06c",
                    "background-color": "#e0e0e0",
                    "opacity": 0.6
                });
            }

            function resetStyling(e) {
                this.element.css({
                    "border-color": "black",
                    "background-color": "transparent",
                    "opacity": 1
                });
            }

            $("#areaTypeDropList").kendoDropTarget({
                dragenter: addStyling, //add visual indication
                dragleave: resetStyling, //remove the visual indication
            });

            //create a draggable for the parent container
            $("#areaTypeList").kendoDraggable({
                filter: ".item", //specify which items will be draggable
                dragstart: function (e) {
                    //debugger;
                    var draggedElement = e.currentTarget, //get the DOM element that is being dragged
                        dataItem = areaTypeList.getByUid(draggedElement.data("uid")); //get corresponding dataItem from the DataSource instance

                    console.log(dataItem);
                },
                hint: function (element) { //create a UI hint, the `element` argument is the dragged item
                    return element.clone().css({
                        //"opacity": 0.6,
                        //"background-color": "#0cf"
                    });
                }
            });

        };

        var removeActivity = function () {

            var activities = app.Activities.activities;
            var activity = activities.getByUid(activityUid);

            app.showConfirm(
                appSettings.messages.removeActivityConfirm,
                'Delete Activity',
                function (confirmed) {
                    if (confirmed === true || confirmed === 1) {

                        activities.remove(activity);
                        activities.one('sync', function () {
                            app.mobileApp.navigate('#:back');
                        });
                        activities.sync();
                    }
                }
            );
        };
        return {
            init: init,
            show: show,
            remove: removeActivity,
            activity: function () {
                return activity;
            }
        };

    }());

    return activityViewModel;

}());
