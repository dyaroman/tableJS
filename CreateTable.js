class CreateTable {
    constructor(rowsAmount) {
        if (typeof rowsAmount !== 'number') {
            throw new Error('type of argument must be a number');
        }
        this.users = [];
        this.destroyTable();
        this.receiveData(rowsAmount);
    }

    receiveData(usersAmount) {
        const amount = usersAmount > 1 ? usersAmount : 1;
        const url = `https://randomuser.me/api/?nat=US&results=${amount}`;

        fetch(url)
            .then(res => res.json())
            .then(data => data.results)
            .then(results => {
                this.users = results.map((user, index) => {
                    return {
                        id: index,
                        first: user.name.first,
                        last: user.name.last,
                        gender: user.gender,
                        phone: user.cell,
                        email: user.email,
                        city: user.location.city,
                        state: user.location.state,
                        postcode: user.location.postcode,
                    }
                });
            }).then(() => {
            this.createTable();
        });
    }

    createTable() {
        const table = document.createElement('table');
        let tableHead = '';
        let tableRows = '';

        for (let key in this.users[0]) {
            let type = 'string';

            if (key === 'phone' || key === 'postcode' || key === 'id') {
                type = 'number';
            }

            tableHead += `<th data-sort-by=${type}>${this.capitalizeKey(key)}</th>`;
        }

        table.innerHTML = `<thead><tr>${tableHead}</tr></thead>`;


        this.users.forEach((user) => {
            let userCells = '';

            for (let prop in user) {
                if (user.hasOwnProperty(prop)) {
                    userCells += `<td>${this.capitalizeKey(user[prop])}</td>`;
                }
            }

            tableRows += `<tr>${userCells}</tr>`;
        });

        table.innerHTML += `<tbody>${tableRows}</tbody>`;

        document.body.appendChild(table);

        const tableEvent = new CustomEvent('tableCreated');
        window.dispatchEvent(tableEvent);
    }

    capitalizeKey(str) {
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

    destroyTable() {
        const table = document.querySelector('table');
        if (table) {
            table.remove();
            console.log('table -- deleted');
            return true;
        }
        return false;
    }
}

new CreateTable(50);

console.log(`new CreateTable(number)`);