; (function ($, window, document, undefined) {
    var pluginName = 'limitWidgetCarousel',
        defaults = {

        };
    function LimitWidgetCarousel(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {

        };
        this.init();
    };
    LimitWidgetCarousel.prototype.init = function () {
        var instance = this;        
        var slidesToShow = JsHelper.isMobilePhone() ? 1 : ($(window).width() < 1000 ? ($(window).width() < 650 ? 1 : 2) : 4);
        var slidesToScroll = JsHelper.isMobilePhone() ? 1 : ($(window).width() < 1000 ? ($(window).width() < 650 ? 1 : 2) : 4);
        instance.$element.slick({
            slidesToShow: slidesToShow,
            slidesToScroll: slidesToScroll
        });
        $.ajax({
            type: "POST",
            url: "/LimitWidget/GetWidget",
            cache: false,
            data: {
                VisaibleOnDesktop: true                
            },
            async: true,
            success: function (response) {
                if (response.Success) {
                    response.Data.widgets.forEach((element, index, array) => {
                        instance.$element.slick('slickAdd', element.html);
                    });
                }               
            }
        });                        
        //var id = instance.$element.data('id');
        //var offerId = instance.$element.data('offerid');
        //var postfix = instance.$element.data('postfix');        
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
                new LimitWidgetCarousel(this, options));
            }
        });
    }
})(jQuery, window, document);
$(document).ready(() => {
    setInterval(() => {
        $('.limit-widget-carousel').limitWidgetCarousel({});
    }, 250);
});