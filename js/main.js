$(function(){
    // gotop 버튼: 모든 화면에서 footer 전까지 fixed,
    // footer에 닿는 순간 main 영역 안에서 absolute로 정지
    function updateGoTopPosition() {
        const $gotop = $('.gotop');
        const $footer = $('footer');

        if (!$gotop.length || !$footer.length) return;

        const viewportBottom = $(window).scrollTop() + $(window).height();
        const footerTop = $footer.offset().top;

        $gotop.toggleClass('footer-stop', viewportBottom >= footerTop);
    }

    $(window).on(
        'scroll.gotopStop resize.gotopStop load.gotopStop',
        updateGoTopPosition
    );

    updateGoTopPosition();
    

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

    // PC navigation: animation queues and duplicate mouseleave handlers made
    // the header flicker when the pointer crossed menu items.
    const $header = $('header');
    const $headerBg = $('.headerbg');
    const $desktopSub = $header.find('.sub');
    const tabletMq = window.matchMedia('(max-width: 768px)');

    $header
        .off('.desktopNavigation')
        .on('mouseenter.desktopNavigation', function () {
            if (tabletMq.matches) return;

            $headerBg.stop(true, true).slideDown(120);
            $desktopSub.stop(true, true).slideDown(120);
            $header.addClass('on');
        })
        .on('mouseleave.desktopNavigation', function () {
            if (tabletMq.matches) return;

            $headerBg.stop(true, true).slideUp(120);
            $desktopSub.stop(true, true).slideUp(120);
            $header.toggleClass('on', $(window).scrollTop() > 0);
        });
})
