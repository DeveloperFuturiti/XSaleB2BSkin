; (function ($, window, document, undefined) {
    var pluginName = 'addEditLimit',
        defaults = {

        };
    function AddEditLimit(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {

        };
        this.init();
    };
    AddEditLimit.prototype.init = function () {
        var instance = this;
        $('#user-selectlist').bootstrapDualListbox();
        $('#cost-center-select-list').bootstrapDualListbox();
        $('#branch-select-list').bootstrapDualListbox();
        instance.setlimitTypeVisibility();
        $(document).on('change', '#LimitType', function () {
            instance.setlimitTypeVisibility();
        });
        $(document).on('mouseover', '.bootstrap-duallistbox-container .filtered select', (e) => {
            $(e.currentTarget).focus();;
        });
        $(document).on('click', '.submit', function () {
            $('.bootstrap-duallistbox-container .clear1,.bootstrap-duallistbox-container .clear2').trigger('click');
            setTimeout(() => {
                var options = $('.user-container select[name="_helper2"]').find('option');
                var ids = '';
                for (var i = 0; i < options.length; i++) {
                    if (i > 0)
                        ids = ids + ',';
                    ids = ids + $(options[i]).attr('value');
                }
                $('#Users').val(ids);

                options = $('.cost-center-container select[name="_helper2"]').find('option');
                ids = '';
                for (var i = 0; i < options.length; i++) {
                    if (i > 0)
                        ids = ids + ',';
                    ids = ids + $(options[i]).attr('value');
                }
                $('#CostCenterIds').val(ids);

                options = $('.branch-container select[name="_helper2"]').find('option');
                ids = '';
                for (var i = 0; i < options.length; i++) {
                    if (i > 0)
                        ids = ids + ',';
                    ids = ids + $(options[i]).attr('value');
                }
                $('#BranchIds').val(ids);

                if ($('#LimitApplicationType').val() == 2) {
                    swal({
                        title: "",
                        text: 'W przypadku zastosowania limitu "Akceptacja kierownika" wymagane jest uzupełnienie kierownika akceptującego dla użytkowników których dotyczeć będzie limit.',
                        showConfirmButton: true,
                        type: "info"
                    }, function (isConfirm) {
                        if (isConfirm)
                            $('#limit-form').submit();
                    });
                } else
                    $('#limit-form').submit();
            }, 100);
            });        
    };
    AddEditLimit.prototype.setlimitTypeVisibility = function () {
        var instance = this;
        var limitType = $('#LimitType').val();
        if (limitType == 1) {
            $('.list-container').addClass('hidden');
            $('.user-container').removeClass('hidden');
        } else
            if (limitType == 2) {
                $('.list-container').addClass('hidden');
                $('.cost-center-container').removeClass('hidden');
            } else
                if (limitType == 3) {
                    $('.list-container').addClass('hidden');
                    $('.branch-container').removeClass('hidden');
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
                new AddEditLimit(this, options));
            }
        });
    }
})(jQuery, window, document);