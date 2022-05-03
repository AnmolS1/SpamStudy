/* -------------------- BASIC DOC SCRIPTS -------------------- */

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

/* -------------------- PROCESSING SCRIPTS -------------------- */

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
	return gapi.client.load("https://gmail.googleapis.com/$discovery/rest?version=v1").then(function() {
		console.log("GAPI client loaded for API");
	}, function(err) {
		console.error("Error loading GAPI client for API", err);
	});
}

function getjsondata(isSpam, page_id) {
	return {
		'userId': 'me',
		'includeSpamTrash': isSpam,
		'labelIds': [isSpam ? 'SPAM' : 'INBOX'],
		'maxResults': 500,
		'pageToken': page_id
	};
}

var spam_msgs = [];
function getspamlist(page_id = '0') {
	return gapi.client.gmail.users.messages.list(getjsondata(true, page_id))
	.then(function(response) {
		for (var i = 0; i < response.result.messages.length; i++)
			spam_msgs.push(response.result.messages[i].id);
		
		if (response.result.hasOwnProperty('nextPageToken')) {
			getspamlist(response.result.nextPageToken);
		}
	});
}

var inbox_msgs = [];
function getinboxlist(page_id = '0') {
	return gapi.client.gmail.users.messages.list(getjsondata(false, page_id))
	.then(function(response) {
		for (var i = 0; i < response.result.messages.length; i++)
			inbox_msgs.push(response.result.messages[i].id);
		
		if (response.result.hasOwnProperty('nextPageToken')) {
			getinboxlist(response.result.nextPageToken);
		}
	});
}

async function sleep() {
	await new Promise(r => setTimeout(r, 5000));
	return 0;
}

$("#start").on('click', function (e) {
	// to get user count: check blocked list and ids in history
	spam_msgs = [];
	inbox_msgs = [];
	authenticate()
		.then(loadClient)
		.then(getspamlist)
		.then(getinboxlist)
		.then(sleep);
});