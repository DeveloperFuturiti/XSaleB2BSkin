function hasValue(arg) {
    return (typeof arg !== "undefined" && arg !== null);
}

function replaceAll(find, replace, str) {
    while (str.indexOf(find) > -1) {
        str = str.replace(find, replace);
    }
    return str;
}

var SAlert = {
    Error: function (message) {
        swal(ResourcesLocalization.AnErrorOccured, message, "error");
    },

    Error2: function (title, message) {
        swal(title, message, "error");
    },
    ValError: function (message) {
        swal(ResourcesLocalization.ValidationError, message, "info");
    },
    //AssignError: function (message) {
    //    swal(ResourcesLocalization.AssignmentError, message, "info");
    //},
    //SaveError: function (message) {
    //    swal(ResourcesLocalization.SavingError, message, "error");
    //},
    //DeleteError: function (message) {
    //    swal(ResourcesLocalization.ErrorDuringRemoving, message, "error");
    //},
    //SendError: function (message) {
    //    swal(ResourcesLocalization.ErrorDuringTransferring, message, "error");
    //},

    //SaveSuccessWithMessage: function (message) {
    //    swal(ResourcesLocalization.Saved, message, "success");
    //},
    SaveSuccessAutoClose: function () {
        swal({
            title: ResourcesLocalization.Saved,
            text: "",
            timer: 1000,
            type: "success",
            showConfirmButton: false
        });
    },
    SuccessAutoCloseSetTimeSeconds: function (message, seconds, html) {
        if (!hasValue(html)) {
            html = false;
        }
        swal({
            title: "",
            text: message,
            timer: seconds * 1000,
            showConfirmButton: false,
            type: "success",
            html: html
        });
    },
    Info: function (message) {
        swal("", message, "info");
    },
    InfoAutoClose: function (message) {
        swal({
            title: "",
            text: message,
            timer: 2000,
            showConfirmButton: false,
            type: "info"
        });
    },

    Warning: function (message) {
        swal("", message, "warning");
    },
    Success: function (message) {
        swal("", message, "success");
    },
    Confirm: function (config, closeOnConfirm) {
        swal({
            title: 'Potwierdzenie',
            text: config.content,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: 'Tak',
            closeOnConfirm: hasValue(closeOnConfirm) ? closeOnConfirm : true,
            cancelButtonText: 'Nie',
            html: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (config.handler != undefined && config.handler != null)
                    config.handler()
            } else {
                if (config.handlerNC != undefined && config.handlerNC != null)
                    config.handlerNC();
            }
        });
    },

    DeleteAjaxConfirm: function (deleteUrl, data, successHandler, errorHandler) {
        SAlert.Confirm({
            content: ResourcesLocalization.DeleteItemConfirm,
            handler: function () {
                AjaxExtension.doPost(deleteUrl, data, successHandler, errorHandler);
            }
        });
    },

    CreateOfferAjaxConfirm: function (deleteUrl, data, successHandler, errorHandler) {
    SAlert.Confirm({
        content: ResourcesLocalization.CreateOfferItemConfirm,
        handler: function () {
            window.location.replace(deleteUrl);
        }
    });
}
};

var ResponseHandler = {
    processJSONResponse: function (responseData, successCallback, errorCallback) {
        var success = hasValue(responseData) && responseData.Success;
        if (!success) {
            if (hasValue(errorCallback)) {
                errorCallback(responseData);
            }
            var errorMessage = '' + responseData.Errors.join('\n');
            setTimeout(function () {
                SAlert.Error(errorMessage);
            }, 300);

        }
        else {
            if (hasValue(successCallback)) {
                successCallback(responseData);
            }
            if (hasValue(responseData.RedirectUrl) && responseData.RedirectUrl !== '')
                window.location.replace(responseData.RedirectUrl);
        }

        return success;
    },

    processJSONFailureResponse: function (ajaxContext) 
    {
        SAlert.Error("Status: " + ajaxContext.status + ", " + ajaxContext.statusText);       
    },

    isJSONResponse: function (xhr) {
        var contentType = xhr.getResponseHeader('content-type');
        return contentType.indexOf('json') > -1;
    }
};

