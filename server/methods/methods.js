var getObject = (function() {

    function last(array) {
        var arrayLenght = array.length - 1,
            arrayLast = array[arrayLenght];
        return arrayLast;
    }

    function secondLast(array) {
        var arrayLenght = array.length - 2,
            arrayLast = array[arrayLenght];
        return arrayLast;
    }

    return {
        last: last,
        secondLast: secondLast
    };
})();

module.exports = getObject;
