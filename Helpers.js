class Helpers {
    capitalizeStr(str) {
        if (typeof str !== 'string' || RegExp('@').test(str)) {
            return str;
        }

        let strArr = str.split(' ');
        strArr = strArr.map((item) => {
            return item.charAt(0).toUpperCase() + item.slice(1);
        });
        strArr = strArr.join(' ');

        return strArr;
    }

    getNumberFromString(str) {
        return parseInt(str.replace(/[^\/\d]/g, ''));
    }
}

const helpers = new Helpers();