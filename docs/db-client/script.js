const getData = () => {
    fetch('data.json', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(function (response) {
        return response.json();
    }).then(function (resJSON) {

        const items = resJSON.map((element) => 
            React.createElement( 'h1', { key: element._id }, element._id )
        );

        ReactDOM.render(
            React.createElement('div', null, items),
            document.getElementById('content')
        );

    });
}

getData();