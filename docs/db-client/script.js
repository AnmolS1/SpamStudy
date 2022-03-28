const getData = () => {
    fetch('data.json', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(function (response) {
        var content = '';
        var resJ = response.json();
        for (var i = 0; i < resJ.length; i++) {
            content += JSON.stringify(resJ[i]);
        }
        return content;
    }).then(function (content) {
        ReactDOM.render(
            React.createElement('div', null, content),
            document.getElementById('content')
        );
    });
}

getData();