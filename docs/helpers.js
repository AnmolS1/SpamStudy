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

async function sleep() {
	await new Promise(r => setTimeout(r, 5000));
	return 0;
}