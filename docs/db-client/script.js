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
                'h2', { key: key + 'b' },
                'gmail-filtered: ' + element.gmail_filtered
            ));
            items.push (React.createElement(
                'h2', { key: key + 'c' },
                'user-filtered: ' + element.user_filtered
            ));
            
            for (var j = 0; j < emails.length; j++) {
                items.push (React.createElement(
                    'div', { key: key + (j + 1) + 'from' },
                    'from: ' + emails[j].from
                ));
                items.push (React.createElement(
                    'div', { key: key + (j + 1) + 'category' },
                    'category: ' + emails[j].category
                ));
                items.push (React.createElement(
                    'div', { key: key + (j + 1) + 'time_stamp' },
                    'time stamp: ' + emails[j].time_stamp
                ));
                
                if (j != emails.length - 1)
                    items.push (React.createElement('br', { key: key + 'br' + (j + 1) }));
            }
        }

        ReactDOM.render(
            React.createElement('div', null, items),
            document.getElementById('content')
        );

    });
}

getData();