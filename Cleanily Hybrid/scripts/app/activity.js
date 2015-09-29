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
            activity = {},
            checklist_id;

        var init = function (e) {};

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
                    {
                        area_type: "Kitchen",
                        area_items: [
                            {
                                area_item: "Cooker Hood",
                                area_item_description: "N/A"
                            },
                            {
                                area_item: "Kitchen Table and C..",
                                area_item_description: "N/A"
                            },
                            {
                                area_item: "Kitchen Floor",
                                area_item_description: "N/A"
                            }]
                 },
                    {
                        area_type: "Bathroom",
                        area_items: [
                            {
                                area_item: "Bath",
                                area_item_description: "N/A"
                            },
                            {
                                area_item: "Bathroom Floor",
                                area_item_description: "N/A"
                            },
                            {
                                area_item: "Clean Shower Screen",
                                area_item_description: "Hygienically cleaned, removal of any limescale/mildew deposits. Make sure no streaks are left."
                            }
                        ]
                    },
                    {
                        area_type: "Bedroom",
                        area_items: [
                            {
                                area_item: "Bedroom Floor",
                                area_item_description: "N/A"
                            }
                        ]
                    },
                    {
                        area_type: "Custom Area Type",
                        area_items: [
                            {
                                area_item: "Floor",
                                area_item_description: "N/A"
                            },
                            {
                                area_item: "Custom A",
                                area_item_description: "N/A"
                            }
                        ]
                    }
                ];
                //for (var propertyName in data.checklists[0].checklist_entries) {

                var areaTypeDropListData = [];

                //create dataSource
                var areaTypeList = new kendo.data.DataSource({
                    data: areaTypeListData
                        //group: "area_type"
                });

                //var groupItems = {}, base, key;
                //$.each(data.checklists[0].checklist_entries, function (index, val) {
                //    key = val['area_type'];
                //    if (!groupItems[key]) {
                //        groupItems[key] = [];
                //    }
                //    groupItems[key].push(val);
                //});

                //for (var propertyName in groupItems) {
                //    //for (var i = 0; i < groupItems.length; i++) {
                //    var areaType = {
                //        "name": propertyName,
                //        'value': groupItems[propertyName]
                //    };
                //    areaTypeDropListData.push(areaType);
                //}
                ////}
                for (var i = 0; i < data.checklists[0].checklist_entries.length; i++) {
                    checklist_id = data.checklists[0].checklist_entries[i].checklist_id;
                    areaTypeDropListData.push(data.checklists[0].checklist_entries[i]); //add the item to ListB
                }

                var areaTypeDropList = new kendo.data.DataSource({
                    data: areaTypeDropListData,
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
                    template: "<div class='item'>#: area_type #</div>"
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

                        var draggableElement = e.draggable.currentTarget.parent(),
                            dataItem = areaTypeList.getByUid(draggableElement.data("uid")); //find the corresponding dataItem by uid
                        console.log(dataItem);

                        //areaTypeList.remove(dataItem); //remove the item from ListA
                        //for (var j = 0; j < dataItem.child.length; j++) {
                        //    var actionTypeGroup = {
                        //        group: dataItem.name,
                        //        name: dataItem.child[j]
                        //    }
                        //    areaTypeDropList.add(actionTypeGroup); //add the item to ListB
                        //}

                        var groupAreaType = [];
                        var view = areaTypeDropList.view();
                        for (var i = 0; i < view.length; i++) {
                            groupAreaType.push(view[i].value.toLowerCase())
                        }
                        debugger;

                        var area_type = dataItem.area_type;
                        var exists = $.inArray(area_type.toLowerCase(), groupAreaType) > -1;
                        if (exists) {
                            area_type = area_type + " Number 2";
                        }

                        for (var i = 0; i < dataItem.area_items.length; i++) {
                            var item = dataItem.area_items[i];
                            var areaType = {
                                area_type: area_type,
                                action_item: item.area_item,
                                action_item_description: item.area_item_description,
                                id: -1, // for add new
                                customer_reviews: [],
                                checklist_id: checklist_id,
                                is_draft: false,
                                have_new_comment: false
                            }

                            areaTypeDropList.add(areaType); //add the item to ListB
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