; (function ($, window, document, undefined) {
    var pluginName = 'articleSort',
        defaults = {

        };
    function ArticleSort(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {

        };
        this.init();
    };
    ArticleSort.prototype.init = function () {
        var instance = this;
        
        $(document).on('change', instance.options.orderByBtnSel, function (e) {
            var $this = $(e.currentTarget);
            instance.OrderByBtnClicked($this);
        });

        $(document).on('click', instance.options.orderByChckSel, function (e) {
            var $this = $(e.currentTarget);
            instance.TriggerArticleGridReload($this);
        });

        $(document).on('click', instance.options.sortBoxOnlyAvailableChckSelector, function (e) {
            var chcked = $(instance.options.sortBoxOnlyAvailableChckSelector).is(':checked');
            Cookies.setCookie('sortBoxFavoredChck', chcked, 365);
        });

        var sortBoxOnlyAvailableChckValue = Cookies.getCookie('sortBoxFavoredChck');
        $(instance.options.sortBoxOnlyAvailableChckSelector).prop('checked', sortBoxOnlyAvailableChckValue === "true");
    };

    ArticleSort.prototype.TriggerArticleGridReload = function ($this) {
        $(this.options.articleGridSel).trigger('reload');
    }

    ArticleSort.prototype.OrderByBtnClicked = function ($this) {
        //var $allBtns = $(this.options.orderByBtnSel);

        //if ($this.hasClass('btn-primary')) {
        //    $this.removeClass('btn-primary').addClass('btn-white');
        //} else {
        //    $allBtns.removeClass('btn-primary');
        //    $allBtns.addClass('btn-white');
        //    $this.removeClass('btn-white').addClass('btn-primary');
        //}

        $(this.options.articleGridSel).trigger('reload');
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
                new ArticleSort(this, options));
            }
        });
    }
})(jQuery, window, document);