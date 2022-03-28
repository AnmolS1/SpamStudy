const getData = () => {
    fetch('data.json', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(function (response) {
        return response.json();
    }).then(function (resJSON) {

        const items = resJSON.map((element) => <h1>{element}._id</h1>);
        ReactDOM.render( (<div>{items}</div>, document.getElementById('content'));
        /*for (var i = 0; i < resJSON.length; i++) {
            ReactDOM.render(
                React.createElement('h1', null, resJSON[i]._id),
                document.getElementById('content')
            );
        }*/

        /*var content = '';
        for (var i = 0; i < resJSON.length; i++) {
            content += JSON.stringify(resJSON[i]);
        }

        ReactDOM.render(
            React.createElement('div', null, content),
            document.getElementById('content')
        );*/
    });
}

getData();