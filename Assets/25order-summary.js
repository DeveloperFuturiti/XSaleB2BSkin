; (function ($, window, document, undefined) {
    var pluginName = 'orderSummary',
        defaults = {
            finalized: false
        };
    function OrderSummary(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {};
        this.init();
    };
    OrderSummary.prototype.init = function () {
        var instance = this;
        instance.$element.on('click', '.repeat-order', function (e) {
            var $this = $(e.currentTarget);
            var id = $this.closest('.cart-details').data('id');            
            instance.finalizeOrder();                             
        });        
    };
    OrderSummary.prototype.finalizeOrder = function () {
        var instance = this;
        var id = instance.$element.data('id');
        var result = $.ajax({
            type: 'POST',
            url: '/Order/RepeatOrder',
            cache: false,
            data: { id: id },
            async: false,
            success: function (data) {
                if (data.Success) {
                    location = '/Koszyk/' + data.Data.id;
                }
            }
        });
        if (result == null && result.responseJSON == null)
            return false;
        else
            return result.responseJSON.Success;
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
                new OrderSummary(this, options));
            }
        });
    }
})(jQuery, window, document);
