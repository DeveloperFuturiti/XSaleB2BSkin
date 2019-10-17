; (function ($, window, document, undefined) {
    var pluginName = 'cart',
        defaults = {
            
        };
    function Cart(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {
            
        };
        this.init();
    };
    Cart.prototype.init = function () {
        var instance = this;
        instance.references.getDataUrl = instance.$element.data('url');
        $(document).on('click', 'button.add-to-cart', function () {
            var $this = $(this);
            var articleId = $this.data('articleid');
            var $container = $this.closest('.add-to-cart-container');
            var $stock = $container.find('button.available-stock-state');
            var $quantity = $container.find('input.add-to-cart-quantity');
            var maxPrecision = $this.data('unit-rounding');
            var precisionValidationResult = validateMaxPrecisionInput($quantity.val(), maxPrecision);
            if (!precisionValidationResult) {
                swal("", "Maksymalna precyzja dla tej jednostki wynosi: " + maxPrecision + " miejsc po przecinku.", "warning");
                return;
            }
            $.ajax({
                type: 'POST',
                url: '/Cart/AddArticle',
                cache: false,
                data: {
                    id: articleId,
                    quantity: $quantity.val()
                },
                success: function (data) {
                    if (data.Success) {
                        instance.updateMainCart(data.Data.cartId, data.Data.cartItems);
                        ToastrNotification.showNotification('success', 'Dodano do koszyka');
                    } else {
                    }
                }
            });
        });
        instance.$element.on('click', 'span.description', function () {
            var $this = $(this);
            var cartId = $this.data('cartid');
            location = '/Koszyk/' + cartId;
        });
        instance.$element.on('click', 'div.description', function (e) {
            if ($(e.target).is('label')||$(e.target).is('input')) {

            } else {
                var $this = $(this);
                var cartId = $this.data('cartid');
                location = '/Koszyk/' + cartId;
            }
        });
        instance.$element.on('click', '.dropdown-toggle', function () {
            instance.loadCartList();
        });
        instance.$element.on('click', 'a.add-cart', function () {
            instance.addCart();
        });
        instance.$element.on('click', 'span.remove-cart', function (event) {
            event.stopPropagation();
            var $this = $(this);
            var cartId = $this.data('cartid');           
            swal({
                title: 'Potwierdzenie',
                text: 'Czy na pewno chcesz usunąć koszyk?',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: 'Tak',
                closeOnConfirm: true,
                cancelButtonText: 'Nie',
                html: true
            }, function (isConfirm) {
                if (isConfirm) {
                    instance.deleteCart(cartId);
                }
            });
        });
        instance.$element.on('change', 'input[type="radio"]', function () {
            var $this = $(this);
            var selectedCart = $this.val();
            instance.selectCart(selectedCart);
        });
        instance.$element.on('reload', function () {
            instance.reloadMainCart();
        });

        validateMaxPrecisionInput = function (input, maxPrecision) {
            if (!input) {
                return true;
            } else if (input.indexOf(",") == -1) {
                return true;
            } else {
                let actualPrecision = input.split(",")[1].length;
                return actualPrecision <= maxPrecision;
            }
        }
    };
    Cart.prototype.loadCartList = function () {
        var instance = this;
        instance.$element.find('.cart-container, .divider').remove();
        $.ajax({
            type: 'POST',
            url: instance.references.getDataUrl,
            cache: false,
            data: {
                //PageNumber: instance.references.pageNumber,
                //PageSize: instance.references.pageSize,
                //Limit: instance.references.limit,
                //ColumnNumber: instance.references.columnNumber,
                //ItemWidth: instance.references.itemWidth,
                //CategoryId: instance.options.selectedCategoryId,
                //Filters: serializedFilter.Filters
            },
            xhr: function () {  // Custom XMLHttpRequest
                var myXhr = $.ajaxSettings.xhr();
                instance.showPreloader();
                return myXhr;
            },
            success: function (data) {
                instance.$element.find('.cart-container, .divider').remove();
                if (data.Success) {                    
                    instance.$element.find('.dropdown-menu').prepend(data.Data.html);
                } else {                    
                    //Error message
                }
                instance.hidePreloader();
            }
        });
    };
    Cart.prototype.reloadMainCart = function () {
        var instance = this;
        $.ajax({
            type: 'POST',
            url: '/Cart/ReloadMainCart',
            cache: false,
            data: {
            },
            success: function (data) {
                if (data.Success) {
                    instance.updateMainCart(data.Data.cartId, data.Data.cartItems);
                } else {
                }
            }
        });
    };
    Cart.prototype.addCart = function () {
        var instance = this;
        $.ajax({
            type: 'POST',
            url: '/Cart/AddCart',
            cache: false,
            data: {
            },
            success: function (data) {
                if (data.Success) {
                    instance.updateMainCart(data.Data.cartId, data.Data.cartItems);
                } else {
                }
            }
        });
    };
    Cart.prototype.selectCart = function (selectedCart) {
        var instance = this;
        $.ajax({
            type: 'POST',
            url: '/Cart/SelectCart',
            cache: false,
            data: {
                id: selectedCart
            },
            success: function (data) {
                if (data.Success) {
                    instance.updateMainCart(selectedCart,data.Data.cartItems);
                } else {
                }
            }
        });
    };
    Cart.prototype.deleteCart = function (selectedCart) {
        var instance = this;
        $.ajax({
            type: 'POST',
            url: '/Cart/DeleteCart',
            cache: false,
            data: {
                id: selectedCart
            },
            success: function (data) {
                if (data.Success) {
                    instance.updateMainCart(data.Data.cartId, data.Data.cartItems);
                    var cartIdView = $(document).find('#cart-details').data('id');
                    if (cartIdView == null)
                        cartIdView = $(document).find('#cart-summary').data('id');
                    if (cartIdView != null && cartIdView == selectedCart) {
                        instance.options.finalized = true;
                        //swal({//Można włączyć jeszcze potwierdzenie usunięcia koszyka na 3 sek
                        //    title: "",
                        //    text: 'Koszyk został usunięty',
                        //    timer: 3 * 1000,
                        //    showConfirmButton: true,
                        //    type: "success",
                        //    html: true,
                        //    //showCancelButton: true,
                        //    //cancelButtonText: 'OK'
                        //}, function () {
                        //    location = '/';
                        //});
                        //setTimeout(() => { location = '/'; }, 3 * 1000);
                        location = '/';//Albo tylko przeniesienie do strony głównej
                    }
                } else {
                    console.log(data.Data.Errors);
                    SAlert.Warning(data.Data.ErrorMessage);
                }
            }
        });
    };
    Cart.prototype.updateMainCart = function (id, number) {
        var instance = this;
        instance.$element.attr('data-defaultcart', id);        
        instance.$element.find('span.cart-items').text(number);
    };
    Cart.prototype.showPreloader = function () {
        var instance = this;
        instance.$element.find('.preloader').show();
    };
    Cart.prototype.hidePreloader = function () {
        var instance = this;
        instance.$element.find('.preloader').hide();
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
                new Cart(this, options));
            }
        });
    }
})(jQuery, window, document);
