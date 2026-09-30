// ========= header =========

document.addEventListener("DOMContentLoaded", () => {
    const revealTargets = document.querySelectorAll(
        ".driving-spot .spot-card, .coruse-card, .wide-card, .visual-grid article, .care-cards article"
    );

    revealTargets.forEach(el => el.classList.add("reveal"));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealTargets.forEach(el => observer.observe(el));
});

// CAR CARE  이벤트 경고창

document.addEventListener('DOMContentLoaded', () => {
    const careCards = document.querySelectorAll('.care-cards article');

    careCards.forEach((card) => {
        card.addEventListener('click', () => {
            alert('진행중인 이벤트가 아닙니다.');
        });
    });
});



//GOTOP BUTTON

$(function(){
    $(window).scroll(function(){
        if($('.course-cta').offset().top - 280 <= $(window).scrollTop()){
            $('.gotop').css({
                bottom : '480px',
                position : 'fixed'
            })
        }else{
            $('.gotop').css({
                bottom : '30px',
                position : 'fixed',
            })
        }
    })

    // gotop 버튼
    $('.gotop').click(function(e){
        e.preventDefault()
        $('html, body').animate({
            scrollTop : 0
        },800)
    })

    // header 효과

    let lastScroll = 0;
    $(window).on("scroll", function () {

        const st = $(this).scrollTop();

        // 맨 위
        if (st === 0) {
            $('header').removeClass('on')
        }
        // 내릴때
        else if (st > lastScroll) {
            $('header').addClass('on')
            $('header').addClass('none')
        }

        // 올릴때
        else {
            $('header').addClass('on')
            $('header').removeClass('none')
        }

        lastScroll = st;
    });

    $('header .gnb').mouseenter(function(){
        $('.headerbg').stop().slideDown(100)
        $('.sub').stop().slideDown(200)
        $('header').addClass('on')
    })
    $('header').mouseleave(function(){
        $('.headerbg').stop().slideUp(200)
        $('.sub').stop().slideUp(100)
        // $('header').removeClass('on')
    })

    $("header").mouseleave(function () {
        const st = $(window).scrollTop();

        if (st === 0) {
        $("header").removeClass("on");
        } else {
        $("header").addClass("on");
        }
    });

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

    function deactivateTablet() {
        closeMenu();
        $('.tablet-menu-toggle').remove();
        $('header').off('.tabletHeaderGuard');
        $('header .gnb > li').removeClass('accordion-open');
        $('header .sub').attr('style', '');
        $('.gotop').removeClass('tablet-stop').attr('style', '');
        $(window).off('.tablet768');
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