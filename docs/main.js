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
		var headers = response.result.payload.headers;
		var date;
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

	return 0;
}

var user_filtered_ids = [];
function getHistory() {
	var lowest_history = Infinity;
	for (var i = 0; i < spam_msgs.length; i++) {
		lowest_history = Math.min(lowest_history, parseInt(spam_msgs[i].result.historyId));
	}

	return gapi.client.gmail.users.history.list({
		'userId': 'me',
		'historyTypes': ['labelAdded'],
		'labelId': 'SPAM',
		'startHistoryId': lowest_history
	}).then(function(response) {
		for (var i = 0; i < response.result.history.length; i++) {
			user_filtered_ids.push(response.result.history[i].messages[0].id);
		}
	})
}

function normalizeData() {
	for (var i = 0; i < spam_msgs.length; i++) {
		var headers = spam_msgs[i].result.payload.headers;
		var date, foundDate = false;
		var from, foundFrom = false;
		for (var el in headers) {
			if (!foundDate && headers[el].name == 'Date') {
				date = headers[el].value;
				foundDate = true;
			}
			if (!foundFrom && headers[el].name == 'From') {
				from = headers[el].value;
				from = from.substring(from.indexOf('<') + 1, from.indexOf('>'));
				foundFrom = true;
			}
		}
		var content = spam_msgs[i].result.payload.hasOwnProperty("parts") ? spam_msgs[i].result.payload.parts[1].body.data : spam_msgs[i].result.payload.body.data;

		var data = {
			'category': (user_filtered_ids.includes(spam_msgs[i].result.id) ? 'user' : 'gmail'),
			'from': from,
			'time_stamp': date,
			'content': content,
			'unread': spam_msgs[i].result.labelIds.includes('UNREAD')
		}

		spam_msgs[i] = data;
	}

	for (var i = 0; i < inbox_msgs.length; i++) {
		var headers = inbox_msgs[i].result.payload.headers;
		var date, foundDate = false;
		var from, foundFrom = false;
		for (var el in headers) {
			if (!foundDate && headers[el].name == 'Date') {
				date = headers[el].value;
				foundDate = true;
			}
			if (!foundFrom && headers[el].name == 'From') {
				from = headers[el].value;
				from = from.indexOf("<") != -1 ? from.substring(from.indexOf('<') + 1, from.indexOf('>')) : from;
				foundFrom = true;
			}
		}
		var data = {
			'from': from,
			'time_stamp': date,
			'content': content,
			'unread': inbox_msgs[i].result.labelIds.includes('UNREAD')
		}

		inbox_msgs[i] = data;
	}

	console.log(spam_msgs);
	console.log(inbox_msgs);
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
		.then(getHistory)
		.then(sleep)
		.then(normalizeData);
});