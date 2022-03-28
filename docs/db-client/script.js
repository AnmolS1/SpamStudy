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
            const element = resJSON[i];
            items.push ( React.createElement('h1', { key: element._id }, element._id) );
            items.push ( React.createElement('div', null, element.gmail_filtered) );
            items.push ( React.createElement('div', null, element.user_filtered) );
        }

        ReactDOM.render(
            React.createElement('div', null, items),
            document.getElementById('content')
        );

    });
}

getData();