; (function ($, window, document, undefined) {
    var pluginName = 'cartAddress',
        defaults = {

        };
    function CartAddress(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {

        };
        this.init();
    };

    CartAddress.prototype.init = function () {
        var instance = this;

        $(instance.options.addressSelectBoxSel).on('select2:select', function (e) {
            instance.updateAddressForm(e.params.data.id);
        });

        $(instance.options.editBtnSel).on('click', function (e) {
            var $btn = $(instance.options.editBtnSel);
            var type = $btn.data('type');
            if (type === 'edit') {//klikniecie EDIT
                instance.enableEdit();
                $btn.data('type', 'save');
                $btn.html('Zapisz');
                $(instance.options.cancelEditBtnSel).show();
                $(instance.options.addressSelectBoxSel).prop('disabled', true);
                $(instance.options.newBtnSel).hide();
            } else if (type === 'save') {//klikniecie SAVE
                if ($(instance.options.addressFormSel).valid()) {
                    instance.updateAddress();
                    $btn.data('type', 'edit');
                    $btn.html('Edytuj');
                    instance.disableEdit();
                    $(instance.options.cancelEditBtnSel).hide();
                    $(instance.options.addressSelectBoxSel).prop('disabled', false);
                    $(instance.options.newBtnSel).show();
                }
            }
        });

        $(instance.options.cancelEditBtnSel).on('click', function (e) {
            var $btn = $(instance.options.editBtnSel);
            var $btnNew = $(instance.options.newBtnSel);
            instance.disableEdit();
            $btn.data('type', 'edit');
            $btn.html('Edytuj');
            $(instance.options.cancelEditBtnSel).hide();
            $(instance.options.addressSelectBoxSel).prop('disabled', false);
            var addressId = $(instance.options.addressFormSel).find('[name=Id]').val();
            var isFromCustomer = $(instance.options.addressFormSel).find('[name=IsFromCustomer]').val() === "true";
            $btnNew.data('type', 'new');
            $btnNew.html('Nowy');
            $(instance.options.editBtnSel).show();
            $(instance.options.newBtnSel).show();
            if (!isFromCustomer) {
                instance.updateAddressForm(addressId);
            } else {
                instance.updateAddressForm(null);
            }
        });

        $(instance.options.newBtnSel).on('click', function (e) {
            var $btn = $(instance.options.newBtnSel);
            var type = $btn.data('type');
            if (type === 'new') {//klikniecie NEW
                instance.setAddress({ Country: instance.options.defaultCountry});
                instance.enableEdit();
                $btn.data('type', 'save');
                $btn.html('Zapisz');
                $(instance.options.cancelEditBtnSel).show();
                $(instance.options.addressSelectBoxSel).prop('disabled', true);
                $(instance.options.editBtnSel).hide();
            } else if (type === 'save') {//klikniecie SAVE
                if ($(instance.options.addressFormSel).valid()) {
                    $(instance.options.addressFormSel).find('[name=Id]').val(null);
                    $(instance.options.addressFormSel).find('[name=IsFromCustomer]').val(null);
                    instance.updateAddress();
                    instance.disableEdit();
                    $btn.data('type', 'new');
                    $btn.html('Nowy');
                    $(instance.options.cancelEditBtnSel).hide();
                    $(instance.options.addressSelectBoxSel).prop('disabled', false);
                    $(instance.options.editBtnSel).show();
                }
            }
        });

    };

    CartAddress.prototype.updateAddressForm = function (addressId) {
        var instance = this;
        $.ajax({
            type: 'GET',
            url: '/Cart/GetAddress',
            cache: false,
            data: { id: addressId, cartId: instance.options.cartId },
            async: false,
            success: function (data) {
                instance.setAddress(data, true);
                $(instance.options.addressFormSel).valid();
            }
        });
    }

    CartAddress.prototype.updateAddress = function () {
        var instance = this;
        var $form = $(instance.options.addressFormSel);
        var serializedForm = $form.serialize();
        $.ajax({
            type: 'POST',
            url: '/Cart/AddressDataSave',
            cache: false,
            data: serializedForm,
            async: false,
            success: function (data) {
                console.log(data);
                if (data.Data.addedNewAddress && data.Data.addressId !== null) {
                    instance.updateAddressForm(data.Data.addressId);
                }
            }
        });
    }

    CartAddress.prototype.setAddress = function (address, updateIds) {
        $(this.options.addressFormSel).find('[name=Name]').val(address.Name)
        $(this.options.addressFormSel).find('[name=MobilePhone]').val(address.MobilePhone)
        $(this.options.addressFormSel).find('[name=Phone]').val(address.Phone)
        $(this.options.addressFormSel).find('[name=Email]').val(address.Email)
        $(this.options.addressFormSel).find('[name=Street]').val(address.Street)
        $(this.options.addressFormSel).find('[name=StreetNumber]').val(address.StreetNumber)
        $(this.options.addressFormSel).find('[name=ZipCode]').val(address.ZipCode)
        $(this.options.addressFormSel).find('[name=Post]').val(address.Post)
        $(this.options.addressFormSel).find('[name=City]').val(address.City)
        $(this.options.addressFormSel).find('[name=Voivodeship]').val(address.Voivodeship)
        $(this.options.addressFormSel).find('[name=Country]').val(address.Country)
        if (updateIds) {
            $(this.options.addressFormSel).find('[name=CartId]').val(address.CartId)
            $(this.options.addressFormSel).find('[name=Id]').val(address.Id)
            $(this.options.addressFormSel).find('[name=IsFromCustomer]').val(address.IsFromCustomer)
        }
    }

    CartAddress.prototype.enableEdit = function() {
        var fields = this.getAllFilelds();
        fields.forEach(elem => {
            elem.removeAttr('readonly');
        });
    }

    CartAddress.prototype.disableEdit = function () {
        var fields = this.getAllFilelds();
        fields.forEach(elem => {
            elem.attr('readonly', 'readonly');
        });
    }

    CartAddress.prototype.getAllFilelds = function() {
        var arr = [];
        arr.push($(this.options.addressFormSel).find('[name=Name]'));
        arr.push($(this.options.addressFormSel).find('[name=MobilePhone]'));
        arr.push($(this.options.addressFormSel).find('[name=Phone]'));
        arr.push($(this.options.addressFormSel).find('[name=Email]'));
        arr.push($(this.options.addressFormSel).find('[name=Street]'));
        arr.push($(this.options.addressFormSel).find('[name=StreetNumber]'));
        arr.push($(this.options.addressFormSel).find('[name=ZipCode]'));
        arr.push($(this.options.addressFormSel).find('[name=Post]'));
        arr.push($(this.options.addressFormSel).find('[name=City]'));
        arr.push($(this.options.addressFormSel).find('[name=Voivodeship]'));
        arr.push($(this.options.addressFormSel).find('[name=Country]'));

        return arr;
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
                new CartAddress(this, options));
            }
        });
    }
})(jQuery, window, document);
