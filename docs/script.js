$(document).ready(function () {
    $('a[href^="#"').on('click', function (e) {
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
        document.getElementById("python-download").setAttribute('href', 'https://www.python.org/ftp/python/3.10.2/python-3.10.2-macos11.pkg');
        document.getElementById("run-cmd").textContent = 'right click the file and click open';
    } else {
        document.getElementById("python-download").setAttribute('href', 'https://www.python.org/ftp/python/3.9.12/python-3.9.12-amd64.exe');
        document.getElementById("run-cmd").textContent = 'right click the file and click run as administrator';
    }
});

$(window).scroll(function () {
    var scroll = $(window).scrollTop();

    if (scroll >= 100) {
        $(".fixed-header").slideDown();
    } else {
        $(".fixed-header").slideUp();
    }
});

function validateUsername(emailid) {
	const regex = /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/gi
	if (!regex.test(emailid)) {
		return false;
	}
	return true;
}

$("#start").on('click', function (e) {
	var uname = document.getElementById("username").value;
	var pword = document.getElementById("password").value;
	
	if (!validateUsername(uname)) {
		alert('Please enter a valid gmail account');
		return false;
	}
	
	console.log (uname);
	console.log (pword);

	return true;
});