var DataTableExtension = {
    initCustomSearchForm: function ($tableSelector, $filterFormSelector) {
        var table = $tableSelector.DataTable();
        var searchInput = $.fn.dataTable.util.throttle(function (val, column) {
            column.search(val).draw();
        }, 450);

        $filterFormSelector.find('input').on('keyup', function () {
            var $input = $(this);
            var column = table.column($input.attr('name') + ':name');
           
            if (column.search() !== $input.val()) {
                searchInput($input.val(), column);
            }
        });
        $filterFormSelector.find('select').on('change', function () {
            var $select = $(this);
            var column = table.column($select.attr('name') + ':name');
            if (column.search() !== $select.val()) {
                column.search($select.val()).draw();
            }
        });
    },

    resizeTableHeightToWindow: function (tableId) {
        DataTableExtension.setTableHeightToWindow(tableId);
        $(window).on('resize', function () {
            DataTableExtension.setTableHeightToWindow(tableId);
        });
    },

    setTableHeightToWindow: function (tableId) {
        var $table = $(tableId);
        var $tableScrollBody = $table.parent('div.dataTables_scrollBody');
        var $tablewWrapper = $(tableId + '_wrapper');
        var height =
                        $(window).height() -
                        $('.footer').outerHeight(true) -
                        $tableScrollBody.offset().top -
                        $(tableId + '_paginate').outerHeight(true) -
                        ($tablewWrapper.outerHeight(true) - $tablewWrapper.height()) -
                        ($('.ibox-datatble').outerHeight(true) - $('.ibox-datatble').height()) -
                        ($('.ibox-datatble .ibox-content').outerHeight(true) - $('.ibox-datatble .ibox-content').height()) / 2;

        var minHeight = 200;
        if (height < minHeight)
            height = minHeight;
        $tableScrollBody.height(height - 3);
    },

    Renderer: {
        icon: function (data, type, row, meta) {
            if(data == null || data == '') 
                return '';
            else
                return '<i class="' + data + ' fa"></i>';
        },
        date: function (data, type, row, meta) {
            var value = moment(data);
            if (value.isValid() === true)
                return value.format('L');
        },
        dateTime: function (data, type, row, meta) {
            var value = moment(data);
            if(value.isValid() === true)
                return value.format('L LT');
        },
        htmlEncoded: function htmlEncode(data, type, row, meta) {
            return $('<div/>').text(data).html();
        },
        boolean: function (data, type, row, meta) {
            if (!hasValue(data) || data === '')
                return data;
            if (data === true || data === 'true')
                return ResourcesLocalization.Yes;
            else
                return ResourcesLocalization.No;
        }
    }
};

var ButtonExtension = {
    url: null,
    that: null,
    confirmDelete: function ($that) {
        ButtonExtension.that = $that;
        ButtonExtension.url = $that.data('url');
        SAlert.Confirm({
            content: ResourcesLocalization.DeleteItemConfirm,
                handler: ButtonExtension.deleteElement
                });
    },

    deleteElement: function(){
        $.ajax({
            type: 'POST',
            url: ButtonExtension.url,
            cache: false,
            success: function (content) {
                window.location.href = ButtonExtension.url;
            }
        });
    }
};

var Select2Extension = {

    initSelect2List: function (SelectorId, ActionUrl, Placeholder) {        
            if ((SelectorId != null || SelectorId != "") && (ActionUrl != null || ActionUrl != "")) {
                $(SelectorId).select2({
                    placeholder: Placeholder,
                    allowClear: true,
                    ajax: {
                        type: 'POST',
                        url: ActionUrl,
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                userInput: params.term
                            };
                        },
                        processResults: function (data) {
                            return {
                                results: data,
                            };
                        },
                        cache: true
                    },
                    escapeMarkup: function (markup) { return markup; },
                    minimumInputLength: 1,
                    width: '100%'
                });
            }
    },

    restoreInitialValue: function ($form) {
        $form.find('select.select2-hidden-accessible').each(function (index) {
            var $select2 = $(this);
            var $initOption = $select2.find('option[selected="selected"]');
            if ($initOption.length == 0) {
                $select2.select2('val', 'All');
            }
            else {
                $select2.select2('val', $initOption.val())
            }
        });
    }
};

