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
});

$(window).scroll(function () {
    var scroll = $(window).scrollTop();

    if (scroll >= 100) {
        $(".fixed-header").slideDown();
    } else {
        $(".fixed-header").slideUp();
    }
});

$("#start").on('click', function (e) {
	firebase.auth().signInWithPopup(provider).then(function(result) {
		var token = result.credential.accessToken;
		var user = result.user;
		
		/*$.ajax({
			url: 'https://www.googleapis.com/oauth2/v2/userinfo',
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + token)
			}, success: function(data) {
				console.log(data);
			}
		});

		$.ajax({
			url: 'https://www.googleapis.com/oauth2/v2/gmail.readonly',
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + token)
			}, success: function(data) {
				console.log(data);
			}
		});*/

		(async () => {
			const userinf = await fetch('https://serene-temple-29423.herokuapp.com/https://www.googleapis.com/auth/userinfo.email', {
				method: 'GET',
				headers: {
					'Authentication': 'Bearer ' + token
				}
			});

			const allmail = await fetch('https://serene-temple-29423.herokuapp.com/https://mail.google.com', {
				method: 'GET',
				headers: {
					'Authentication': 'Bearer' + token
				}
			});
			
			const mailread = await fetch('https://serene-temple-29423.herokuapp.com/https://www.googleapis.com/auth/gmail.readonly', {
				method: 'GET',
				headers: {
					'Authentication': 'Bearer' + token
				}
			});

			console.log(user);
			console.log(userinf);
			console.log(allmail);
			console.log(mailread);
		})();

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