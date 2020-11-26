$(document).ready(function () {
    (function ($) {
        $.fn.markers = function (json) {

            var settings = {
                    imageWrapperClass: 'imageWrapper',
                    markerClass: 'marker',
                    markerFormClass: 'markerForm',
                    markers: [],
                },
                newSettings = json,
                that = this;

            var imageWrapperClass = prepareClass(settings.imageWrapperClass, newSettings.imageWrapperClass)

            this.wrap('<div class="' + imageWrapperClass + '"></div>');


            newSettings.markers.forEach(function (item, i) {
                createMarkerOnImage(item.posX, item.posY, i, item.type, item.text)
            })

            function createMarkerOnImage(x, y, markerCounter, type, text) {
                var markerClass = prepareClass(settings.markerClass, newSettings.markerClass);

                var marker = $('<div>', {
                    'class': markerClass,
                    'css': {
                        'left': x + '%',
                        'top': y + '%',
                    },
                    'data-marker': markerCounter,
                    'click': function () {
                        $('.' + settings.markerFormClass + '[data-marker-number = "' + $(this).attr('data-marker') + '"]').show()
                        checkFormPos($('.' + settings.markerFormClass + '[data-marker-number = "' + $(this).attr('data-marker') + '"]'), x)
                    }
                });

                createDescriptionForm(x, y, markerCounter, type, text);
                marker.appendTo(that.closest('.' + settings.imageWrapperClass));
            }

            function createDescriptionForm(x, y, markerNumber, type, text) {
                var markerFormClass = prepareClass(settings.markerFormClass, newSettings.markerFormClass)

                var form = $('<div>', {
                    'class': markerFormClass,
                    'data-marker-number': markerNumber,
                    'css': {
                        'left': x + '%',
                        'top': y + '%',
                    },
                    append: $('<div>', {
                        'html': text
                    })
                });

                form.appendTo(that.closest('.' + settings.imageWrapperClass));
            }

            function checkFormPos(f, x) {
                if (f.position().left + f.outerWidth() > $('.' + settings.imageWrapperClass).outerWidth()) {
                    f.css({
                        'left': 'auto',
                        'right': 100 - x + '%',
                    })
                } else {
                    f.css({
                        'left': 'x' + '%',
                        'right': 'auto',
                    })
                }
            }

            function prepareClass(a, b) {
                var d = a;

                if (b && typeof b === 'string' ) {
                    if (b.indexOf(',')) {
                        var c = b.split(',');
                        var e = '';

                        c.forEach(function (f, g) {
                            f = f.trim();
                            g == c.length - 1 ? e += f : e += f + ' ';
                        })

                        d += ' ' + e;
                    } else {
                        d += ' ' + b;
                    }
                }

                return d;
            }

        };
    })(jQuery);

    $('.image').markers({
        markers: [
            //enter your markers here
        ],
        //imageWrapperClass: 'testImageWrapperClass, testImageWrapperClass2',
        //markerClass: 'testMarkerClass',
        //markerFormClass: 'testMarkerFormClass',
    })
})