const getData = () => {
    fetch('data.json', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(function (response) {
        return response.json();
    }).then(function (resJSON) {
        var content = '';
        for (var i = 0; i < resJSON.length; i++) {
            content += JSON.stringify(resJSON[i]);
        }
        
        ReactDOM.render(
            React.createElement('div', null, content),
            document.getElementById('content')
        );
    });
}

getData();