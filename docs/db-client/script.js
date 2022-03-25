$(document).ready(function() {
    $.getJSON('data.json', function(data) {
        $.each(data, function (obj) {
            var div = document.createElement('div');
            div.textContent = JSON.stringify(data[obj]);
            document.body.appendChild(div);
        });
    });
});