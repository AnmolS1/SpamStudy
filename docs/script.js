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

    if (navigator.userAgent.includes("Mac")) {
        document.getElementById("downloader").setAttribute('href', 'https://raw.githubusercontent.com/AnmolS1/SpamStudy/main/docs/mac-download.zip');
        document.getElementById("python-download").setAttribute('href', 'https://www.python.org/ftp/python/3.10.2/python-3.10.2-macos11.pkg');
        document.getElementById("run-cmd").textContent = 'right click the file and click open';
    } else {
        document.getElementById("downloader").setAttribute('href', 'https://raw.githubusercontent.com/AnmolS1/SpamStudy/main/docs/windows-download.zip');
        document.getElementById("python-download").setAttribute('href', 'https://www.python.org/ftp/python/3.9.12/python-3.9.12-amd64.exe');
        document.getElementById("run-cmd").textContent = 'right click the file and click run as administrator';
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