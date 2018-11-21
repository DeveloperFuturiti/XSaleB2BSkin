; (function ($, window, document, undefined) {
    var pluginName = 'search',
        defaults = {
            opened:false
        };
    function Search(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {};
        this.init();
    };
    Search.prototype.init = function () {
        var instance = this;
        instance.$element.on('click', '.search-button', function (e) {
            var val = instance.$element.find('input[name="Search"]').val();
            instance.submitSearch(val);            
        });
        instance.$element.on('click', '.search-category-button', function (e) {
            var val = instance.$element.find('input[name="Search"]').val();
            var $this = $(e.currentTarget);
            var categoryName = $this.data('categoryname');
            var categoryId = $this.data('categoryid');
            instance.searchCategory(val, categoryName, categoryId);
        });
        instance.$element.on('keyup','input', function (e) {
            if (e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40 && e.keyCode != 13) {
                var $this = $(e.currentTarget);
                instance.queue($this.val());
            } else {
                if (e.keyCode == 13) {
                    var val = $(e.currentTarget).val();
                    instance.submitSearch(val);
                }
            }
        });
        //instance.$element.on('focusout', 'input', function (e) {
        //    instance.hideResultBox();
        //});
        $('body').on('click', ':not(.not-search)', function (e) {            
            var $this = $(e.currentTarget);
            var searchId = instance.$element.attr('id');
            var $searchParent = $this.parents('#' + searchId);
            if ($searchParent.length == 0) {                
                instance.hideResultBox();
            } else {
                e.stopPropagation();
            }
        });
        instance.$element.on('mousedown', 'input', function (e) {
            var $this = $(e.currentTarget);
            if (!$this.is(':focus') && instance.options.opened==false) {
                instance.queue($this.val());
            }            
        });
        //instance.$element.on('reload', function () {
        //    instance.$element.empty();
        //    instance.load();
        //});
        //instance.load();
    };
    Search.prototype.queue = function (queuedValue) {
        var instance = this;
        setTimeout(function () {
            var $input = instance.$element.find('.search');
            if (queuedValue == $input.val() && $input.val() != null && $input.val()!='') {
                instance.load($input.val());
            } else {
                if ($input.val() == '') {
                    instance.hideResultBox();
                }
            }
        }, 500);
    };
    Search.prototype.load = function (inputValue) {
        var instance = this;
        instance.showResultBox();
        //instance.$element.empty();
        var url = instance.$element.data('url');
        var favoredFilterVal = $(instance.options.favoredFilterSel).favoredFilter().GetValue();
        $.ajax({
            type: 'POST',
            url: url,
            cache: false,
            data: {
                value: inputValue,
                favoredFilter: favoredFilterVal
            },
            xhr: function () {  // Custom XMLHttpRequest
                var myXhr = $.ajaxSettings.xhr();
                instance.showPreloader();
                return myXhr;
            },
            success: function (data) {
                instance.hidePreloader();
                if (data.Success) {
                    instance.$element.find('li.result').remove();
                    instance.$element.find('li.divider').remove();
                    instance.$element.find('ul.result-box').append(data.Data.html);
                    //instance.$element.html(data.Data.html);
                } else {
                    //Error message
                }
            }
        });
    };
    Search.prototype.showResultBox = function () {
        var instance = this;
        var $input = instance.$element.find('.search');
        var $resultBox = instance.$element.find('.result-box');
        var additionalOffest = 45;
        $resultBox.width($input.width() + additionalOffest);
        instance.showPreloader();
        $resultBox.show();
        instance.options.opened = true;
    };
    Search.prototype.hideResultBox = function () {
        var instance = this;
        var $input = instance.$element.find('.search');
        var $resultBox = instance.$element.find('.result-box');
        setTimeout(function () {
            $resultBox.hide();
            instance.options.opened = false;
        }, 200);
    };
    Search.prototype.showPreloader = function () {
        var instance = this;
        instance.$element.find('li.result').hide();
        instance.$element.find('li.divider').hide();
        instance.$element.parent().find('.preloader').show();
    };
    Search.prototype.hidePreloader = function () {
        var instance = this;        
        instance.$element.parent().find('.preloader').hide();
        instance.$element.find('li.result').show();
        instance.$element.find('li.divider').show();
    };
    Search.prototype.searchCategory = function (value, categoryName, categoryId) {
        if (value != null && value != '') {            
            location = '/Towary/' + JsHelper.string.encodeSpecialCharactersMVCUrl(categoryName) + '/' + categoryId + '?Search=' + value;
        }
    };
    Search.prototype.submitSearch = function (value) {
        if (value != null && value != '') {
            var encodedValue = JsHelper.string.encodeSpecialCharactersMVCUrl2(value)
            var currentUrl = location.protocol + '//' + location.hostname + ':' + location.port + window.location.pathname;
            if (currentUrl.includes('/Towary/')) {
                location = currentUrl + '?Search=' + encodedValue;
            } else {
                location = '/Towary?Search=' + encodedValue;
            }
        }
    };
    $.fn[pluginName] = function (options) {
        if (this.length == 1) {
            var pluginData = this.data('plugin_' + pluginName);
            if (pluginData)
                return pluginData;
        }
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Search(this, options));
            }
        });
    }
})(jQuery, window, document);
