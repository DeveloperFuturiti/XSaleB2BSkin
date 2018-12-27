; (function($, window, document, undefined) {
    var pluginName = 'collection',
        defaults = {
            preloaderPrototypeSel: null,
            reloadGrid: false,
            scaleToWindowHeight: false,
            search:null
        };
    function Collection(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {
            pageNumber: 0,
            pageSize: 24,
            stopLoading: false,
            limit: null,
            columnNumber: null,
            itemWidth: null,            
        };
        this.init();
    };
    Collection.prototype.init = function () {
        var instance = this;
        instance.references.getDataUrl = this.$element.data('url');
        var pageSize = this.$element.data('pagesize');
        if (pageSize!=null)
            instance.references.pageSize = pageSize;
        var limit = this.$element.data('limit');
        if (limit != null)
            instance.references.limit = limit;
        var columnNumber = this.$element.data('columnnumber');
        if (columnNumber != null)
            instance.references.columnNumber = columnNumber;
        var itemWidth = this.$element.data('itemwidth');
        if (itemWidth != null)
            instance.references.itemWidth = itemWidth;
        instance.loadItems();
        instance.$element.on('reload',function () {
            instance.reload();
        });
    };
    Collection.prototype.loadItems = function (reload) {
        var instance = this;       
        var scrolltop = instance.element.scrollTop;
        var scrollheight = instance.element.scrollHeight;
        var elementClientHeight = instance.element.clientHeight;
        var documentScrollHeight = $('html')[0].scrollHeight;
        var documentScrolltop = $('html')[0].scrollTop;
        var documentClientHeight = $('html')[0].clientHeight;
        var scrolloffset = 2000;
        if (reload == true) {
            instance.references.pageNumber = 0;
            instance.references.stopLoading = false;
            instance.$element.empty();
            instance.options.reloadGrid = false;
        }
        if (
                instance.references.stopLoading == false
                && (
                    //Zmieniam zliczanie elementów, 
                    //$(SummaryNodeListTag.sel.contentSelector + ' p.summary-node-list-row-' + SummaryNodeListTag.dynamic.summaryType).length < SummaryNodeListTag.dynamic.pageSize
                    //na sprawdzenie czy pageNumber jest równy 0
                    instance.references.pageNumber == 0 ||
                    (
                        instance.options.scaleToWindowHeight == true ?
                        //Opcja doczytywanie zależne od wysokości scrolla dokumentu, gdy element ustawiony na 100% wysokości dokumentu
                        (documentScrollHeight != documentClientHeight && documentScrolltop >= (documentScrollHeight - (documentClientHeight + scrolloffset)))
                        //Opcja doczytywanie zalezne od wysokości scrolla elementu
                        :(scrollheight != elementClientHeight && scrolltop >= (scrollheight - (elementClientHeight + scrolloffset)))
                    )                    
                )
            ) {
            var serializedFilter = {}; 
            if (instance.options.filterSel!=null) {
                serializedFilter = $(instance.options.filterSel).filterMenu().SerializeFilter();
            }
            updateContactFavoredOffersFilter = false;
            if (instance.options.favoredFilterSel != null) {
                favoredFilterVal = $(instance.options.favoredFilterSel).is(':checked');
                updateContactFavoredOffersFilter = true;
            } else {
                favoredFilterVal = false;
            }
            if (instance.options.onlyAvailableFilterSel != null) {
                onlyAvailableFilterVal = $(instance.options.onlyAvailableFilterSel).is(':checked');
            } else {
                onlyAvailableFilterVal = false;
            }
            
            orderBy = null;
            orderByType = null;
            var $orderByBtn = $('.sort-filter').first();
            if ($orderByBtn !== null && $orderByBtn !== undefined) {
                var val = $orderByBtn.val();
                if (val !== null) {
                    if (val == 0) {
                        orderBy = "";
                        orderByType = "";
                    } else if (val == 1) {
                        orderBy = "name";
                        orderByType = "asc";
                    } else if (val == 2) {
                        orderBy = "name";
                        orderByType = "desc";
                    } else if (val == 3) {
                        orderBy = "priceQuick";
                        orderByType = "desc";
                    } else if (val == 4) {
                        orderBy = "priceQuick";
                        orderByType = "asc";
                    }
                }
            }

            $.ajax({
                type: 'POST',
                url: instance.references.getDataUrl,
                cache: false,
                data: {
                    PageNumber: instance.references.pageNumber,
                    PageSize: instance.references.pageSize,
                    Limit: instance.references.limit,
                    ColumnNumber: instance.references.columnNumber,
                    ItemWidth: instance.references.itemWidth,
                    CategoryId: instance.options.selectedCategoryId,
                    Filters: serializedFilter.Filters,
                    Search: instance.options.search,
                    FavoredFilter: favoredFilterVal,
                    OrderBy: orderBy,
                    OrderByType: orderByType,
                    InStockFilter: onlyAvailableFilterVal,
                    UpdateContactFavoredOffersFilter: updateContactFavoredOffersFilter
                },
                xhr: function () {  // Custom XMLHttpRequest
                    var myXhr = $.ajaxSettings.xhr();
                    instance.showPreloader();
                    return myXhr;
                },
                success: function (data) {
                    instance.hidePreloader();
                    if (data.Success) {
                        if (reload == true) 
                            instance.$element.html(data.Data.html);
                         else 
                            instance.$element.append(data.Data.html);                        
                            instance.references.pageNumber = data.Data.pageNumber;
                                instance.references.stopLoading = data.Data.stopLoading;                       
                    } else {
                        instance.references.stopLoading = true;
                        console.log(data.Errors);
                    }
                    instance.loadItems();                    
                }
            });
        } else {
                setTimeout(function () {                    
                    instance.loadItems(instance.options.reloadGrid==true);
                }, 500);            
        }
    };
    Collection.prototype.showPreloader = function () {
        var instance = this;
        if (instance.options.preloaderPrototypeSel != null) {
            var $clone = $(instance.options.preloaderPrototypeSel).clone();
            $clone.removeAttr("style");
            $clone.removeClass(instance.options.preloaderPrototypeSel.replace(".", ""));
            $clone.addClass(instance.options.preloaderPrototypeSel.replace(".", "") + '-instance');
            instance.$element.append($clone);
        }        
    };
    Collection.prototype.hidePreloader = function () {
        var instance = this;
        if (instance.options.preloaderPrototypeSel != null) {
            var $preloader = instance.$element.find(instance.options.preloaderPrototypeSel + '-instance');
            $preloader.remove();            
        }        
    };
    Collection.prototype.reload = function () {        
        var instance = this;        
        instance.options.reloadGrid = true;
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
                new Collection(this, options));
            }
        });
    }
})(jQuery, window, document);
