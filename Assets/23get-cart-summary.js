; (function ($, window, document, undefined) {
    var pluginName = 'getCartSummary',
        defaults = {
        };
    function GetCartSummary(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {};
        this.init();
    };
    GetCartSummary.prototype.init = function () {
        var instance = this;
        instance.$element.on('reload', function () {
            instance.$element.empty();
            instance.load();
        });
        instance.load();
    };
    GetCartSummary.prototype.load = function () {
        var instance = this;
        var url = instance.$element.data('url');
        var id = instance.$element.data('cartid');        
        $.ajax({
            type: 'POST',
            url: url,
            cache: false,
            data: {
                id: id
            },
            xhr: function () {  // Custom XMLHttpRequest
                var myXhr = $.ajaxSettings.xhr();
                instance.showPreloader();
                return myXhr;
            },
            success: function (data) {
                instance.hidePreloader();
                if (data.Success) {                    
                        instance.$element.html(data.Data.html);                                            
                } else {
                    //Error message
                }                
            }
        });       
    };
    GetCartSummary.prototype.showPreloader = function () {
        var instance = this;
        instance.$element.parent().find('.preloader').show();
    };
    GetCartSummary.prototype.hidePreloader = function () {
        var instance = this;
        instance.$element.parent().find('.preloader').hide();
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
                new GetCartSummary(this, options));
            }
        });
    }
})(jQuery, window, document);
