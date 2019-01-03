; (function ($, window, document, undefined) {
    var pluginName = 'limitWidgetIndex',
        defaults = {

        };
    function LimitWidgetIndex(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {

        };
        this.init();
    };
    LimitWidgetIndex.prototype.init = function () {
        var instance = this;        
        $.ajax({
            type: "POST",
            url: "/LimitWidget/GetWidget",
            cache: false,
            data: {
                VisaibleOnDesktop: null
            },
            async: true,
            success: function (response) {
                if (response.Success) {
                    response.Data.widgets.forEach((element, index, array) => {
                        instance.$element.append(element.html);
                    });
                }
            }
        });        
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
                new LimitWidgetIndex(this, options));
            }
        });
    }
})(jQuery, window, document);
$(document).ready(() => {    
    $('.limit-widget-index').limitWidgetIndex({});    
});