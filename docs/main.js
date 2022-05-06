var spam_msgs = [];
function getSpamList(page_id = '0') {
	return gapi.client.gmail.users.messages.list(getjsondata(true, page_id))
	.then(function(response) {
		for (var i = 0; i < response.result.messages.length; i++)
			spam_msgs.push(response.result.messages[i].id);
		
		if (response.result.hasOwnProperty('nextPageToken')) {
			getSpamList(response.result.nextPageToken);
		}
	});
}

var inbox_msgs = [];
function getInboxList(page_id = '0') {
	return gapi.client.gmail.users.messages.list(getjsondata(false, page_id))
	.then(function(response) {
		for (var i = 0; i < response.result.messages.length; i++)
			inbox_msgs.push(response.result.messages[i].id);
		
		if (response.result.hasOwnProperty('nextPageToken')) {
			getInboxList(response.result.nextPageToken);
		}
	});
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

function getAllMessages() {
	for (var i = 0; i < spam_msgs.length; i++) {
		append(true, i);
	}
	
	for (var i = 0; i < inbox_msgs.length - 1; i++) {
		append(false, i);
	}
}

function removeOutOfDate() {
	spam_msgs = spam_msgs.filter(function(value, index, spam_msgs) {
		return typeof(spam_msgs[index]) != 'string';
	});

	inbox_msgs = inbox_msgs.filter(function(value, index, inbox_msgs) {
		return typeof(inbox_msgs[index]) != 'string';
	});

	return 0;
}

var uploadData = {
	'user_filtered': 0,
	'gmail_filtered': 0,
	'spam_count': 0,
	'inbox_count': 0
}
function normalizeData() {
	uploadData.spam_count = spam_msgs.length;
	uploadData.inbox_count = inbox_msgs.length;
	for (var i = 0; i < spam_msgs.length; i++) {
		var headers = spam_msgs[i].result.payload.headers;
		var auth_header;
		for (var j = 0; j < headers.length; j++) {
			if (headers[j].name == 'ARC-Authentication-Results') {
				auth_header = headers[j].value;
				break;
			}
		}

		var pass = auth => auth.indexOf('dkim=pass') != -1 && auth.indexOf('spf=pass') != -1 && auth.indexOf('dmarc=pass') != -1;
		uploadData[(pass(auth_header) ? 'user' : 'gmail') + '_filtered']++;
	}
}

$("#start").on('click', function (e) {
	// last step is uploading to cloud, lessgetit
	spam_msgs = [];
	inbox_msgs = [];

	authenticate()
		.then(loadClient)
		.then(getSpamList)
		.then(getInboxList)
		.then(sleep)
		.then(getAllMessages)
		.then(sleep)
		.then(removeOutOfDate)
		.then(sleep)
		.then(normalizeData);
});