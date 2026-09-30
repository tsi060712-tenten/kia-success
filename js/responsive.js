$(function () {
    const mq = window.matchMedia('(max-width: 768px)');
    const mobileLifeMq = window.matchMedia('(max-width: 425px)');
    // 햄버거 메뉴 열기 전에 보고 있던 스크롤 위치 저장
    let menuScrollY = 0;
    let lifeSwiperMode = null;

    // 425px 이하는 일반 가로형 카드, 그보다 큰 화면은 기존 세로형 카드 유지
    function syncLifeGuideSwiper() {
        const lifeElement = document.querySelector('.swiper.life');

        if (!lifeElement || typeof Swiper === 'undefined') return;

        const nextMode = mobileLifeMq.matches ? 'mobile-horizontal' : 'stacked-vertical';
        const currentSwiper = lifeElement.swiper;

        if (currentSwiper && lifeSwiperMode === nextMode) return;
        if (currentSwiper) currentSwiper.destroy(true, true);

        if (mobileLifeMq.matches) {
            new Swiper(lifeElement, {
                direction: 'horizontal',
                slidesPerView: 1,
                spaceBetween: 16,
                loop: true,
                speed: 700,
                autoplay: {
                    delay: 2500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                }
            });
        } else {
            new Swiper(lifeElement, {
                effect: 'creative',
                direction: 'vertical',
                slidesPerView: 1,
                loop: true,
                speed: 800,
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: false
                },
                creativeEffect: {
                    prev: {
                        translate: [0, '-12%', -120],
                        rotate: [0, 0, -3]
                    },
                    next: {
                        translate: [0, '12%', -120],
                        rotate: [0, 0, 3]
                    }
                }
            });
        }

        lifeSwiperMode = nextMode;
    }

    // 1. 햄버거 버튼 만들기
    function ensureTabletMenuButton() {
        // 이미 햄버거 버튼이 있으면 중복 생성하지 않음
        if (!$('.tablet-menu-toggle').length) {
            // header 안의 .inner 맨 뒤 자식으로 버튼 추가(span 3개)
            $('header .inner').append(
                '<button class="tablet-menu-toggle" type="button" aria-label="메뉴 열기" aria-expanded="false">' +
                '<span></span><span></span><span></span>' +
                '</button>'
            );
        }
    }

    // 2. 햄버거 메뉴 열렸을 때 body 스크롤 막기
    function lockBody() {
        // 현재 스크롤 위치 저장
        menuScrollY = window.scrollY || $(window).scrollTop();
        // body 자체를 fixed 처리해서 뒤쪽 페이지가 스크롤 되지 않게 만듦
        $('body').css({
            position: 'fixed',
            // 현재 위치만큼 위로 당겨서 메뉴 열기 전 화면이 그대로 보이게 함
            top: -menuScrollY + 'px',
            left: 0,
            right: 0,
            width: '100%'
            // 메뉴가 열린 상태라는 표시용 클래스
        }).addClass('tablet-menu-open');
    }

    // 3. 햄버거 메뉴 닫았을 때 body 스크롤 원상복구
    function unlockBody() {
        $('body').removeClass('tablet-menu-open').css({
            position: '',
            top: '',
            left: '',
            right: '',
            width: ''
        });
        // 메뉴 열기 전에 보던 위치로 다시 복귀
        window.scrollTo(0, menuScrollY);
    }
    
    // 4. 햄버거 메뉴 전체 닫기
    function closeMenu() {
        // 메뉴가 이미 닫혀 있으면 실행 안함
        if (!$('body').hasClass('tablet-menu-open')) return;
        // 햄버거 버튼 접근성 상태 초기화
        $('.tablet-menu-toggle').attr('aria-expanded', 'false').attr('aria-label', '메뉴 열기');
        // 현재 열려있는 아코디언 메뉴 표시 제거
        $('header .gnb > li').removeClass('accordion-open');
        // 모든 서브메뉴 닫기
        $('header .sub').stop(true, true).hide();
        // body 스크롤 다시 활성화
        unlockBody();
    }

    // 5. 768px 이하 헤더 / 햄버거 / 아코디언 세팅
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
    function activateTablet() {
        bindTabletHeader();
        syncLifeGuideSwiper();

        $(window).off('.tablet768').on('scroll.tablet768 resize.tablet768', function () {
            $('header').removeClass('none').addClass('on');
        });
    }
    function deactivateTablet() {
        closeMenu();
        $('.tablet-menu-toggle').remove();
        $('header').off('.tabletHeaderGuard');
        $('header .gnb > li').removeClass('accordion-open');
        $('header .sub').attr('style', '');
        $('.gotop').removeClass('tablet-stop');
        syncLifeGuideSwiper();
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

    if (mobileLifeMq.addEventListener) {
        mobileLifeMq.addEventListener('change', syncLifeGuideSwiper);
    } else {
        mobileLifeMq.addListener(syncLifeGuideSwiper);
    }
});
