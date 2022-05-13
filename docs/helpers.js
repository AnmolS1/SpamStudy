var pass = auth => auth.indexOf('dkim=pass') != -1 && auth.indexOf('spf=pass') != -1 && auth.indexOf('dmarc=pass') != -1;

gapi.load("client:auth2", function() {
	gapi.auth2.init({client_id: config.google_client_id});
});

function authenticate() {
	var scopes = [
		'https://www.googleapis.com/auth/gmail.metadata',
		'https://www.googleapis.com/auth/spreadsheets'
	];
	
	return gapi.auth2.getAuthInstance().signIn({
		scope: scopes.join(' ')
	}).then(function() {
		console.log('Sign-in successful');
	}, function(err) {
		console.error('Error signing in', err);
	});
}

function loadGmailClient() {
	gapi.client.setApiKey(config.google_api_key);
	return gapi.client.load('https://gmail.googleapis.com/$discovery/rest?version=v1').then(function() {
		console.log('GAPI Gmail client loaded for API');
	}, function(err) {
		console.error('Error loading GAPI Gmail client for API', err);
	});
}

function loadSheetClient() {
	return gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4').then(function() {
		console.log('GAPI Sheets client loaded for API');
	}, function(err) {
		console.error('Error loading GAPI Sheets client for API', err);
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

const today = new Date();
function append(isSpam, index) {
	return gapi.client.gmail.users.messages.get({
		'userId': 'me',
		'id': isSpam ? spam_msgs[index] : inbox_msgs[index]
	}).then(function(response) {
		var headers = response.result.payload.headers, date;
		for (i in headers) {
			if (headers[i].name == 'Date') {
				date = Date.parse(headers[i].value);
				break;
			}
		}
		
		if (Math.floor((today - date) / 86400000.) < 31) {
			if (isSpam) {
				spam_msgs[index] = response;
			} else {
				inbox_msgs[index] = response;
			}
		}
	});
}