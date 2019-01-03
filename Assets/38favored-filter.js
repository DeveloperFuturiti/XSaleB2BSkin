; (function ($, window, document, undefined) {
    var pluginName = 'favoredFilter',
        defaults = {

        };
    function FavoredFilter(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {

        };
        this.init();
    };
    FavoredFilter.prototype.init = function () {
        var instance = this;
        //instance.$element.on('keyup', 'input[type="text"].dot-format', function (e) {
        //    var $this = $(e.currentTarget);
        //    $this.val($this.val().replace(',', '.'));
        //});
        //instance.$element.on('focusout', 'input[type="text"]', function (e) {
        //    var $this = $(e.currentTarget);
        //    instance.FilterChanged($this);
        //});
        instance.$element.on('change', 'select, input[type="checkbox"]', function (e) {
            var $this = $(e.currentTarget);
            instance.FilterChanged($this);
        });
        //instance.$element.on('touchspin.on.stopspin', 'input[type="text"]', function (e) {
        //    var $this = $(e.currentTarget);
        //    instance.FilterChanged($this);
        //});
        //instance.$element.on('click', '.clear-filter', function (e) {
        //    var $this = $(e.currentTarget);
        //    $this.closest('.filter-item').find('input[type="radio"]').prop('checked', false).first().trigger('change');
        //});
    };

    FavoredFilter.prototype.FilterChanged = function ($item) {
        console.log('FavoredFilter changed');
        var instance = this;
             
        
        //aktualizacja linku

        //przeładowanie grida
        $(instance.options.articleGridSel).trigger('reload');
    };
    FavoredFilter.prototype.GetValue = function () {        
        var instance = this;        
        return instance.$element.find('input[type="checkbox"]').is(':checked');        
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
                new FavoredFilter(this, options));
            }
        });
    }
})(jQuery, window, document);
