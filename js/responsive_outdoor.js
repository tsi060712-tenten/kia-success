$(function(){
    $(function () {
    const mq = window.matchMedia('(max-width: 768px)');
    let menuScrollY = 0;
    let lifeTabletSwiper = null;
    let communityTabletSwipers = [];

    function ensureTabletMenuButton() {
        if (!$('.tablet-menu-toggle').length) {
            $('header .inner').append(
                '<button class="tablet-menu-toggle" type="button" aria-label="메뉴 열기" aria-expanded="false">' +
                '<span></span><span></span><span></span>' +
                '</button>'
            );
        }
    }

    function lockBody() {
        menuScrollY = window.scrollY || $(window).scrollTop();
        $('body').css({
            position: 'fixed',
            top: -menuScrollY + 'px',
            left: 0,
            right: 0,
            width: '100%'
        }).addClass('tablet-menu-open');
    }

    function unlockBody() {
        $('body').removeClass('tablet-menu-open').css({
            position: '',
            top: '',
            left: '',
            right: '',
            width: ''
        });
        window.scrollTo(0, menuScrollY);
    }

    function closeMenu() {
        if (!$('body').hasClass('tablet-menu-open')) return;
        $('.tablet-menu-toggle').attr('aria-expanded', 'false').attr('aria-label', '메뉴 열기');
        $('header .gnb > li').removeClass('accordion-open');
        $('header .sub').stop(true, true).hide();
        unlockBody();
    }

    function bindTabletHeader() {
        ensureTabletMenuButton();

        // PC hover 메뉴 로직이 태블릿에서 보이지 않도록 뒤에서 즉시 닫아줌
        // (기존 PC 이벤트 자체는 제거하지 않아, 다시 PC 폭으로 돌아가도 그대로 작동)
        $('.headerbg').stop(true, true).hide();
        $('header').off('.tabletHeaderGuard')
            .on('mouseenter.tabletHeaderGuard mouseleave.tabletHeaderGuard', function () {
                if (!mq.matches) return;
                $('.headerbg').stop(true, true).hide();
                if (!$('body').hasClass('tablet-menu-open')) {
                    $('header .sub').stop(true, true).hide();
                }
            });
        $('header .sub').stop(true, true).hide();
        $('header').removeClass('none').addClass('on');

        $('.tablet-menu-toggle').off('.tablet768').on('click.tablet768', function () {
            const isOpen = $('body').hasClass('tablet-menu-open');
            if (isOpen) {
                closeMenu();
            } else {
                $(this).attr('aria-expanded', 'true').attr('aria-label', '메뉴 닫기');
                $('header .gnb > li').removeClass('accordion-open');
                $('header .sub').hide();
                lockBody();
            }
        });

        $('header .gnb > li > a').off('.tablet768').on('click.tablet768', function (e) {
            const $li = $(this).parent('li');
            const $sub = $li.children('.sub');

            if (!$sub.length) return;

            e.preventDefault();
            const wasOpen = $li.hasClass('accordion-open');

            $li.siblings().removeClass('accordion-open').children('.sub').stop(true, true).slideUp(180);

            if (wasOpen) {
                $li.removeClass('accordion-open');
                $sub.stop(true, true).slideUp(180);
            } else {
                $li.addClass('accordion-open');
                $sub.stop(true, true).slideDown(180);
            }
        });
    }

    function setupLifeGuideSwiper() {
        const el = document.querySelector('.life');
        if (!el) return;

        if (el.swiper) {
            el.swiper.destroy(true, true);
        }

        lifeTabletSwiper = new Swiper(el, {
            effect: 'creative',
            direction: 'vertical',
            slidesPerView: 1,
            loop: true,
            initialSlide: 1,
            autoplay: {
                delay: 2200,
                disableOnInteraction: false
            },
            speed: 800,
            creativeEffect: {
                limitProgress: 3,
                prev: {
                    translate: ['8%', '-18%', -130],
                    rotate: [0, 0, 4]
                },
                next: {
                    translate: ['8%', '18%', -130],
                    rotate: [0, 0, -11]
                }
            }
        });
    }

    function setupCommunitySwipers() {
        communityTabletSwipers.forEach(sw => {
            try { sw.destroy(true, true); } catch (e) { }
        });
        communityTabletSwipers = [];

        const columns = document.querySelectorAll('.community .slide-wrap > .swiper');

        columns.forEach((el, index) => {
            if (el.swiper) {
                try { el.swiper.destroy(true, true); } catch (e) { }
            }

            // 768 Figma: 제일 오른쪽 4번째 column 제거
            if (index === 3) return;

            const reverse = el.classList.contains('insta-down');
            const sw = new Swiper(el, {
                direction: 'vertical',
                slidesPerView: 4,
                spaceBetween: 17,
                loop: true,
                allowTouchMove: false,
                autoplay: {
                    delay: 1,
                    disableOnInteraction: false,
                    reverseDirection: reverse
                },
                speed: 5600
            });
            communityTabletSwipers.push(sw);
        });
    }

    function updateGoTopPosition() {
        if (!mq.matches) return;
        const $gotop = $('.gotop');
        const $footer = $('footer');
        if (!$gotop.length || !$footer.length) return;

        // Figma stop position: campaign right 36 / bottom 42, 48x48
        const viewportH = window.innerHeight;
        const footerTop = $footer.offset().top;
        const stopTop = footerTop - 42 - 48;
        const fixedTop = $(window).scrollTop() + viewportH - 36 - 48;

        $gotop.css({ right: '36px', width: '48px', height: '48px' });

        if (fixedTop >= stopTop) {
            $gotop.addClass('tablet-stop').css({
                position: 'absolute',
                right: '36px',
                bottom: '42px'
            });
        } else {
            $gotop.removeClass('tablet-stop').css({
                position: 'fixed',
                right: '36px',
                bottom: '36px'
            });
        }
    }

    function activateTablet() {
        bindTabletHeader();
        setupLifeGuideSwiper();
        setupCommunitySwipers();
        updateGoTopPosition();

        $(window).off('.tablet768').on('scroll.tablet768 resize.tablet768', function () {
            $('header').removeClass('none').addClass('on');
            updateGoTopPosition();
        });
    }

    function restoreDesktopSwipers() {
        const lifeEl = document.querySelector('.life');
        if (lifeEl && lifeEl.swiper) {
            try { lifeEl.swiper.destroy(true, true); } catch (e) { }
        }
        if (lifeEl) {
            new Swiper(lifeEl, {
                effect: 'creative',
                direction: 'vertical',
                slidesPerView: 1,
                loop: true,
                autoplay: { delay: 2000, disableOnInteraction: false },
                speed: 800,
                creativeEffect: {
                    prev: { translate: [0, '-12%', -120], rotate: [0, 0, -3] },
                    next: { translate: [0, '12%', -120], rotate: [0, 0, 3] }
                }
            });
        }

        document.querySelectorAll('.community .slide-wrap > .swiper').forEach((el) => {
            if (el.swiper) {
                try { el.swiper.destroy(true, true); } catch (e) { }
            }
            new Swiper(el, {
                direction: 'vertical',
                slidesPerView: 3,
                spaceBetween: 150,
                loop: true,
                autoplay: {
                    delay: 1,
                    reverseDirection: el.classList.contains('insta-down')
                },
                speed: 6000
            });
        });
    }

    function deactivateTablet() {
        closeMenu();
        $('.tablet-menu-toggle').remove();
        $('header').off('.tabletHeaderGuard');
        $('header .gnb > li').removeClass('accordion-open');
        $('header .sub').attr('style', '');
        $('.gotop').removeClass('tablet-stop').attr('style', '');
        $(window).off('.tablet768');
        if (lifeTabletSwiper || communityTabletSwipers.length) {
            restoreDesktopSwipers();
            lifeTabletSwiper = null;
            communityTabletSwipers = [];
        }
    }

    function handleBreakpoint() {
        if (mq.matches) {
            activateTablet();
        } else {
            deactivateTablet();
        }
    }

    handleBreakpoint();

    if (mq.addEventListener) {
        mq.addEventListener('change', handleBreakpoint);
    } else {
        mq.addListener(handleBreakpoint);
    }
});


})