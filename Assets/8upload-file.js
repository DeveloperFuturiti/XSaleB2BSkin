; (function ($, window, document, undefined) {
    var pluginName = 'fileUploader',
        defaults = {
            getFilePath: '/File/Get/',
        };
    function FileUploader(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.references = {};
        this.init();
    };
    FileUploader.prototype.init = function () {
        var instance = this;
        var uploadUrl = this.$element.data('url');
        instance.references.uploader = this.initUploader(uploadUrl);
        instance.references.uploader.splice();        
    };
    FileUploader.prototype.initUploader = function (uploadUrl) {
        var instance = this;
        var browseArea = instance.$element.find('.uploader-area')[0];
            var uploader = new plupload.Uploader({
                runtimes: 'html5',
                browse_button: browseArea,
                //container: UploadFileWidget.reference.uploaderContainerRef[0],
                drop_element: browseArea,
                url: uploadUrl,
                filters: {
                    max_file_size: '10mb'
                },
                init: {
                    PostInit: function () {                        
                    },
                    FilesAdded: function (up, files) {//Pojawienie paska postępu                                                
                        var progressBar = instance.$element.find('.progress')[0];
                        if (progressBar!=undefined) {
                            $(progressBar).show();
                        }
                        uploader.start();//Uruchomienie wysyłania
                    },
                    UploadProgress: function (up, file) {//Aktualizacja paska postępu
                        var progressContent = instance.$element.find('.progress-bar')[0];
                        if (progressContent != undefined) {
                            $(progressContent).css("width", file.percent + "%");
                        }                                                
                    },
                    Error: function (up, err) {
                        setTimeout(function () {
                            var progressBar = instance.$element.find('.progress')[0];
                            if (progressBar != undefined) {
                                $(progressBar).hide();
                            }
                            var progressContent = instance.$element.find('.progress-bar')[0];
                            if (progressContent != undefined) {
                                $(progressContent).css("width", 0 + "%");
                            }
                        }, 1000);                        
                        if (err.code == -600)//Wyświetlenie błędu wysyłania
                            swal('Błąd podczas przesyłania pliku', "Maksymalny rozmiar pliku wynosi: " + up.settings.filters.max_file_size, "error");
                        else
                            swal('Błąd podczas przesyłania pliku', 'Wystąpił błąd: #' + err.code + ": " + err.message, "error");
                    },
                    FileUploaded: function (up, file, info) {
                        //Dodanie pliku do listy
                        var progressBar = instance.$element.find('.progress')[0];
                        setTimeout(function () {
                        if (progressBar != undefined) {
                            $(progressBar).hide('slow');
                        }
                        var progressContent = instance.$element.find('.progress-bar')[0];
                        if (progressContent != undefined) {
                            $(progressContent).css("width", 0 + "%");
                        }
                        }, 1000);
                        if (info.status == 200) {
                            swal({
                                title: 'Wysłano',
                                text: "",
                                timer: 1000,
                                showConfirmButton: false,
                                type: "success",
                            });
                            var fileList$ = instance.$element.find('.file-list');                            
                                if (fileList$ != undefined) {
                                    var liProto = instance.$element.find('.prototype-element');                                    
                                    var aProto = liProto.find('a');                                     
                                    info.response = JSON.parse(info.response);
                                    aProto[0].setAttribute('data-url', instance.options.getFilePath  + info.response.fileId),
                                    aProto.html('<i class="fa ' + info.response.fileIcon + '"></i> ' + info.response.fileName);
                                    var spanProto = liProto.find('span');
                                    spanProto.html(info.response.fileSize + ' KB');                                    
                                    var newProto = liProto.clone();
                                    newProto.removeClass('prototype-element');
                                    fileList$.append(newProto);                                    
                                    instance.$element.find('.moxie-shim').css('top', instance.$element.find('.uploader-area').position().top);
                                }
                        }
                        else {
                            swal('Błąd podczas przesyłania pliku', "Błąd przetwarzania: #" + info.status, "error");
                        }                        
                    },
                    BeforeUpload: function (up, file) {
                        up.settings.multipart_params =  instance.getPostParamValues.apply(instance,arguments);//Pobranie np. id zadania dla którego wysyłamy
                    }
                }
            });
            uploader.init();
            return uploader;
    };
    FileUploader.prototype.getPostParamValues = function () {
        var postParams = {
            "ObjectId": this.$element.data('objectid'),
            "ObjectType": this.$element.data('objecttype')
        }
        return postParams;
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
                new FileUploader(this, options));
            }
        });
    }
})(jQuery, window, document);
