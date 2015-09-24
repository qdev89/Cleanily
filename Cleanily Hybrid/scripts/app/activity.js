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
            //var areaTypeList = new kendo.data.DataSource({
            //    data: [

            var areaTypeList = [
                { id: 1, name: "Kitchen", child: ["Cooker Hood", "Kitchen Table and C..", "Kitchen Floor"] },
                { id: 2, name: "Bathroom", child: ["Bath", "Bathroom Floor"] },
                { id: 3, name: "Bedroom", child: ["Bedroom Floor"] },
                { id: 4, name: "Custom Area Type", child: ["Floor", "Custom A"] }
            ];
            //schema: {
            //    model: {
            //        id: "id",
            //        fields: {
            //            id: { type: "number" },
            //            name: { type: "string" }
            //        }
            //    }
            //}
            //});
            var areaTypeDropList = [];
            //for (var i = 0; i < areaTypeList.length; i++) {
            //    for (var j = 0; j < areaTypeList[i].child.length; j++) {
            //        var actionTypeGroup = {
            //            group: areaTypeList[i].name,
            //            name: areaTypeList[i].child[j]
            //        }
            //        areaTypeDropList.push(actionTypeGroup); //add the item to ListB
            //    }
            //}

            //display dataSource's data through ListView
            $("#areaTypeList").kendoMobileListView({
                dataSource: areaTypeList,
                template: "<div class='item'>#: name #</div>"
            });
            $("#areaTypeDropList").kendoMobileListView({
                dataSource: kendo.data.DataSource.create({ data: areaTypeDropList, group: "group" }), 
                template: $('#areaTypeDropTemplate').html(),
                headerTemplate: $('#areaTypeDropHeaderTemplate').html(),
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
                drop: function (e) { //apply changes to the data after an item is dropped
                    debugger;
                    var draggableElement = e.draggable.currentTarget.parent(),
                    dataItem = areaTypeList.getByUid(draggableElement.data("uid")); //find the corresponding dataItem by uid
                    console.log(dataItem);

                    areaTypeList.remove(dataItem); //remove the item from ListA
                    for (var j = 0; j < dataItem.child.length; j++) {
                        var actionTypeGroup = {
                            group: dataItem.name,
                            name: dataItem.child[j]
                        }
                        areaTypeDropList.push(actionTypeGroup); //add the item to ListB
                    }


                    resetStyling.call(this); //reset visual dropTarget indication that was added on dragenter
                }
            });

            //create a draggable for the parent container
            $("#areaTypeList").kendoDraggable({
                filter: ".item", //specify which items will be draggable
                dragstart: function (e) {
                    //var draggedElement = e.currentTarget.parent(); //get the DOM element that is being dragged
                    //var dataItem = areaTypeList.getByUid(draggedElement.data("uid")); //get corresponding dataItem from the DataSource instance

                    //console.log(dataItem);
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
