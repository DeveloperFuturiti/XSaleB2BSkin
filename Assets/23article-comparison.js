; (function ($, window, document, undefined) {
    var pluginName = 'articleComparison',
        defaults = {

        };
    function ArticleComparison(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {

        };
        this.init();
    };
    ArticleComparison.prototype.init = function () {
        var instance = this;        
        $(document).on('change', 'input.select-article', function (e) {
            var $element = $(this);
            var articleId = $element.data('articleid');
            setTimeout(() => {
                if ($element.is(':checked')) {
                    if (instance.AddToComparison(articleId) === true) {

                    } else {
                        $element.iCheck('uncheck');
                    }
                } else {
                    instance.RemovedFromComparison(articleId);
                }                
            }, 0);
        });
        instance.$element.on('click', '.remove', (e) => {
            var $element = $(e.currentTarget);
            var articleId = $element.data('id');
            setTimeout(() => {
                if (instance.RemovedFromComparison(articleId)) {
                    instance.LoadArticlesToCompare();
                    $('input[name="select-article-' + articleId + '"]').iCheck('uncheck');
                }
            }, 0)
        });
        instance.$element.on('click', '.show-comparison-box-icon', (e) => {
            var $box = instance.$element.find('.comparison-tab-box');
            var comparisonExpanded = $box.hasClass('show');
            if (comparisonExpanded) {
                $box.removeClass('show');
            } else {
                $box.addClass('show');
            }
            instance.SetComparisonPreviewState(!comparisonExpanded);
        });
        instance.$element.on('click', '.reset', (e) => {
            instance.ResetComparison();
        });
        setTimeout(() => { instance.LoadArticlesToCompare(); },500)
    };
    ArticleComparison.prototype.AddToComparison = function (articleId) {
        var instance = this;
        var data = $.ajax({
            type: "POST",
            url: "/Article/AddToComparison",
            cache: false,
            data: { articleId: articleId },
            async: false
        });
        if (data != null && data.responseJSON.Success) {
            if (data.responseJSON.Data.added === true) {
                ToastrNotification.showNotification('success', 'Dodano do porównania');
                instance.LoadArticlesToCompare();
            } else {
                ToastrNotification.showNotification('error', data.responseJSON.Data.errorMessage);              
            }
            return data.responseJSON.Data.added;
        } else {           
            SAlert.Error2('', data.responseJSON.Errors);
            return false;
        }
    };
    ArticleComparison.prototype.RemovedFromComparison = function (articleId) {
        var instance = this;
        var data = $.ajax({
            type: "POST",
            url: "/Article/RemovedFromComparison",
            cache: false,
            data: { articleId: articleId },
            async: false
        });
        if (data != null && data.responseJSON.Success) {
            if (data.responseJSON.Data.removed === true) {
                ToastrNotification.showNotification('warning', 'Usunięto z porównywarki');
                //odznaczenie checkboxow
                instance.LoadArticlesToCompare();
            } else {
                                
            }
            return data.responseJSON.Data.removed;
        } else {
            SAlert.Error2('', data.responseJSON.Errors);
            return false;
        }
    };
    ArticleComparison.prototype.LoadArticlesToCompare = function () {
        var instance = this;
        var $content = instance.$element.find('.selected-to-compare .item.content');
        $.ajax({
            type: "POST",
            url: "/Article/GetComparisonPreview",
            cache: false,
            data: {  },
            async: false,
            success: function (response) {
                var $button = instance.$element.find('.show-comparison-box-icon');
                if (response.Data.Visible)
                    $button.removeClass('hidden');
                else
                    $button.addClass('hidden');
                var $box = instance.$element.find('.comparison-tab-box');
                if (response.Data.Expand)
                    $box.addClass('show');
                else
                    $box.removeClass('show');
                $content.empty();
                var i = 0;
                response.Data.items.forEach((x) => {
                    if (i > 0) {
                        var separator = document.createElement('hr');
                        $content[0].appendChild(separator);
                    }
                    var productDiv = document.createElement('div');
                    productDiv.classList.add('product');                    
                    var productNameA = document.createElement('a');
                    productNameA.setAttribute('href', '/Towar/' + x.ArticleId);
                    productNameA.setAttribute('data-id', x.ArticleId);
                    productNameA.classList.add('product-name');
                    productNameA.textContent = x.Name;
                    productDiv.appendChild(productNameA);
                    $content[0].appendChild(productDiv);
                    var productRemoveA = document.createElement('a');
                    productRemoveA.setAttribute('href', 'javasctipt:void(0);');
                    productRemoveA.setAttribute('data-id', x.ArticleId);
                    productRemoveA.className = 'remove btn btn-xs btn-outline btn-danger';
                    var trashIcon = document.createElement('i');
                    trashIcon.classList.add('fa');
                    trashIcon.classList.add('fa-trash');
                    trashIcon.setAttribute('data-id', x.ArticleId);
                    productRemoveA.appendChild(trashIcon);
                    productDiv.appendChild(productRemoveA);
                    $content[0].appendChild(productDiv);
                    i++;
                });
            }
        });        
    };
    ArticleComparison.prototype.SetComparisonPreviewState = function (comparisonExpanded) {
        var instance = this;        
        $.ajax({
            type: "POST",
            url: "/Article/SetComparisonPreviewState",
            cache: false,
            data: { comparisonExpanded: comparisonExpanded },
            async: true,
            success: function (response) {
            }
        });        
    };
    ArticleComparison.prototype.ResetComparison = function (comparisonExpanded) {
        var instance = this;
        $.ajax({
            type: "POST",
            url: "/Article/ResetComparison",
            cache: false,
            data: {  },
            async: true,
            success: function (response) {
                instance.LoadArticlesToCompare();
                if (response.Success) {
                    $('.select-article').iCheck('uncheck');
                    ToastrNotification.showNotification('warning', 'Usunięto z porównywarki');
                }
            }
        });
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
                new ArticleComparison(this, options));
            }
        });
    }
})(jQuery, window, document);

