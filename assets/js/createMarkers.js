var image;

class Form {
    constructor(id) {
        this.dropZone = $(id);

        this.initListeners();
    }

    initListeners() {
        var that = this;

        this.dropZone.focus(function () {
            $('label').addClass('focus');
        })
            .focusout(function () {
                $('label').removeClass('focus');
            });


        this.dropZone.on('drag dragstart dragend dragover dragenter dragleave drop', function () {
            return false;
        });

        this.dropZone.on('dragover dragenter', function () {
            that.dropZone.addClass('dragover');
        });

        this.dropZone.on('dragleave', function (e) {
            let dx = e.pageX - that.dropZone.offset().left;
            let dy = e.pageY - that.dropZone.offset().top;
            if ((dx < 0) || (dx > that.dropZone.width()) || (dy < 0) || (dy > that.dropZone.height())) {
                that.dropZone.removeClass('dragover');
            }
        });

        this.dropZone.on('drop', function (e, callback) {
            that.dropZone.removeClass('dragover');
            var files = e.originalEvent.dataTransfer.files;

            that.encodeImgtoBase64(files[0])
        });

        this.dropZone.find('input').change(function (e, i) {
            var files = this.files;

            that.encodeImgtoBase64(files[0])
        });
    }

    encodeImgtoBase64(file) {
        var reader = new FileReader(),
            that = this;

        reader.onloadend = function() {
            that.dropZone.hide()
            $("#img").attr("src", reader.result);
            $('.showJson').show();
            image = new ImageMarkers($('#img'));
        }
        reader.readAsDataURL(file);
    }
}

class ImageMarkers {
    constructor(imageElement) {
        this.entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };

        this.markerTypes = {
            /*'link': {
                html: $('<input>', {
                    'placeholder': 'Вставьте ссылку',
                }),
                name: 'Ссылка'
            },*/
            'text': {
                name: 'Текст html',
                tag: '<textarea>',
                tagConfig: {
                    'placeholder': 'Вставьте Текст (html)',
                },
            },
            /*'string': {
                html: $('<input>', {
                    'placeholder': 'Напишите строку',
                }),
                name: 'Строка'
            }*/
        };
        this.markerCounter = 0;
        this.json = {};

        var that = this;
        imageElement.one('load', function () {
            that.image = imageElement;

            that.wrapImage();

            that.imageWidth = imageElement.width();
            that.imageHeight = imageElement.height();

            that.initListeners();
        }).each(function () {
            if (this.complete) {
                $(this).trigger('load');
            }
        })
    }

    wrapImage() {
        this.image.wrap('<div class="imageWrapper"></div>');
    }

    initListeners() {
        this.image.click((e) => {
            if ($('#json').is(':visible')) {
                $('#json').hide()
                return false;
            }

            if (this.image.closest('.imageWrapper').find('.markerForm').is(':visible')) {
                this.image.closest('.imageWrapper').find('.markerForm').hide();
            } else {
                this.createMarkerOnImage(this.calcClickPos(e))
            }
        })

        $('.showJson').click(() => {
            this.showJson();
        })
    }

    calcClickPos(event) {
        var posXAbs = event.pageX - this.image.offset().left;
        var posYAbs = event.pageY - this.image.offset().top;

        var posXRel = posXAbs / this.imageWidth * 100;
        var posYRel = posYAbs / this.imageHeight * 100;

        return {xAbs: posXAbs, yAbs: posYAbs, xRel: posXRel, yRel: posYRel}
    }

    createMarkerOnImage(markerPos) {
        var marker = $('<div>', {
            'class': 'marker',
            'css': {
                'left': markerPos.xRel + '%',
                'top': markerPos.yRel + '%',
            },
            'data-marker': ++this.markerCounter,
            'click': function () {
                $('.markerForm[data-marker-number = "' + $(this).attr('data-marker') + '"]').show()
            }
        });

        this.createDescriptionForm(markerPos, this.markerCounter);
        marker.appendTo(this.image.closest('.imageWrapper'));
    }

    createDescriptionForm(markerPos, markerNumber) {
        var that = this,
            form = $('<div>', {
                'class': 'markerForm',
                'data-marker-number': markerNumber,
                'css': {
                    'left': 'calc(' + markerPos.xRel + '%)',
                    'top': markerPos.yRel + '%',
                },
            }),
            select = $('<select>', {
                'class': 'markerFormSelect',
                'id': 'test',
                'change': function () {
                    that.updateForm($(this), $(this).val(), markerNumber)
                },
            }),
            inputWrapper = $('<div>', {
                'class': 'markerFormInputWrapper',
            }),
            removeMarker = $('<button>', {
                'class': 'markerFormInputWrapper',
                'text': 'Удалить Маркер',
                'click': function () {
                    $('.markerForm[data-marker-number = "' + markerNumber + '"]').remove();
                    $('.marker[data-marker = "' + markerNumber + '"]').remove();
                }
            });

        for (var option in this.markerTypes) {
            var option = $('<option>', {
                'class': 'markerFormSelectOption',
                'value': option,
                'text': this.markerTypes[option].name
            });

            option.appendTo(select)
        }

        select.appendTo(form);
        inputWrapper.appendTo(form);
        removeMarker.appendTo(form);
        form.appendTo(this.image.closest('.imageWrapper'));
        this.json[markerNumber] = {
            posX: markerPos.xRel,
            posY: markerPos.yRel,
            type: select.val(),
            text: ''
        };
        this.updateForm(select, select.val());
    }

    updateForm(select, markerType, markerNumber) {
        var that = this;

        var input = $(this.markerTypes[markerType].tag, this.markerTypes[markerType].tagConfig);


        /*switch (markerType) {
            case 'link':
                input = $('<input>', {
                    'placeholder': 'Вставьте ссылку',
                });
                break;
            case 'text':
                input = $('<textarea>', {
                    'placeholder': 'Вставьте Текст (html)',
                });
                break;
            case 'string':
                input = $('<input>', {
                    'placeholder': 'Напишите строку',
                });
                break;
        }*/
        input.change(() => {
            this.json[input.closest('.markerForm').attr('data-marker-number')].text = input.val();
            console.log(this.json);
        })

        select.next().empty();
        input.appendTo(select.next())
        select.attr('data-type', markerType);
        this.json[input.closest('.markerForm').attr('data-marker-number')].type = markerType
    }

    escapeHtml(string) {
        return String(string).replace(/[&<>"'`=\/]/g, (s) => {
            return this.entityMap[s];
        });
    }

    showJson() {
        $('#json').show().empty();

        for (var key in this.json) {
            var str = JSON.stringify(this.json[key]) + ',';
            $('#json').append(str);
            $('#json').append('<br>')
        }
    }
}

var form = new Form('#uploadImageContainer');