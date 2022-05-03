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

gapi.load("client:auth2", function() {
	gapi.auth2.init({client_id: config.client_id});
});

function authenticate() {
	var scopes = [
		'https://mail.google.com/',
		'https://www.googleapis.com/auth/gmail.modify',
		'https://www.googleapis.com/auth/gmail.readonly'
	];
	
	return gapi.auth2.getAuthInstance().signIn({
		scope: scopes.join(' ')
	}).then(function() {
		console.log("Sign-in successful");
	}, function(err) {
		console.error("Error signing in", err);
	});
}

function loadClient() {
	gapi.client.setApiKey(config.apiKey);
	return gapi.client.load("https://gmail.googleapis.com/$discovery/rest?version=v1")
		.then(function() {
			console.log("GAPI client loaded for API");
		}, function(err) {
			console.error("Error loading GAPI client for API", err);
		});
}

function execute() {
	return gapi.client.gmail.users.messages.list({
		'userId': 'me'
	}).then(function(response) {
		// handle the results here (response.result has the parsed body).
		console.log("Response", response);
	}, function(err) {
		console.error("Execute error", err);
	});
}

$("#start").on('click', function (e) {
	authenticate().then(loadClient).then(execute);
});