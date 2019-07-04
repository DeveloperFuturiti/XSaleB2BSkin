var GlobalPriceCache = {
    requestStarted: [],
    store: {
    }
}
; (function ($, window, document, undefined) {
    var pluginName = 'asynchronousPrice',
        defaults = {

        };
    function AsynchronousPrice(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {

        };
        this.init();
    };
    AsynchronousPrice.prototype.init = function () {
        var instance = this;
        var id = instance.$element.data('id');
        var offerId = instance.$element.data('offerid');
                
        if (GlobalPriceCache.requestStarted.indexOf(id) > -1) {
            var waitForData = setInterval(() => {
                var cacheArticlePrice = GlobalPriceCache.store[id];
                if (cacheArticlePrice != null) {
                    clearInterval(waitForData);
                    instance.renderPrice(GlobalPriceCache.store[id]);
                }
            }, 250);
        } else {
            GlobalPriceCache.requestStarted.push(id);
            $.ajax({
                type: "POST",
                url: "/Article/GetPrice",
                cache: false,
                data: {
                    id: id,
                    offerId: offerId//Pole opcjonalne, optymalizacja wydajności                
                },
                async: true,
                success: function (response) {
                    GlobalPriceCache.store[id] = response;
                    instance.renderPrice(GlobalPriceCache.store[id]);
                    //console.log('id: '+id +' - '+ response.Data.price.Price + ' ' + response.Data.price.Currency);
                }
            });
        }
    }

    AsynchronousPrice.prototype.renderPrice = function (response) {
        var instance = this;
        var grossPrice = instance.$element.hasClass('gross');
        var postfix = instance.$element.data('postfix');
        if (response.Data.price.Price != null)
            instance.$element.text((grossPrice ? JsHelper.number.FormatTwoPlacesAndColon(response.Data.price.GrossPrice) : JsHelper.number.FormatTwoPlacesAndColon(response.Data.price.Price) ) + ' ' + response.Data.price.Currency + (postfix != null ? postfix : ''));
    }
    AsynchronousPrice.prototype.getPrice = function (id, offerId) {
        var instance = this;

    }
    $.fn[pluginName] = function (options) {
        if (this.length == 1) {
            var pluginData = this.data('plugin_' + pluginName);
            if (pluginData)
                return pluginData;
        }
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new AsynchronousPrice(this, options));
            }
        });
    }
})(jQuery, window, document);