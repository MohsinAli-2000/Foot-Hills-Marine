/* =================================================================
   Foothills Marine — script.js

   One $(document).ready with labeled regions. Every DOM-specific
   block is guarded with a .length check so this file stays safe to
   load on every page. New behaviour → add its own labeled region.
   ================================================================= */

$(document).ready(function () {

    /* ===== desktop menu panels code starts here ===== */
    // Each trigger names its panel in aria-controls. Click only, one open at a time,
    // closed by a second click, an outside click or Escape.
    if ($('.js-mega-trigger').length) {
        var $triggers = $('.js-mega-trigger');

        function closeMenuPanels() {
            $triggers.attr('aria-expanded', 'false').each(function () {
                $('#' + $(this).attr('aria-controls')).prop('hidden', true);
            });
        }

        $triggers.on('click', function (event) {
            event.stopPropagation();
            var $trigger = $(this);
            var wasOpen = $trigger.attr('aria-expanded') === 'true';

            closeMenuPanels();
            if (!wasOpen) {
                $trigger.attr('aria-expanded', 'true');
                $('#' + $trigger.attr('aria-controls')).prop('hidden', false);
            }
        });

        $(document).on('click', function (event) {
            if (!$(event.target).closest('.fh-mega, .fh-dropdown').length) {
                closeMenuPanels();
            }
        });

        $(document).on('keydown', function (event) {
            if (event.key === 'Escape') {
                closeMenuPanels();
            }
        });
    }
    /* ===== desktop menu panels code ends here ===== */

    /* ===== mobile menu code starts here ===== */
    if ($('.js-mobile-menu').length) {
        var $mobileMenu = $('.js-mobile-menu');
        var $mobileOverlay = $('.js-mobile-menu-overlay');
        var $mobileOpen = $('.js-mobile-menu-open');

        function openMobileMenu() {
            $mobileMenu.addClass('is-open').attr('aria-hidden', 'false');
            $mobileOverlay.addClass('is-open');
            $mobileOpen.attr('aria-expanded', 'true');
            $('body').css('overflow', 'hidden');
        }

        function closeMobileMenu() {
            $mobileMenu.removeClass('is-open').attr('aria-hidden', 'true');
            $mobileOverlay.removeClass('is-open');
            $mobileOpen.attr('aria-expanded', 'false');
            $('body').css('overflow', '');
        }

        $mobileOpen.on('click', openMobileMenu);
        $('.js-mobile-menu-close').add($mobileOverlay).on('click', closeMobileMenu);

        $(document).on('keydown', function (event) {
            if (event.key === 'Escape') {
                closeMobileMenu();
            }
        });

        $('.js-mobile-sub-toggle').on('click', function () {
            var isOpen = $(this).attr('aria-expanded') === 'true';
            $(this).attr('aria-expanded', String(!isOpen)).next('.fh-mobile-menu__sub').prop('hidden', isOpen);
        });

        // the drawer is mobile-only; never leave it open when the viewport grows past it
        $(window).on('resize', function () {
            if (window.innerWidth > 991) {
                closeMobileMenu();
            }
        });
    }
    /* ===== mobile menu code ends here ===== */

    /* ===== forms code starts here ===== */
    // Forms without a backend yet: validate with the browser, show the message, reset.
    if ($('.js-form').length) {
        $('.js-form').on('submit', function (event) {
            event.preventDefault();
            if (!this.checkValidity()) {
                this.reportValidity();
                return;
            }

            var $form = $(this);
            $form.find('.js-form-message').text($form.data('success-message')).prop('hidden', false);
            this.reset();
        });
    }
    /* ===== forms code ends here ===== */

    /* ===== faq code starts here ===== */
    if ($('.js-faq-group').length) {
        $('.js-faq-toggle').on('click', function () {
            var isOpen = $(this).attr('aria-expanded') === 'true';
            $(this).attr('aria-expanded', String(!isOpen)).next('.fh-faq-item__answer').prop('hidden', isOpen);
        });

        $('.js-faq-topic').on('click', function () {
            $('.js-faq-topic').removeClass('is-active');
            $(this).addClass('is-active');
        });

        // live filter: hide questions that don't contain the search text, then empty groups
        $('.js-faq-search').on('input', function () {
            var query = $.trim($(this).val()).toLowerCase();

            $('.js-faq-item').each(function () {
                $(this).prop('hidden', query !== '' && $(this).text().toLowerCase().indexOf(query) === -1);
            });
            $('.js-faq-group').each(function () {
                $(this).prop('hidden', $(this).find('.js-faq-item:not([hidden])').length === 0);
            });
            $('.js-faq-empty').prop('hidden', $('.js-faq-group:not([hidden])').length > 0);
        });
    }
    /* ===== faq code ends here ===== */

    /* ===== plus/minus accordion code starts here ===== */
    if ($('.js-qa-toggle').length) {
        $('.js-qa-toggle').on('click', function () {
            var $item = $(this).closest('.fh-qa-item');
            var isOpen = $item.hasClass('is-open');
            $item.toggleClass('is-open', !isOpen).find('.fh-qa-item__answer').prop('hidden', isOpen);
            $(this).attr('aria-expanded', String(!isOpen));
        });
    }
    /* ===== plus/minus accordion code ends here ===== */

    /* ===== file upload code starts here ===== */
    // show the chosen file's name in place of the drop-zone prompt
    if ($('.js-file-input').length) {
        $('.js-file-input').each(function () {
            var $name = $(this).siblings('.js-file-name');
            $name.data('prompt', $name.text());
        }).on('change', function () {
            var $name = $(this).siblings('.js-file-name');
            $name.text(this.files.length ? this.files[0].name : $name.data('prompt'));
        });
    }
    /* ===== file upload code ends here ===== */

    /* ===== date input code starts here ===== */
    // text field so the Figma placeholder shows; becomes a native date picker on focus
    if ($('.js-date-input').length) {
        $('.js-date-input').on('focus', function () {
            this.type = 'date';
        }).on('blur', function () {
            if (!this.value) {
                this.type = 'text';
            }
        });
    }
    /* ===== date input code ends here ===== */

    /* ===== category filter code starts here ===== */
    // Tabs carry data-filter; items carry data-category. "all" shows everything.
    if ($('.js-filter').length) {
        $('.js-filter').on('click', function () {
            var filter = $(this).data('filter');

            $('.js-filter').removeClass('is-active').attr('aria-pressed', 'false');
            $(this).addClass('is-active').attr('aria-pressed', 'true');

            $('.js-filter-item').each(function () {
                $(this).prop('hidden', filter !== 'all' && $(this).data('category') !== filter);
            });
            $('.js-filter-empty').prop('hidden', $('.js-filter-item:not([hidden])').length > 0);
        });
    }

    // optional live text search over the same items; searching resets the tabs to "all"
    if ($('.js-filter-search').length) {
        $('.js-filter-search').on('input', function () {
            var query = $.trim($(this).val()).toLowerCase();

            $('.js-filter').removeClass('is-active').attr('aria-pressed', 'false')
                .filter('[data-filter="all"]').addClass('is-active').attr('aria-pressed', 'true');
            $('.js-filter-item').each(function () {
                $(this).prop('hidden', query !== '' && $(this).text().toLowerCase().indexOf(query) === -1);
            });
            $('.js-filter-empty').prop('hidden', $('.js-filter-item:not([hidden])').length > 0);
        });
    }
    /* ===== category filter code ends here ===== */

    /* ===== copy link code starts here ===== */
    if ($('.js-copy-link').length && navigator.clipboard) {
        $('.js-copy-link').on('click', function () {
            var $button = $(this);
            navigator.clipboard.writeText(window.location.href).then(function () {
                $button.attr('aria-label', 'Link copied');
            });
        });
    }
    /* ===== copy link code ends here ===== */

    /* ===== staff bio pop-up code starts here ===== */
    // One shared pop-up: fill it from the clicked card's data- attributes, then open it with Fancybox.
    if ($('.js-bio-open').length && window.Fancybox) {
        var $bio = $('#fh-bio-popup');

        $('.js-bio-open').on('click', function () {
            var person = $(this).data();

            $bio.find('.js-bio-photo').attr({ src: person.photo, alt: person.name + ', ' + person.role });
            $bio.find('.js-bio-name').text(person.name);
            $bio.find('.js-bio-role').text(person.role);
            $bio.find('.js-bio-phone').text(person.phone).attr('href', 'tel:' + person.tel);

            Fancybox.show([{ src: '#fh-bio-popup', type: 'inline' }]);
        });
    }
    /* ===== staff bio pop-up code ends here ===== */

    /* ===== brand strip carousel code starts here ===== */
    if ($('.fh-brand-strip__slider').length) {
        $('.fh-brand-strip__slider').owlCarousel({
            loop: true,
            autoWidth: true,
            margin: 16,
            nav: false,
            dots: false,
            autoplay: true,
            autoplayTimeout: 2500,
            autoplayHoverPause: true,
            smartSpeed: 800
        });
    }
    /* ===== brand strip carousel code ends here ===== */

});
