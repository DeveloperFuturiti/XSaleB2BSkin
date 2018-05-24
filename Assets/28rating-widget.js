; (function ($, window, document, undefined) {
    var pluginName = 'rateWidget',
        defaults = {
            rateStars: 0,
            myRateStars: 0
        };
    function RateWidget(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {

        };
        this.init();
    };
    RateWidget.prototype.init = function () {
        var instance = this;
        //instance.references.getDataUrl = instance.$element.data('url');
        instance.load();        
        //$(document).on('click', 'button.add-to-cart', function () {
        //    var $this = $(this);
        //    var articleId = $this.data('articleid');
        //    var $container = $this.closest('.add-to-cart-container');
        //    var $stock = $container.find('button.available-stock-state');
        //    var $quantity = $container.find('input.add-to-cart-quantity');
        //    $.ajax({
        //        type: 'POST',
        //        url: '/Cart/AddArticle',
        //        cache: false,
        //        data: {
        //            id: articleId,
        //            quantity: $quantity.val()
        //        },
        //        success: function (data) {
        //            if (data.Success) {
        //                instance.updateMainCart(data.Data.cartId, data.Data.cartItems);
        //            } else {
        //            }
        //        }
        //    });

        //});
        instance.$element.on('click', '.stars-interactive .fa', function () {
            var $this = $(this);
            var number = $this.data('starnumber');
            instance.options.myRateStars = number;
            instance.setMyRateStars(number);
            instance.rate(number);
            //wysyłam ajaxem
            // z odpowiedszi ustawiam jeszcze raz
            //instance.options.myRateStars = number;
            //instance.setMyRateStars(number);
        });
        instance.$element.on('mouseenter', '.stars-interactive .fa', function () {
            var $this = $(this);
            var number = $this.data('starnumber');
            instance.setMyRateStars(number);            
        });
        instance.$element.on('mouseleave', '.stars-interactive .fa', function () {
            var $this = $(this);
            var number = $this.data('starnumber');
            instance.setMyRateStars(instance.options.myRateStars);            
        });
        //instance.$element.on('click', '.dropdown-toggle', function () {
        //    instance.loadCartList();
        //});
        //instance.$element.on('click', 'a.add-cart', function () {
        //    instance.addCart();
        //});
        //instance.$element.on('click', 'span.remove-cart', function () {
        //    var $this = $(this);
        //    var cartId = $this.data('cartid');
        //    swal({
        //        title: 'Potwierdzenie',
        //        text: 'Czy na pewno chcesz usunąć koszyk?',
        //        type: "warning",
        //        showCancelButton: true,
        //        confirmButtonColor: "#DD6B55",
        //        confirmButtonText: 'Tak',
        //        closeOnConfirm: true,
        //        cancelButtonText: 'Nie',
        //        html: true
        //    }, function (isConfirm) {
        //        if (isConfirm) {
        //            instance.deleteCart(cartId);
        //        } else {
        //        }
        //    });
        //});
        //instance.$element.on('change', 'input[type="radio"]', function () {
        //    var $this = $(this);
        //    var selectedCart = $this.val();
        //    instance.selectCart(selectedCart);
        //});
        //instance.$element.on('reload', function () {
        //    instance.reloadMainCart();
        //});
    };
    RateWidget.prototype.load = function () {
        var instance = this;
        var url = instance.$element.data('loadratingurl');
        var offerId = instance.$element.data('offerid');
        $.ajax({
            type: 'POST',
            url: url,
            cache: false,
            data: {
                offerId: offerId
            },
            //xhr: function () {  // Custom XMLHttpRequest
            //    var myXhr = $.ajaxSettings.xhr();
            //    instance.showPreloader();
            //    return myXhr;
            //},
            success: function (data) {
                if (data.Success) {                    
                    instance.setRateStars(data.Data.rate, data.Data.votes);
                    instance.options.myRateStars = data.Data.myRate;
                    instance.setMyRateStars(data.Data.myRate);
                }
            }
        });        
    };
    RateWidget.prototype.rate = function (rate) {
        var instance = this;
        var url = instance.$element.data('rateofferurl');
        var offerId = instance.$element.data('offerid');
        $.ajax({
            type: 'POST',
            url: url,
            cache: false,
            data: {
                offerId: offerId,
                rate: rate
            },
            //xhr: function () {  // Custom XMLHttpRequest
            //    var myXhr = $.ajaxSettings.xhr();
            //    instance.showPreloader();
            //    return myXhr;
            //},
            success: function (data) {
                if (data.Success) {
                    instance.setRateStars(data.Data.rate, data.Data.votes);
                    //instance.options.myRateStars = data.Data.myRate;
                    //instance.setMyRateStars(data.Data.myRate);
                }
            }
        });        
    };
    RateWidget.prototype.setRateStars = function (number,votes) {
        var instance = this;
        var $stars = instance.$element.find('.stars-inactive .fa');
        $stars.removeClass('fa-star-half-o').removeClass('fa-star');
        $stars.addClass('fa-star-o');
        var ceiling = Math.ceil(number);
        var floor = Math.floor(number);
        var diff = number - floor;
        for (var i = 1; i <= ceiling; i++) {            
            if (i == ceiling && i != number && diff < 0.6) {
                instance.$element.find('.stars-inactive .fa[data-starnumber="' + i + '"]').removeClass('fa-star-o').removeClass('fa-star').addClass('fa-star-half-o');
            } else {
                instance.$element.find('.stars-inactive .fa[data-starnumber="' + i + '"]').removeClass('fa-star-o').removeClass('fa-star-half-o').addClass('fa-star');
            }
        }
        if (votes != null) {
            number = diff > 0 ? Number(number).toFixed(1) : number;
            instance.$element.find('.average').text(number + ' (' + votes + ')');
        }
    };
    RateWidget.prototype.setMyRateStars = function (number) {
        var instance = this;
        var $stars = instance.$element.find('.stars-interactive .fa');
        $stars.removeClass('fa-star-half-o').removeClass('fa-star');
        $stars.addClass('fa-star-o');
        for (var i = 1; i <= number; i++) {
                instance.$element.find('.stars-interactive .fa[data-starnumber="' + i + '"]').removeClass('fa-star-o').removeClass('fa-star-half-o').addClass('fa-star');
        }
    };
    //RateWidget.prototype.reloadMainCart = function () {
    //    var instance = this;
    //    $.ajax({
    //        type: 'POST',
    //        url: '/Cart/ReloadMainCart',
    //        cache: false,
    //        data: {
    //        },
    //        success: function (data) {
    //            if (data.Success) {
    //                instance.updateMainCart(data.Data.cartId, data.Data.cartItems);
    //            } else {
    //            }
    //        }
    //    });
    //};
    //RateWidget.prototype.addCart = function () {
    //    var instance = this;
    //    $.ajax({
    //        type: 'POST',
    //        url: '/Cart/AddCart',
    //        cache: false,
    //        data: {
    //        },
    //        success: function (data) {
    //            if (data.Success) {
    //                instance.updateMainCart(data.Data.cartId, data.Data.cartItems);
    //            } else {
    //            }
    //        }
    //    });
    //};    
    $.fn[pluginName] = function (options) {
        if (this.length == 1) {
            var pluginData = this.data('plugin_' + pluginName);
            if (pluginData)
                return pluginData;
        }
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new RateWidget(this, options));
            }
        });
    }
})(jQuery, window, document);
