var config = {
	apiKey: atob(conf.api_key),
	authDomain: atob(conf.domain),
};
firebase.initializeApp(config);

var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://mail.google.com');
firebase.auth().useDeviceLanguage();
provider.setCustomParameters({
	'login_hint': 'user@example.com'
});



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

    /*if (navigator.userAgent.includes("Mac")) {
        document.getElementById("python-download").setAttribute('href', 'https://www.python.org/ftp/python/3.10.2/python-3.10.2-macos11.pkg');
        document.getElementById("run-cmd").textContent = 'right click the file and click open';
    } else {
        document.getElementById("python-download").setAttribute('href', 'https://www.python.org/ftp/python/3.9.12/python-3.9.12-amd64.exe');
        document.getElementById("run-cmd").textContent = 'right click the file and click run as administrator';
    }*/
});

$(window).scroll(function () {
    var scroll = $(window).scrollTop();

    if (scroll >= 100) {
        $(".fixed-header").slideDown();
    } else {
        $(".fixed-header").slideUp();
    }
});

/*function validateUsername(emailid) {
	const regex = /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/gi
	if (!regex.test(emailid)) {
		return false;
	}
	return true;
}*/

$("#start").on('click', function (e) {
	/*var uname = document.getElementById("username").value;
	var pword = document.getElementById("password").value;
	
	if (!validateUsername(uname)) {
		alert('Please enter a valid gmail account');
		return false;
	}
	
	console.log (uname);
	console.log (pword);

	return true;*/

	firebase.auth().signInWithPopup(provider).then(function(result) {
		// this gives us a Google Access Token
		// use it to access the google api
		var token = result.credential.accessToken;
		
		// the signed-in user info.
		var user = result.user;
		
		// console.log(token);
		// console.log(user);
		
		// use token to access google api
		$.ajax({
			url: 'https://www.googleapis.com/oauth2/v2/userinfo',
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + token)
			}, success: function(data) {
				console.log(data);
			}
		});

	}).catch(function(error) {
		// handle errors
		var errorCode = error.code;
		var errorMessage = error.message;
		
		var email = error.email;
		
		var credential = error.credential;
		
		console.log(errorCode);
		console.log(errorMessage);
		console.log(email);
		console.log(credential);
	});
});