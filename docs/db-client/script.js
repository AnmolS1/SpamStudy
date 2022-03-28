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
            const key = element._id;
            const emails = element.spam;

            items.push (React.createElement(
                'h1', { key: key + 'a' },
                element._id
            ));
            items.push (React.createElement(
                'div', { key: key + 'b' },
                'gmail-filtered: ' + element.gmail_filtered
            ));
            items.push (React.createElement(
                'div', { key: key + 'c' },
                'user-filtered: ' + element.user_filtered
            ));
            
            for (var j = 0; j < emails.length; j++) {
                items.push (React.createElement(
                    'div', { key: key + (j + 1) },
                    'from: ' + emails[j].from
                ));
            }
        }


        ReactDOM.render(
            React.createElement('div', null, items),
            document.getElementById('content')
        );

    });
}

getData();