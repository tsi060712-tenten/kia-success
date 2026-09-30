$(function () {
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


    $('.faq-box > li').click(function () {

        const $this = $(this);

        // 이미 열려있는 FAQ인지 확인
        const isOpen = $this.hasClass('active');

        // 다른 FAQ 닫기
        $('.faq-box > li').removeClass('active');
        $('.faq-box > li > ul').stop(true, true).slideUp(300);

        // 닫혀있던 FAQ라면 열기
        if (!isOpen) {
            $this.addClass('active');
            $this.children('ul').stop(true, true).slideDown(300);
        }
        

    });

    $(window).scroll(function () {
        if ($('.banner').offset().top + 500 <= $(window).scrollTop()+ $(window).height()) {
            $('.gotop').css({
                position : 'absolute',
            })
        } else {
            $('.gotop').css({
                position : 'fixed',
            })
        }
    })

    // gotop 버튼
    $('.gotop').click(function (e) {
        e.preventDefault()
        $('html, body').animate({
            scrollTop: 0
        }, 800)
    })

    // 팝업
    $('.outdoor-banner .inner .category a:nth-child(2),.outdoor-banner .inner .category a:nth-child(3)').click(function (e) {
        e.preventDefault()
        $('.popupbg').show()
        $('.gotop').hide()
        $('body').addClass('popup-open');
    })
    $('.popup button').click(function () {
        $('.popupbg').hide()
        $('.gotop').show()
        $('body').removeClass('popup-open');
        $('.category>a:first').css({
            'box-shadow': '5px 5px 5px rgba(0,0,0,.8)',
            opacity: 1
        })
        $('.category>a:first').siblings().css({
            opacity: .5
        })

    })
    $('.category > a').click(function(e){
        e.preventDefault()
        $(this).css({
            opacity: 1
        })
        $(this).siblings().css({
            'box-shadow': '0px 0px 0px rgba(0,0,0,0)',
            opacity: .5
        })
    })


  
})