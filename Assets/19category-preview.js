CategoryPreview = {
    init: function () {
        //setInterval będzie sprawdzał co 0,5 sek czy trzeba zamknąć okno
    },
    reference: {
        windowOpened: false,
        categoryId:null
    },
    mouseEnter: function (t) {
        var $this = $(t);
        var $li = $this.closest('li.dd-item');
        var liPosition = $li.offset();
        var liWidth = $li.width();
        var additionalOffsetWidth = 10;
        var additionalOffsetHeight = -70;
        var categoryId = $li.data('id');
        CategoryPreview.reference.windowOpened = true;
        if (CategoryPreview.reference.categoryId != categoryId) {
            CategoryPreview.reference.categoryId = categoryId;
            $('#category-preview').data('id', categoryId);            
            var top = liPosition.top + additionalOffsetHeight;
            var left = liPosition.left + liWidth + additionalOffsetWidth;
            var height = $('#category-preview').height();
            var width = $('#category-preview').width();
            var documentHeight = $(document).height();
            var documentWidth = $(document).width();
            var maxTop = documentHeight - height - 10;
            if (top > maxTop)
                top = maxTop;
            $('#category-preview').css('top', top);
            $('#category-preview').css('left', left);
            $('#category-preview').empty();
            CategoryPreview.showPreloader();
            setTimeout(function () {
                if (CategoryPreview.reference.categoryId == categoryId && CategoryPreview.reference.windowOpened) {
                    var $categoryPreviewGrid = $('#category-preview-grid').clone();
                    $categoryPreviewGrid.css('display', '').attr('id', 'category-preview-grid-' + categoryId);
                    $('#category-preview').empty().append($categoryPreviewGrid);
                    $('#category-preview-grid-' + categoryId).collection({ 
                        preloaderPrototypeSel: '.grid-preloader-prototype', selectedCategoryId: categoryId,
                        favoredFilterSel: '#favored-filter-container'
                    });
                }
            }, 700);            
        }
        $('#category-preview').show();        
    },
    showPreloader: function () {
        var $preloader = $('.category-preloader-prototype').clone();
        $preloader.css('display', '').removeClass('category-preloader-prototype').addClass('category-preloader');
        $('#category-preview').append($preloader);
    },
    mouseOut: function (t) {        
        var $this = $(t);
        var $li = $this.closest('li.dd-item');
        var categoryId = $li.data('id');
        if (CategoryPreview.reference.categoryId == categoryId) {
            CategoryPreview.reference.windowOpened = false;
        }        
        setTimeout(function () {
            if (!CategoryPreview.reference.windowOpened && CategoryPreview.reference.categoryId == categoryId) {
                $('#category-preview').hide();
            }
        }, 700);        
    },
    windowMouseEnter: function (t) {        
        var $this = $(t);        
        var categoryId = $this.data('id');
        CategoryPreview.reference.windowOpened = true;
        if (CategoryPreview.reference.categoryId != categoryId) {
            CategoryPreview.reference.categoryId = categoryId;
            //$('#category-preview').empty();
            //$('#category-preview').append('<h2>W ' + CategoryPreview.reference.categoryId + '</h2>');
        }
        $('#category-preview').show();        
    },
    windowMouseOut: function (t) {        
        var $this = $(t);
        var categoryId = $this.data('id');
        if (CategoryPreview.reference.categoryId == categoryId) {
            CategoryPreview.reference.windowOpened = false;
        }
        setTimeout(function () {
            if (!CategoryPreview.reference.windowOpened && CategoryPreview.reference.categoryId == categoryId) {
                $('#category-preview').hide();
            }
        }, 700);
    },
}