//var Select2Ext = {
//    initSelect2List: function (SelectorId, ActionUrl, Placeholder, Variant, Width, onChange, allowClear, additionalAttributesNameDomIdJson, maxSelectionsNumber) {

//        if (!hasValue(allowClear)) {
//            allowClear = true;
//        }
//        var MinimumInputLength = 0;
//        if ((SelectorId != null || SelectorId != "")) {
//            var validation = '';
//            var tokenSeparators = [];
//            var resultFormatter = Select2Ext.formarResultDefault;
//            var selectFormatter = Select2Ext.formarSelectDefault;
//            var tags = false;
//            if (Variant != 'null') {
//                if (Variant == 'user') {
//                    MinimumInputLength = 1;
//                    resultFormatter = Select2Ext.formatResultUser;
//                    selectFormatter = Select2Ext.formatSelectUser;
//                }
//                if (Variant == 'contactPersonEmail') {
//                    MinimumInputLength = 1;
//                    resultFormatter = Select2Ext.formatResultContactPersonMail;
//                    selectFormatter = Select2Ext.formatSelectContactPersonMail;
//                    tokenSeparators = [',', ';'];
//                    tags = true;
//                    validation = 'e-mail';
//                }
//            }
//            $(document).on('click', '#select2-' + SelectorId.replace('#', '') + '-container', function () {
//                var attr = $(SelectorId).attr('disabled');
//                if (typeof attr !== typeof undefined && attr !== false) {
//                    return;
//                }
//                var $el = $(SelectorId);
//                $el.select2('open');
//                var $search = $el.data('select2').dropdown.$search || $el.data('select2').selection.$search;
//                $search.val('#');
//                $search.trigger('keyup');
//                $('.select2-search__field').val('');
//                //s2Obj.trigger('query', { term: term });//Może działać lepiej
//            });
//            var widthAttribute = 'resolve';
//            if (hasValue(Width) && Width != '')
//                widthAttribute = Width;
//            var ajax = null;
//            if (ActionUrl != null && ActionUrl != "") {
//                ajax = {
//                    url: ActionUrl,
//                    dataType: 'json',
//                    delay: 250,
//                    data: function (params) {
//                        var allParams = { userInput: params.term };
//                        if (hasValue(additionalAttributesNameDomIdJson) && additionalAttributesNameDomIdJson != '') {
//                            var attributes = additionalAttributesNameDomIdJson.split(';');
//                            //var result = '{'
//                            for (var i = 0; i < attributes.length; i++) {
//                                var keyValue = attributes[i].split(':');
//                                var key = keyValue[0];
//                                var val = keyValue[1];
//                                var fieldValue = $(val).val();
//                                //result = result + key + ': ' + fieldValue;
//                                allParams[key] = fieldValue;
//                            }
//                            //result = result + '}';
//                        }
//                        return allParams;
//                    },
//                    processResults: function (data) {
//                        return {
//                            results: data,
//                        };
//                    },
//                    cache: true
//                }
//            }
//            var maximumSelectionLength = 1000;
//            if (hasValue(maxSelectionsNumber)) {
//                maximumSelectionLength = maxSelectionsNumber;
//            }
//            $(SelectorId).select2({
//                language: "pl",
//                placeholder: Placeholder,
//                allowClear: allowClear,
//                ajax: ajax,
//                escapeMarkup: function (markup) { return markup; },
//                minimumInputLength: MinimumInputLength,
//                templateResult: resultFormatter,
//                width: widthAttribute,
//                tokenSeparators: tokenSeparators,
//                templateSelection: selectFormatter,
//                escapeMarkup: function (markup) { return markup; },
//                tags: tags,
//                maximumSelectionLength: maximumSelectionLength
//            });
//            $(SelectorId).on('change', function (evt) {
//                if (hasValue(onChange)) {
//                    onChange(this.event);
//                }
//            });
//            $(SelectorId).on('select2:selecting', function (event) {
//                if (validation != '') {
//                    var validationMessage = '';
//                    if (validation == 'e-mail') {
//                        if (!hasValue(event.params.args.data.SkipEmailValidation)) {
//                            validationMessage = Validation.validateEmail(event.params.args.data.text);
//                        }
//                    }
//                    if (validationMessage != '') {
//                        SAlert.ValError(validationMessage);
//                        event.preventDefault();
//                        return false;
//                    }
//                }
//            });
//        }
//    },
//    initAfterRender: function (selectListId) {
//        var toExecute = $('input.execute-javascript.' + selectListId);
//        for (var i = 0; i < toExecute.length; i++) {
//            var code = toExecute.val();
//            var params = code.split(',');
//            var och = 'null';
//            if (hasValue(params[5])) {
//                och = '(' + (params[5]).toString().replace('<comma>', ',') + ')';
//            }
//            var change = eval(och);
//            Select2Ext.initSelect2List(params[0], params[1], params[2], params[3], params[4], change, params[6] == 'true', params[7]);
//        }
//    },
//    formarResultDefault: function (result) {
//        return result.text;
//    },
//    formarSelectDefault: function (selected) {
//        return selected.text;
//    },
//    formatSelectUser: function (selected) {
//        return selected.nameOrLogin || selected.text;
//    },
//    formatResultUser: function (result) {//Formatowanie Nazwa, opis, adres obrazka
//        if (result.loading) return "";
//        var markup = "<div class='select2-result-repository clearfix'>" +
//          '<div style="width:60px;height:60px;float:left; border-radius: 60px; ' + result.ImageString + '"></div>' +
//          "<div style='margin-left: 70px;'>" +
//            "<div style=\"font-weight:bold;\">" + result.nameOrLogin + "</div>";
//        if (result.description) {
//            markup += "<div >" + result.description + "</div>";
//        }
//        "</div></div>";
//        return markup;
//    },
//    formatSelectContactPersonMail: function (selected) {
//        return selected.email || selected.text;
//    },
//    formatResultContactPersonMail: function (result) {//Formatowanie Nazwa, opis, adres obrazka
//        //if (result.loading) return "";        
//        var markup = "";
//        if (hasValue(result.text) && result.text != '') {
//            markup = result.text;
//        } else {
//            markup = "<div class='select2-result-repository clearfix'>" +
//                "<div style=\"\">" + result.name + "</div>";

