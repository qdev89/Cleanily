/**
 * Activity view model
 */

var app = app || {};

app.Activity = (function () {
    'use strict'

    var $commentsContainer,
        listScroller;

    var activityViewModel = (function () {

        var addressId, customerId,
            activity = {};

        var init = function (e) {
        };

        var show = function (e) {
            listScroller = e.view.scroller;
            listScroller.reset();

            addressId = e.view.params.addressId;
            customerId = e.view.params.customerId;
            $.getJSON(appSettings.api.apiurl('franchisee/customers/' + customerId + '/addresses/' + addressId + '/checklists.json'), function (data) {
                //var dataSource = new kendo.data.DataSource({
                //    transport: {
                //        read: function (options) {
                //            try {
                //                app.mobileApp.hideLoading();
                //                options.success(data.addresses);
                //            } catch (err) {
                //                console.log(err);
                //            }
                //        }
                //    },
                //    error: function (e) {
                //        alert(JSON.stringify(error));
                //    }
                //});

                activity = data.checklists[0].address;
                kendo.bind(e.view.element, activity, kendo.mobile.ui);
                var areaTypeListData = [
                 //{ id: 1, name: "Kitchen", child: ["Cooker Hood", "Kitchen Table and C..", "Kitchen Floor"] },
                 //{ id: 2, name: "Bathroom", child: ["Bath", "Bathroom Floor"] },
                 //{ id: 3, name: "Bedroom", child: ["Bedroom Floor"] },
                 //{ id: 4, name: "Custom Area Type", child: ["Floor", "Custom A"] }
                ];
                for (var propertyName in data.checklists[0].checklist_entries) {
                    //for (var i = 0; i < data.checklists[0].checklist_entries[propertyName].length; i++) {
                    var item = data.checklists[0].checklist_entries[propertyName];
                    var areaType = {
                        "name": propertyName,
                        'value': data.checklists[0].checklist_entries[propertyName]
                    };
                    areaTypeListData.push(areaType);
                    //}
                }

                //create dataSource
                var areaTypeList = new kendo.data.DataSource({
                    data: areaTypeListData,
                    //group: "area_type"
                });
                var areaTypeDropList = new kendo.data.DataSource({
                    data: [],
                    group: "area_type"
                });
                //for (var i = 0; i < areaTypeListData.length; i++) {
                //    for (var j = 0; j < areaTypeListData[i].child.length; j++) {
                //        var actionTypeGroup = {
                //            group: areaTypeListData[i].name,
                //            name: areaTypeListData[i].child[j]
                //        }
                //        areaTypeDropList.add(actionTypeGroup); //add the item to ListB
                //    }
                //}

                //display dataSource's data through ListView
                $("#areaTypeList").kendoMobileListView({
                    dataSource: areaTypeList,
                    template: "<div class='item'>#: name #</div>"
                });
                $("#areaTypeDropList").kendoMobileListView({
                    dataSource: areaTypeDropList,
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
                        //for (var j = 0; j < dataItem.child.length; j++) {
                        //    var actionTypeGroup = {
                        //        group: dataItem.name,
                        //        name: dataItem.child[j]
                        //    }
                        //    areaTypeDropList.add(actionTypeGroup); //add the item to ListB
                        //}
                        for (var i = 0; i < dataItem.value.length; i++) {
                            areaTypeDropList.add(dataItem.value[i]); //add the item to ListB
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
            });


        };
        return {
            init: init,
            show: show,
            activity: function () {
                return activity;
            }
        };

    }());

    return activityViewModel;

}());
