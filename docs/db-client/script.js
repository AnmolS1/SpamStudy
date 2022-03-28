const getData = () => {
    fetch('data.json', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(function (response) {
        return response.json();
    }).then(function (resJSON) {
        console.log (resJSON);
        // maybe build up using other mappings to create the final list
        /*const items = resJSON.map((element) => 
            React.createElement('div', { key: element._id },
                React.createElement('h1', null, element._id)
            )
        );*/

        var items = [];

        for (var i = 0; i < resJSON.length; i++) {
            items.append (
                React.createElement('div', null, resJSON[i]._id)
            );
        }

        ReactDOM.render(
            React.createElement('div', null, items),
            document.getElementById('content')
        );

    });
}

getData();