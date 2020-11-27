$(document).ready(function () {
    (function ($) {
        $.fn.markers = function (json) {

            var settings = {
                    imageWrapperClass: 'imageWrapper',
                    markerClass: 'marker',
                    markerFormClass: 'markerForm',
                    markerFormActiveClass: 'markerForm_active',
                    markers: [],
                },
                newSettings = json,
                that = this;

            this.click(() => {
                $('.' + settings.markerFormClass).removeClass(settings.markerFormActiveClass);
            })

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
                        var form = $('.' + settings.markerFormClass + '[data-marker-number = "' + $(this).attr('data-marker') + '"]');

                        form.addClass(settings.markerFormActiveClass);
                        checkFormPos(form, x, y);
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
                        'html': decodeURIComponent(text)
                    })
                });


                form.appendTo(that.closest('.' + settings.imageWrapperClass));
            }

            function checkFormPos(f, x, y) {
                f.css({
                    'left': x + '%',
                    'top': y + '%',
                    'right': 'auto',
                    'bottom': 'auto',
                })

                if (f.position().left + f.outerWidth() > $('.' + settings.imageWrapperClass).outerWidth()) {
                    f.css({
                        'left': 'auto',
                        'right': 100 - x + '%',
                    })
                } else {
                    f.css({
                        'left': x + '%',
                        'right': 'auto',
                    })
                }

                 if (f.position().top + f.outerHeight() > $('.' + settings.imageWrapperClass).outerHeight()) {
                     f.css({
                         'top': 'auto',
                         'bottom': 100 - y + '%',
                     })
                 } else {
                     f.css({
                         'top': y + '%',
                         'bottom': 'auto',
                     })
                 }
            }

            function prepareClass(a, b) {
                var d = a;

                if (b && typeof b === 'string') {
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
})