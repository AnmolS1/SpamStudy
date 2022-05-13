var encoded_config = {
	google_api_key: 'QUl6YVN5Q1FHQnRIQmIxOWM1d3RTYkxpU01ka01BU2RpODVySFlN',
	google_client_id: 'NTc0MzQzNzEwODMxLWFiMGlwMG0zcnRia20yZmE2bDBic2E0aXNrajN0MDFwLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t',
	ibm_db_url: 'aHR0cHM6Ly80NzllYjM1ZC03ODE3LTRlZGItYWNkNC0zMjNjZDY3NmUxM2YtYmx1ZW1peC5jbG91ZGFudG5vc3FsZGIuYXBwZG9tYWluLmNsb3Vk',
	ibm_db_key: 'bkN0c0hzNkxRSHpXUmNOUU9BQnRSSWJPVDNUVzFOYkV1TlNURTBWR0gxTHU'
};

var config = {
	google_api_key: atob(encoded_config.google_api_key),
	google_client_id: atob(encoded_config.google_client_id),
	ibm_db_url: atob(encoded_config.ibm_db_url),
	ibm_db_key: atob(encoded_config.ibm_db_key)
}

var spam_msgs = [];
var inbox_msgs = [];

var uploadData = {
	'user_filtered': 0,
	'gmail_filtered': 0,
	'spam_count': 0,
	'inbox_count': 0
};