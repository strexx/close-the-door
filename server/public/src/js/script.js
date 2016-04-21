d3.json("/api/data", function(error, data) {
    var time = [];
    var doorStatus = ['Doorstatus'];

    data.forEach(function(element, index) {
        time.push(element.time);
        doorStatus.push(element.doorStatus);
    });

    var chart = c3.generate({
        data: {
            columns: [
                doorStatus
            ]
        },
        axis: {

            x: {
                type: 'category',
                categories: time
            }

        }
    });
});
