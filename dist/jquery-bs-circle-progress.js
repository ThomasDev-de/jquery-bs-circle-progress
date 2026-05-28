(function ($) {
    $.fn.circleProgress = function (options, params) {
        if ($(this).length > 1) {
            return $(this).each(function (i, e) {
                return $(e).circleProgress(options, params);
            });
        }

        const DEFAULTS = {
            size: 200,
            value: 0,
            background: 'transparent',
            color: 'primary',
            progressWidth: null,
            animated: true
        };

        const $element = $(this);

        function getProgressColor(color) {
            if (['dark', 'secondary', 'light', 'info', 'warning', 'danger', 'success', 'primary'].includes(color)) {
                const $tmp = $('<span>', {
                    class: 'border border-' + color,
                    css: {
                        position: 'absolute',
                        visibility: 'hidden'
                    }
                }).appendTo(document.body);
                const resolvedColor = $tmp.css('border-top-color');
                $tmp.remove();
                return resolvedColor;
            }
            return color;
        }

        function getColorBackgroundColor(color) {
            if (['dark', 'secondary', 'light', 'info', 'warning', 'danger', 'success', 'primary', 'transparent'].includes(color)) {
                return {
                    class: 'bg-' + color
                };
            }
            return {
                css: {
                    background: color
                }
            };
        }

        function setValue(value) {
            const settings = $element.data('settings') || DEFAULTS;
            let showValue = value;
            if (value < 0) {
                value = 0;
            }
            if (value > 100) {
                value = 100;
            }

            $element.data('value', showValue);
            $element.find('.js-prozess-value').text(Math.round(showValue));

            const $progressCircle = $element.find('.js-progress-circle');
            const radius = parseFloat($progressCircle.attr('r') || '0');
            const circumference = 2 * Math.PI * radius;
            const progress = value / 100;
            const offset = circumference * (1 - progress);
            $progressCircle.css('stroke-dashoffset', offset + 'px');
            $progressCircle.attr('aria-valuenow', Math.round(value));

            if (settings.animated) {
                $progressCircle.css('transition', 'stroke-dashoffset .6s ease');
            } else {
                $progressCircle.css('transition', 'none');
            }
        }

        function build($e) {
            const settings = $e.data('settings');
            const borderWidth = settings.progressWidth ?? (settings.size / 10);
            const backgroundColor = getColorBackgroundColor(settings.background);
            const progressColor = getProgressColor(settings.color);
            const radius = (settings.size / 2) - (borderWidth / 2);
            const circumference = 2 * Math.PI * radius;
            const trackColor = 'rgb(128 128 128 / 0.3)';

            const backgroundCss = $.extend({
                maxWidth: settings.size + 'px',
                minWidth: settings.size + 'px',
                width: settings.size + 'px',
                maxHeight: settings.size + 'px',
                minHeight: settings.size + 'px',
                height: settings.size + 'px',
                borderRadius: settings.size + 'px'
            }, backgroundColor.css || {});

            $e
                .addClass('position-relative')
                .css(backgroundCss);

            if (backgroundColor.class) {
                $e.addClass(backgroundColor.class);
            }

            const svgNs = 'http://www.w3.org/2000/svg';
            const svgEl = document.createElementNS(svgNs, 'svg');
            svgEl.setAttribute('class', 'js-circle-svg');
            svgEl.setAttribute('viewBox', '0 0 ' + settings.size + ' ' + settings.size);

            const trackCircleEl = document.createElementNS(svgNs, 'circle');
            trackCircleEl.setAttribute('class', 'js-track-circle');
            trackCircleEl.setAttribute('cx', String(settings.size / 2));
            trackCircleEl.setAttribute('cy', String(settings.size / 2));
            trackCircleEl.setAttribute('r', String(radius));
            trackCircleEl.setAttribute('fill', 'none');

            const progressCircleEl = document.createElementNS(svgNs, 'circle');
            progressCircleEl.setAttribute('class', 'js-progress-circle');
            progressCircleEl.setAttribute('cx', String(settings.size / 2));
            progressCircleEl.setAttribute('cy', String(settings.size / 2));
            progressCircleEl.setAttribute('r', String(radius));
            progressCircleEl.setAttribute('fill', 'none');
            progressCircleEl.setAttribute('role', 'progressbar');
            progressCircleEl.setAttribute('aria-valuemin', '0');
            progressCircleEl.setAttribute('aria-valuemax', '100');

            svgEl.appendChild(trackCircleEl);
            svgEl.appendChild(progressCircleEl);
            $e.append(svgEl);

            const $trackCircle = $e.find('.js-track-circle');
            const $progressCircle = $e.find('.js-progress-circle');
            const $svg = $e.find('.js-circle-svg');

            $svg.css({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                transform: 'rotate(-90deg)',
                overflow: 'visible'
            });

            $trackCircle.css({
                stroke: trackColor,
                strokeWidth: borderWidth + 'px'
            });

            $progressCircle.css({
                stroke: progressColor,
                strokeWidth: borderWidth + 'px',
                strokeLinecap: 'round',
                strokeDasharray: circumference + 'px',
                strokeDashoffset: circumference + 'px'
            });

            $('<div>', {
                class: 'progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center position-absolute',
                css: {
                    top: 0,
                    left: 0,
                    fontSize: (settings.size / 5) + 'px'
                },
                html: '<div class="font-weight-bold m-0"><span class="js-prozess-value"></span><sup class="small">%</sup></div>'
            }).appendTo($e);

            const initialValue = $element.data('value') ?? settings.value;
            if (settings.animated) {
                setValue(0);
                requestAnimationFrame(function () {
                    setValue(initialValue);
                });
            } else {
                setValue(initialValue);
            }
        }

        function events($e) {
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
                events($element);
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
                    const newOptions = $.extend(beforeOptions, params);
                    $element.data('settings', newOptions);
                    $element.empty();
                    build($element);
                    if (params && Object.prototype.hasOwnProperty.call(params, 'value')) {
                        setValue(params.value);
                    }
                    break;
                }

            }
        }

        return $element;

    };


}(jQuery));
