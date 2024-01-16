(function($){
    $.fn.circleProgress = function (options, params) {
        if ($(this).length > 1) {
            return $(this).each(function (i, e) {
                return $(e).circleProgress(options, params);
            })
        }

        const DEFAULTS = {
            size: 200,
            value: 0,
            background: 'transparent',
            progressClass: 'primary'
        };

        const $element = $(this);

        function setValue(value) {
            if (value > 100) {
                value = 100;
            }
            $element.data('value', value);
            $element.find('.js-prozess-value').text(Math.round(value));
            const left = $element.find('.progress-left .progress-bar');
            const right = $element.find('.progress-right .progress-bar');
            if (value > 0) {
                if (value <= 50) {
                    right.css('transform', 'rotate(' + percentageToDegrees(value) + 'deg)')
                } else {
                    right.css('transform', 'rotate(180deg)')
                    left.css('transform', 'rotate(' + percentageToDegrees(value - 50) + 'deg)')
                }
            } else {
                left.css('transform', 'rotate(0deg)');
                right.css('transform', 'rotate(0deg)');
            }
        }

        function build($e) {
            const settings = $e.data('settings');
            $e
                .addClass('shadow position-relative')
                .css({
                    width: settings.size + 'px',
                    height: settings.size + 'px',
                    borderRadius: settings.size + 'px',
                    background: settings.background
                });

            const cssSpan = {
                width: "50%",
                height: "100%",
                overflow: 'hidden',
                position: 'absolute',
                top: 0,
                zIndex: 1
            };
            const progressBarCss = {
                width: "100%",
                height: "100%",
                background: "none",
                borderWidth: (settings.size / 10) + "px",
                borderStyle: "solid",
                position: "absolute",
                top: 0,
                zIndex: 2
            };

            // left border
            const leftCSS = $.extend(structuredClone(cssSpan), {left: 0});
            const leftProgressBarCss = $.extend(structuredClone(cssSpan), structuredClone(progressBarCss), {
                left: "100%",
                borderTopRightRadius: (settings.size / 2 + (settings.size / 10)) + "px",
                borderBottomRightRadius: (settings.size / 2 + (settings.size / 10)) + "px",
                borderLeft: 0,
                transformOrigin: "center left"
            });

            const left = $('<span>', {
                class: 'progress-left',
                css: leftCSS
            }).appendTo($e);

            $('<span>', {
                class: 'progress-bar border-' + settings.progressClass,
                css: leftProgressBarCss
            }).appendTo(left);

            // right border
            const rightCSS = $.extend(structuredClone(cssSpan), {right: 0});
            const rightProgressBarCss = $.extend(structuredClone(cssSpan), structuredClone(progressBarCss), {
                left: "-100%",
                borderTopLeftRadius: (settings.size / 2 +  (settings.size / 10)) + "px",
                borderBottomLeftRadius: (settings.size / 2 +  (settings.size / 10)) + "px",
                borderRight: 0,
                transformOrigin: "center right"
            });

            const right = $('<span>', {
                class: 'progress-right',
                css: rightCSS
            }).appendTo($e);

            $('<span>', {
                class: 'progress-bar border-' + settings.progressClass,
                css: rightProgressBarCss
            }).appendTo(right);

            // value container
            $('<div>', {
                css: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '50%',
                    height: '100%',
                    overflow: 'hidden',
                    zIndex: 0,
                    fontSize: (settings.size / 5) + 'px',
                    borderWidth: (settings.size / 10) + "px",
                    borderStyle: 'solid',
                    borderColor: 'rgb(128, 128, 128, .3)'
                },
                class: 'progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center',
                html: '<div class=" font-weight-bold m-0"><span class="js-prozess-value"></span><sup class="small">%</sup></div>'
            }).appendTo($e);

            setValue($element.data('value') || settings.value);
        }

        function percentageToDegrees(percentage) {

            return percentage / 100 * 360

        }

        function init() {
            if (!$element.data('init')) {

                if (typeof options === 'object' && !$element.data('settings')) {
                    $element.data('settings', $.extend(DEFAULTS, options || {}));
                }

                if (!$element.data('settings')) {
                    $element.data('settings', DEFAULTS);
                }

                build($element);

                $element.data('init', true);
            }
        }

        init();

        if (typeof options === 'string') {
            switch (options) {
                case 'val': {
                    setValue(params);
                    break;
                }
                case 'updateOptions': {
                    const beforeOptions = $element.data('settings') || DEFAULTS;
                    const beforeValue = $element.data('value');
                    const newOptions = $.extend(beforeOptions, params);
                    $element.data('settings', newOptions);
                    $element.empty();
                    build($element);
                    if (params.value) {
                        setValue(params.value)
                    }
                    break;
                }

            }
        }

        return $element;

    }


}(jQuery));