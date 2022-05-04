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
		var date = response.result.payload.headers[1].value;
		date = Date.parse(date.substring(date.indexOf(";") + 1).trim());

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
	
	for (var i = 0; i < inbox_msgs.length; i++) {
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
}

$("#start").on('click', function (e) {
	// to get user count: check blocked list and ids in history
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
		.then(sleep);
});