$(document).ready(function() {
    $('a[href^="#"').on('click', function(e) {
        e.preventDefault();

        var target = this.hash;
        var $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 900, 'swing', function() {
            window.location.hash = target;
        });
    });

    var downloader = document.getElementById("downloader");
    if (navigator.userAgent.includes("Mac")) {
        downloader.setAttribute('href', 'https://raw.githubusercontent.com/AnmolS1/SpamStudy/main/docs/mac-download.zip');
    } else {
        // set attribute to batch file here
    }
});

$(window).scroll(function() {
    var scroll = $(window).scrollTop();

    if (scroll >= 100) {
        $(".fixed-header").slideDown();
    } else {
        $(".fixed-header").slideUp();
    }
});