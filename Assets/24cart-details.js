; (function ($, window, document, undefined) {
    var pluginName = 'cartDetails',
        defaults = {
        };
    function CartDetails(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {};
        this.init();
    };
    CartDetails.prototype.init = function () {
        var instance = this;
        instance.references.$additionalDataForm = $(instance.options.additionalDataFormSel);
        instance.references.$cartSummary = $(instance.options.cartSummarySel);
        instance.references.$additionalDataForm.on('change', 'select', function (e) {
            instance.submitAdditionalDataForm.apply(instance, [true, true]);
        });
        instance.references.$additionalDataForm.on('focusout', 'input[type="text"], textarea[type="text"]', function (e) {
            instance.submitAdditionalDataForm();            
        });
        instance.$element.on('click', '.remove-article', function () {
            var t = this;
            var $this = $(this);
            var id = $this.data('id');            
            swal({
                title: 'Potwierdzenie',
                text: 'Czy na pewno chcesz usunąć wybrany towar z koszyka?',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: 'Tak',
                closeOnConfirm: true,
                cancelButtonText: 'Nie',
                html: true
            }, function (isConfirm) {
                if (isConfirm) {
                    instance.deleteItem(id, $this);
                }
            });
        });
        instance.$element.on('focusout', 'input[type="text"].ordered-quantity', function (e) {
            var $this = $(e.currentTarget);
            instance.articleQuantityChanged($this);
        });        
        instance.$element.on('touchspin.on.stopspin', 'input[type="text"].ordered-quantity', function (e) {
            var $this = $(e.currentTarget);
            instance.articleQuantityChanged($this);
        });
        instance.$element.on('click', '.realize-discound-code', function (e) {
            var $this = $(e.currentTarget);
            var cartId = $this.data('id');
            var value = $this.closest('input[type="text"].discount-code').val();
            instance.references.$cartSummary.trigger('reload');
            instance.realizeDiscountCode(cartId,value);
        });
        instance.$element.on('click', '.go-to-summary', function (e) {
            var $this = $(e.currentTarget);
            var id = $this.closest('.cart-details').data('id');
            if (instance.validateAdditionalDataForm()) {
                location = '/Koszyk/Podsumowanie/' + id;
            }                
        });
        instance.$element.on('click', '.send-offer', function (e) {
            var $this = $(e.currentTarget);
            var id = $this.closest('.cart-details').data('id');
            if (instance.submitAdditionalDataForm.apply(instance, [false, false])) {
                //send
            } else {
                //komunikat o błędzie zapisu lub walidacji
            }
        });      
        window.onbeforeunload = function () {
            if (!instance.submitAdditionalDataForm.apply(instance, [false, false])) {
                return 'Błąd podczas zapisu danych zamówienia';
            }            
        };        
    };
    CartDetails.prototype.deleteItem = function (id, $url) {
        var instance = this;
        $.ajax({
            type: 'POST',
            url: '/Cart/DeleteItem',
            cache: false,
            data: {
                id: id
            },
            success: function (data) {
                if (data.Success) {
                    instance.references.$cartSummary.trigger('reload');
                    $('#cart-navbar').trigger('reload');
                    var $item = $url.closest('#cart-item-' + id);
                    $item.closest('.ibox').find('.ibox-title strong.order-items').text(data.Data.cartItems);
                    $item.remove();
                    //Reload pozycje koszyka                    
                    
                } else {

                }
            }
        });
    };
    CartDetails.prototype.submitAdditionalDataForm = function (async,reloadSummary) {
        var instance = this;
        if (instance.validateAdditionalDataForm()) {                        
            var id = instance.$element.data('id');
            var formSerialized = instance.references.$additionalDataForm.serialize();
            formSerialized.Id = id;
            var result = $.ajax({
                type: 'POST',
                url: '/Cart/AdditionalData',
                cache: false,
                data: formSerialized,
                async: async!=null?async:true,
                success: function (data) {                    
                    if (data.Success) {
                    } else {                        
                    }
                    if (reloadSummary==true) {
                        instance.references.$cartSummary.trigger('reload');
                    }
                }
            });
            if (async != null && async==false) {
                if (result != null && result.responseJSON !=null&& result.responseJSON.Success) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        }
        return false;
    };
    CartDetails.prototype.articleQuantityChanged = function ($field) {
        var instance = this;
        var id = $field.data('id');
        var quantity = $field.val();
        $.ajax({
            type: 'POST',
            url: '/Cart/ArticleQuantityChanged',
            cache: false,
            data: {
                id: id,
                quantity: quantity
            },
            async:true,
            success: function (data) {
                if (data.Success) {
                    if (data.Data.orderedQuentity>data.Data.availableQuantity) {
                        $field.closest('.shoping-cart-table').find('.available-quantity-alert').show();
                    } else {
                        $field.closest('.shoping-cart-table').find('.available-quantity-alert').hide();
                    }
                    if (data.Data.articleMinimalQuantity > data.Data.orderedQuentity) {
                        $field.closest('.shoping-cart-table').find('.minimal-quantity-alert').show();
                    } else {
                        $field.closest('.shoping-cart-table').find('.minimal-quantity-alert').hide();
                    }
                    $field.closest('.shoping-cart-table').find('.total-price').text(data.Data.totalPrice != null ? data.Data.totalPrice : '');
                    instance.references.$cartSummary.trigger('reload');
                } else {
                }
            }
        });
    };
    CartDetails.prototype.realizeDiscountCode = function (cartId, code) {
        var instance = this;        
        $.ajax({
            type: 'POST',
            url: '/Cart/RealizeDiscountCode',
            cache: false,
            data: {
                id: cartId,
                code: code
            },
            async:true,
            success: function (data) {
                if (data.Success) {                    
                    instance.references.$cartSummary.trigger('reload');
                } else {
                }
            }
        });
    };
    CartDetails.prototype.validateAdditionalDataForm = function () {
        var instance = this;
        return instance.references.$additionalDataForm.valid();
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
                new CartDetails(this, options));
            }
        });
    }
})(jQuery, window, document);