//            if (result.description) {
//                markup += "<div >" + result.description + "</div>";
//            }
//            "</div>";
//        }
//        return markup;
//    },

//};


var UnobtrusiveValidationExtension = {
    clearAllValidationErrors: function ($form) {
        $form.find('.validation-summary-errors').empty();
        $form.find('.input-validation-error').removeClass('input-validation-error');
        $form.find('.field-validation-error').remove();
    },

    parseForm: function ($form) {
        $.validator.unobtrusive.parse($form);
    },

    reparseForm: function ($form) {
        $form.removeData('validator');
        $form.removeData('unobtrusiveValidation');
        $.validator.unobtrusive.parse($form);
    },

    removeValidationData: function ($form) {
        $form.removeData('validator');
        $form.removeData('unobtrusiveValidation');
    },

    addFieldError: function ($field) {
        $field.addClass('input-validation-error');
    },

    removeFieldError: function ($field) {
        $field.removeClass('input-validation-error');
    }
};

var AjaxExtension = {
    doPost(url, data, successHandler, errorHandler) {
        $.ajax({
            type: 'POST',
            url: url,
            cache: false,
            data: data,
            success: function (data) {
                if (ResponseHandler.processJSONResponse(data)) {
                    if (hasValue(successHandler))
                        successHandler(data);
                }
                else {
                    if (hasValue(errorHandler))
                        errorHandler();
                }
            },
            error(jqXHR, textStatus, errorThrown) {
                setTimeout(function () {
                    SAlert.Error("Status: " + jqXHR.status + ", " + jqXHR.statusText);
                }, 300);
                
                if (hasValue(errorHandler))
                    errorHandler();
            }
        });
    }
};

