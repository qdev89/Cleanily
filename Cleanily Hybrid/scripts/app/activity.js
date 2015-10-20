/**
 * Activity view model
 */

var app = app || {};
//var areaTypeDropList = new kendo.data.DataSource({
//    offlineStorage: "areaTypeDrop-list"
//});

// offline
//document.addEventListener("online", function () {
//    areaTypeDropList.online(true);
//});

//document.addEventListener("offline", function () {
//    localStorage["areaTypeDrop-list"] = JSON.stringify(areaTypeDropList.view());
//    //areaTypeDropList.online(false);
//});

//$(window).on("online", function () {
//    areaTypeDropList.online(true);
//});

//$(window).on("offline", function () {
//    areaTypeDropList.online(false);
//});


app.Activity = (function () {
    'use strict'

    var $commentsContainer,
        listScroller;

    var activityViewModel = (function () {

        var addressId, customerId,
            activity = {},
            checklist_id;
        var areaTypeDropList, areaTypeList;


        var selectAreaType, selectAreaTypeElement;
        var selectActionItem, selectActionItemDescription, selectActionItemElement;
        var init = function (e) { };

        var show = function (e) {
            listScroller = e.view.scroller;
            listScroller.reset();

            // offline
            document.addEventListener("offline", function () {
                try {
                    if (areaTypeDropList !== undefined && areaTypeDropList.view() !== undefined) {
                        var stringObject = areaTypeDropList.view();
                        localStorage["areaTypeDrop-list"] = JSON.stringify(stringObject);
                        localStorage["address"] = JSON.stringify(activity);
                        //areaTypeDropList.online(false);
                    }
                } catch (e) {
                    // Do nothing
                }
            });

            var areaTypeDropListData = [];
            //create dataSource
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
                        }
                    ]
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
            areaTypeList = new kendo.data.DataSource({
                data: areaTypeListData
            });
            //display dataSource's data through ListView
            $("#areaTypeList").kendoMobileListView({
                dataSource: areaTypeList,
                template: "<div class='item'>#: area_type #</div>"
            });

            if (localStorage["areaTypeDrop-list"] !== undefined) {
                // using data from local storage that has been stored when offline
                activity = JSON.parse(localStorage["address"]);
                kendo.bind(e.view.element, activity, kendo.mobile.ui);
                areaTypeDropList = JSON.parse(localStorage["areaTypeDrop-list"]);
                implementDragDrop();
            }
            else {
                addressId = e.view.params.addressId;
                customerId = e.view.params.customerId;

                $.getJSON(appSettings.api.apiurl('franchisee/customers/' + customerId + '/addresses/' + addressId + '/checklists.json'), function (data) {
                    activity = data.checklists[0].address;
                    kendo.bind(e.view.element, activity, kendo.mobile.ui);
                    //for (var propertyName in data.checklists[0].checklist_entries) {


                    if (localStorage["areaTypeDrop-list"] === undefined) {
                        var groupItems = {},
                            key;
                        $.each(data.checklists[0].checklist_entries, function (index, val) {
                            key = val['area_type'];
                            if (!groupItems[key]) {
                                groupItems[key] = [];
                            }
                            groupItems[key].push(val);
                        });

                        for (var propertyName in groupItems) {
                            //for (var i = 0; i < groupItems.length; i++) {
                            var areaType = {
                                "area_type": propertyName,
                                'values': groupItems[propertyName]
                            };
                            areaTypeDropListData.push(areaType);
                        }
                        //}

                        //for (var i = 0; i < data.checklists[0].checklist_entries.length; i++) {
                        //    checklist_id = data.checklists[0].checklist_entries[i].checklist_id;
                        //    areaTypeDropListData.push(data.checklists[0].checklist_entries[i]); //add the item to ListB
                        //}

                        areaTypeDropList = new kendo.data.DataSource({
                            data: areaTypeDropListData
                        });

                    }
                    else {
                        areaTypeDropList = new kendo.data.DataSource({
                            data: areaTypeDropList
                        });
                    }

                    //for (var i = 0; i < areaTypeListData.length; i++) {
                    //    for (var j = 0; j < areaTypeListData[i].child.length; j++) {
                    //        var actionTypeGroup = {
                    //            group: areaTypeListData[i].name,
                    //            name: areaTypeListData[i].child[j]
                    //        }
                    //        areaTypeDropList.add(actionTypeGroup); //add the item to ListB
                    //    }
                    //}

                    // mockup for testing in VS
                    /*  for (var j = 0; j < areaTypeListData.length; j++) {
                          var dataItem = areaTypeListData[j];
                          var values = [];
                          for (var i = 0; i < dataItem.area_items.length; i++) {
                              var item = dataItem.area_items[i];
                              var areaItem = {
                                  area_type: dataItem.area_type,
                                  action_item: item.area_item,
                                  action_item_description: item.area_item_description,
                                  id: -1, // for add new
                                  customer_reviews: [],
                                  checklist_id: checklist_id,
                                  is_draft: false,
                                  have_new_comment: false
                              }
                              values.push(areaItem);
                          }
    
                          var areaType = {
                              "area_type": dataItem.area_type,
                              'values': values
                          };
                          areaTypeDropList.add(areaType); //add the item to ListB
                      }*/

                    implementDragDrop();
                });
            }
        };

        var implementDragDrop = function () {

            $("#areaTypeDropList").kendoMobileListView({
                dataSource: areaTypeDropList,
                template: $('#areaTypeDropTemplate').html(),
                //headerTemplate: $('#areaTypeDropHeaderTemplate').html(),
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
                    app.showLoading();
                    var draggableElement = e.draggable.currentTarget.parent(),
                        dataItem = areaTypeList.getByUid(draggableElement.data("uid"));
                    var groupAreaType = [];
                    var view = areaTypeDropList.view();
                    for (var i = 0; i < view.length; i++) {
                        groupAreaType.push(view[i].area_type.toLowerCase());
                    }
                    var area_type = dataItem.area_type;
                    var exists = $.inArray(area_type.toLowerCase(), groupAreaType) > -1;
                    if (exists) {
                        var numberOfAreaType = 1;
                        for (var i = 0; i < groupAreaType.length; i++) {
                            if (groupAreaType[i].toLowerCase().indexOf(area_type.toLowerCase()) != -1) {
                                numberOfAreaType++;
                            }
                        }

                        area_type = area_type + " Number " + numberOfAreaType;
                    }

                    var values = [];
                    for (var i = 0; i < dataItem.area_items.length; i++) {
                        var item = dataItem.area_items[i];
                        var areaItem = {
                            area_type: area_type,
                            action_item: item.area_item,
                            action_item_description: item.area_item_description,
                            id: -1, // for add new
                            customer_reviews: [],
                            checklist_id: checklist_id,
                            is_draft: false,
                            have_new_comment: false
                        }
                        values.push(areaItem);
                    }

                    var areaType = {
                        "area_type": area_type,
                        'values': values
                    };
                    areaTypeDropList.add(areaType); //add the item to ListB

                    //areaTypeDropList.sync();
                    //$("#areaTypeDropList").kendoMobileListView({
                    //    dataSource: areaTypeDropList,
                    //    template: $('#areaTypeDropTemplate').html()
                    //});

                    resetStyling.call(this); //reset visual dropTarget indication that was added on dragenter
                    app.hideLoading();
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
        }

        var deleteAreaType = function (areaType, element) {
            app.showLoading();
            $("#" + areaType.replace(/ /g, '_') + "AreaType").data("kendoMobileCollapsible").toggle();

            var uid = element.parentElement.parentElement.parentElement.parentElement.getAttribute("data-uid");
            var dataItem = areaTypeDropList.getByUid(uid);
            areaTypeDropList.remove(dataItem);

            app.hideLoading();
        }
        var editAreaType = function (areaType, element) {
            selectAreaTypeElement = element;
            selectAreaType = areaType;
            var currentAreaType = $("#nameAreaType");
            currentAreaType.val(areaType);
            currentAreaType.focus();
            $("#" + areaType.replace(/ /g, '_') + "AreaType").data("kendoMobileCollapsible").toggle();
            $("#modalview-editAreaType").kendoMobileModalView("open");
        }

        var saveAreaType = function () {
            app.showLoading();
            var uid = selectAreaTypeElement.parentElement.parentElement.parentElement.parentElement.getAttribute("data-uid");
            var dataItem = areaTypeDropList.getByUid(uid);
            var currentAreaType = $("#nameAreaType");
            if (currentAreaType.val() !== dataItem.area_type) {
                dataItem.area_type = currentAreaType.val();
                for (var i = 0; i < dataItem.values.length; i++) {
                    dataItem.values[i].area_type = dataItem.area_type;
                }
                $("#areaTypeDropList").data("kendoMobileListView").setDataSource(areaTypeDropList);
            }

            setTimeout(function () {
                $("#modalview-editAreaType").kendoMobileModalView("close");
                app.hideLoading();
            }, 500);
            app.hideLoading();
        }


        var deleteActionItem = function (actionItem, element) {
            app.showLoading();
            var uid = element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("data-uid");
            var dataItem = areaTypeDropList.getByUid(uid);
            for (var i = 0; i < dataItem.values.length; i++) {
                if (dataItem.values[i].action_item === actionItem) {
                    dataItem.values.remove(dataItem.values[i]);
                    break;
                }
            }

            $("#areaTypeDropList").data("kendoMobileListView").setDataSource(areaTypeDropList);

            $("#" + dataItem.area_type.replace(/ /g, '_') + "AreaType").data("kendoMobileCollapsible").expand();
            app.hideLoading();
        }

        var editActionItem = function (actionItem, actionItemDescription, element) {
            selectActionItem = actionItem;
            selectActionItemDescription = actionItemDescription != 'null' ? actionItemDescription : '';
            selectActionItemElement = element;
            var currentActionItemNewName = $("#nameActionItem");
            var currentActionItemNewDescription = $("#descriptionActionItem");
            currentActionItemNewName.val(actionItem);
            currentActionItemNewDescription.val(selectActionItemDescription);
            currentActionItemNewName.focus();

            $("#modalview-editActionItem").kendoMobileModalView("open");
        }

        var saveActionItem = function () {
            app.showLoading();
            var actionItemTrim = selectActionItem.replace(/ /g, '_');

            var uid = selectActionItemElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute("data-uid");
            var dataItem = areaTypeDropList.getByUid(uid);

            var currentActionItemNewName = $("#nameActionItem");
            var currentActionItemNewDescription = $("#descriptionActionItem");
            var newActionItemValue = currentActionItemNewName.val();
            var currentActionItemValue;
            for (var i = 0; i < dataItem.values.length; i++) {
                if (dataItem.values[i].action_item === selectActionItem) {
                    currentActionItemValue = dataItem.values[i];
                    break;
                }
            }
            if (currentActionItemNewName.val() !== currentActionItemValue.action_item || (currentActionItemNewDescription.val() != 'null' && currentActionItemNewDescription.val() !== currentActionItemValue.action_item_description)) {
                currentActionItemValue.action_item = newActionItemValue;
                currentActionItemValue.action_item_description = currentActionItemNewDescription.val();
                $("#areaTypeDropList").data("kendoMobileListView").setDataSource(areaTypeDropList);
            }

            $("#" + currentActionItemValue.area_type.replace(/ /g, '_') + "AreaType").data("kendoMobileCollapsible").expand();
            $("#" + newActionItemValue.replace(/ /g, '_') + "ActionItem").data("kendoMobileCollapsible").expand();

            setTimeout(function () {
                $("#modalview-editActionItem").kendoMobileModalView("close");
                app.hideLoading();
            }, 500);

        }

        var saveNewActionItem = function () {
            app.showLoading();
            var uid = selectAreaTypeElement.parentElement.parentElement.parentElement.parentElement.getAttribute("data-uid");
            var dataItem = areaTypeDropList.getByUid(uid);

            var colappsibleAreaType = $("#" + dataItem.area_type.replace(/ /g, '_') + "AreaType").data("kendoMobileCollapsible");
            var isCollapsed = $("#" + dataItem.area_type.replace(/ /g, '_') + "AreaType").hasClass("km-collapsed");

            var currentActionItemNewName = $("#nameNewActionItem");
            var currentActionItemNewDescription = $("#descriptionNewActionItem");
            var newActionItemValue = currentActionItemNewName.val();
            if (newActionItemValue !== null && newActionItemValue !== '') {

                var actionItem = {
                    area_type: dataItem.area_type,
                    action_item: newActionItemValue,
                    action_item_description: currentActionItemNewDescription.val(),
                    id: -1, // for add new
                    customer_reviews: [],
                    checklist_id: checklist_id,
                    is_draft: false,
                    have_new_comment: false
                }
                dataItem.values.push(actionItem);
                $("#areaTypeDropList").data("kendoMobileListView").setDataSource(areaTypeDropList);
                //$("#areaTypeDropList").data("kendoMobileListView").refresh();

                if (isCollapsed) {
                    $("#" + dataItem.area_type.replace(/ /g, '_') + "AreaType").data("kendoMobileCollapsible").collapse();
                } else {
                    $("#" + dataItem.area_type.replace(/ /g, '_') + "AreaType").data("kendoMobileCollapsible").expand();
                }

                setTimeout(function () {
                    $("#modalview-addActionItem").kendoMobileModalView("close");
                    app.hideLoading();
                }, 500);
            }
        }

        var addActionItem = function (areaType, element) {
            selectAreaType = areaType;
            selectAreaTypeElement = element;

            var currentActionItemNewName = $("#nameNewActionItem");
            var currentActionItemNewDescription = $("#descriptionNewActionItem");
            currentActionItemNewName.val('');
            currentActionItemNewName.focus();
            currentActionItemNewDescription.val('');

            $("#" + areaType.replace(/ /g, '_') + "AreaType").data("kendoMobileCollapsible").toggle();

            $("#modalview-addActionItem").kendoMobileModalView("open");
        }

        return {
            init: init,
            show: show,
            deleteAreaType: deleteAreaType,
            editAreaType: editAreaType,
            saveAreaType: saveAreaType,
            deleteActionItem: deleteActionItem,
            editActionItem: editActionItem,
            saveActionItem: saveActionItem,
            saveNewActionItem: saveNewActionItem,
            addActionItem: addActionItem,
            save: function () {
                localStorage.clear();
            },
            activity: function () {
                return activity;
            }
        };

    }());

    return activityViewModel;

}());
