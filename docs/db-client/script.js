function smallify (str) {
    return str.substring(0, 10) + '...';
}

const getData = () => {
    fetch('data.json', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(function (response) {
        return response.json();
    }).then(function (resJSON) {
        var all = [];
        for (var i = 0; i < resJSON.length; i++) {
            var items = [];
            const element = resJSON[i];
            const key = element._id;
            const emails = element.spam;

            items.push (React.createElement('div', {
                key: key + '-id_small',
                className: "id-small"
            }, smallify(element._id)));
            items.push (React.createElement('div', {
                key: key + '-id_big',
                className: "id-big hidden"
            }, element._id));
            
            items.push (React.createElement('div', {
                key: key + '-gfilter',
                className: "filter-count"
            }, element.gmail_filtered));
            
            items.push (React.createElement('div', {
                key: key + '-ufilter',
                className: "filter-count"
            }, element.user_filtered));
            
            for (var j = 0; j < emails.length; j++) {
                items.push (React.createElement('div', {
                    key: key + "-email" + (j + 1),
                    className: "email hidden"
                }, [
                    React.createElement('div', {
                        key: key + (j + 1) + '-from',
                        className: "userfrom"
                    }, emails[j].from),
                    React.createElement('div', {
                        key: key + (j + 1) + '-category',
                        className: "category"
                    }, emails[j].category),
                    React.createElement('div', {
                        key: key + (j + 1) + '-time_stamp',
                        className: "timestamp"
                    }, emails[j].time_stamp)
                ]));
            }

            all.push (React.createElement('div', {
                key: key,
                className: 'user',
                id: key,
            }, items));
        }

        ReactDOM.render( all, document.getElementById('content') );
    });
}

getData();