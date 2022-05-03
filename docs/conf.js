var encoded_config = {
	api_key: 'QUl6YVN5Q1FHQnRIQmIxOWM1d3RTYkxpU01ka01BU2RpODVySFlN',
	authorized_domain: 'c3BhbXN0dWR5LmZpcmViYXNlYXBwLmNvbQ==',
	client_id: 'NTc0MzQzNzEwODMxLWFiMGlwMG0zcnRia20yZmE2bDBic2E0aXNrajN0MDFwLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t'
};

var config = {
	api_key: atob(encoded_config.api_key),
	authorized_domain: atob(encoded_config.authorized_domain),
	client_id: atob(encoded_config.client_id)
}