var ICheck = {
    init: function ($element) {
        $element.find('.i-checks').iCheck({
            checkboxClass: 'icheckbox_square-green',
            radioClass: 'iradio_square-green',
        });
    },
    uncheck: function ($element) {
        $element.find('.i-checks').iCheck('uncheck');
        $element.find('.i-checks .icheckbox_square-green').removeClass('checked');
    }
};

var Guid = {
    generate: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};

var Form = {
    fillForm: function ($form, formData) {
        if (hasValue($form) && hasValue(formData)) {
            for (var property in formData) {
                if (!property.endsWith('Formatted')) {
                    var propertyName = formData.hasOwnProperty(property + 'Formatted') ? property + 'Formatted' : property;
                    if (formData.hasOwnProperty(propertyName)) {
                        var $formElem = $form.find('[name="' + property + '"]').first();
                        if ($formElem.length == 1) {
                            if ($formElem.is('input[type=text]') || $formElem.is('input[type=hidden]'))
                                $formElem.val(formData[propertyName]);
                            else if ($formElem.is('input[type=checkbox]')) {
                                var value = formData[propertyName];
                                if (value === true || value === 'true')
                                    $formElem.iCheck('check');
                                else
                                    $formElem.iCheck('uncheck');
                            }
                            else if ($formElem.is('select'))
                                SelectList.selectOptionByValue($formElem, formData[propertyName], false);
                        }
                    }
                }
            }
        }
    }
};

var SelectList = {
    selectOptionByValue: function ($selectList, value, forceTriggerChange) {
        var valueToSelect = value === null ? '' : value;
        $selectList.find('option[value="' + valueToSelect + '"]').prop('selected', true);
        if (forceTriggerChange) {
            var eventChange = SelectList.getChangeEvent();
            $selectList.trigger(eventChange);
        }
    }
};

//Moment locale
moment.locale('PL');//ResourcesLocalization.CultureInfo.Name);

$(document).ready(function () {
    $(document).on('click', '[type="submit"][data-form-action]', function (event) {
        var $this = $(this);
        var formAction = $this.attr('data-form-action');
        if (hasValue(formAction)) {
            $form = $($this.closest('form'));

            $form.attr('action', formAction);
        }
    });

    ICheck.init($('body'));

    $(document).on('click', '[type="button"][data-action="Delete"]', function () {
        ButtonExtension.confirmDelete($(this));
    });

    $(document).on('click', 'button.delete-ajax-datatble', function () {
        var $button = $(this);
        var $table = $button.closest('table');
        var reloadTable = function () {
            $table.DataTable().draw();
        };
        SAlert.DeleteAjaxConfirm($button.data('url'), null, reloadTable, null);
    });

    $(document).on('click', 'button.create-offer-ajax-datatble', function () {
        var $button = $(this);
        var redirect = function (data) {
            if (data.Data && data.Data.ReturnUrl)
                window.location.href = data.Data.ReturnUrl;
        };
        SAlert.CreateOfferAjaxConfirm($button.data('url'), null, redirect, null);
    });
    $(document).on('click', 'button.delete-ajax-item', function () {
        var $button = $(this);
        var redirect = function (data) {
            if(data.Data && data.Data.ReturnUrl)
                window.location.href = data.Data.ReturnUrl;
        };
        SAlert.DeleteAjaxConfirm($button.data('url'), null, redirect, null);
    });
});

