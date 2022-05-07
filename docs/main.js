function loadClients() {
	return loadGmailClient().then(loadSheetClient);
}

function getSpamList(page_id = '0') {
	return gapi.client.gmail.users.messages.list(getjsondata(true, page_id))
	.then(function(response) {
		for (var i = 0; i < response.result.messages.length; i++)
			spam_msgs.push(response.result.messages[i].id);
		
		if (response.result.hasOwnProperty('nextPageToken'))
			getSpamList(response.result.nextPageToken);
	});
}

function getInboxList(page_id = '0') {
	return gapi.client.gmail.users.messages.list(getjsondata(false, page_id))
	.then(function(response) {
		for (var i = 0; i < response.result.messages.length; i++)
			inbox_msgs.push(response.result.messages[i].id);
		
		if (response.result.hasOwnProperty('nextPageToken'))
			getInboxList(response.result.nextPageToken);
	});
}

function getAllMessages() {
	for (var i = 0; i < spam_msgs.length; i++)
		append(true, i);
	
	for (var i = 0; i < inbox_msgs.length - 1; i++)
		append(false, i);
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

function normalizeData() {
	uploadData.spam_count = spam_msgs.length;
	uploadData.inbox_count = inbox_msgs.length;

	for (var i = 0; i < spam_msgs.length; i++) {
		var headers = spam_msgs[i].result.payload.headers, auth_header;
		for (var j = 0; j < headers.length; j++)
			if (headers[j].name == 'ARC-Authentication-Results') {
				auth_header = headers[j].value;
				break;
			}

		uploadData[(pass(auth_header) ? 'user' : 'gmail') + '_filtered']++;
	}

	return uploadData;
}

function uploadToSheet() {
	return gapi.client.sheets.spreadsheets.values.batchGetByDataFilter({
		'spreadsheetId': '1GIHMGmctb7fXok6xJpRyq8RnJVH7k7CaU3xc-9Dmtlg',
		'resource': {
			'majorDimension': 'ROWS',
			'dataFilters': {
				'a1Range': 'Sheet1'
			}
		}
	}).then(function (response) {
		var row = response.result.valueRanges[0].valueRange.values.length + 1;

		return gapi.client.sheets.spreadsheets.values.append({
			'spreadsheetId': '1GIHMGmctb7fXok6xJpRyq8RnJVH7k7CaU3xc-9Dmtlg',
			'range': 'Sheet1!A' + row + ':D' + row,
			'valueInputOption': 'RAW',
			'resource': {
				'values': [[
					uploadData['user_filtered'],
					uploadData['gmail_filtered'],
					uploadData['spam_count'],
					uploadData['inbox_count']
				]]
			}
		});
	});
}

$("#start").on('click', function (e) {
	spam_msgs = [];
	inbox_msgs = [];
	uploadData = {
		'user_filtered': 0,
		'gmail_filtered': 0,
		'spam_count': 0,
		'inbox_count': 0
	};

	authenticate()
		.then(loadClients)
		.then(sleep)
		.then(getSpamList)
		.then(getInboxList)
		.then(sleep)
		.then(getAllMessages)
		.then(sleep)
		.then(removeOutOfDate)
		.then(sleep)
		.then(normalizeData)
		.then(uploadToSheet);
});