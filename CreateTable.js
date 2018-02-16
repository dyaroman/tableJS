class CreateTable {
    constructor(rowsAmount) {
        this.users = [];
        this.destroyTable();
        this.receiveData(rowsAmount);
    }

    receiveData(usersAmount) {
        let amount = usersAmount ? usersAmount : 1;
        const url = `https://randomuser.me/api/?nat=US&results=${amount}`;

        fetch(url)
            .then(res => res.json())
            .then(data => data.results)
            .then(results => {
                this.users = results.map(user => {
                    return {
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
        let table = document.createElement('table');
        let tableHead = '';
        let tableRow = '';

        for (let key in this.users[0]) {
            let type = 'string';

            if (key === 'phone' || key === 'postcode') {
                type = 'number';
            }

            tableHead += `<th data-sort-by=${type}>${this.capitalizeKey(key)}</th>`;
        }

        table.innerHTML = `<thead><tr>${tableHead}</tr></thead>`;


        this.users.forEach((user) => {
            let userCells = '';

            for (let prop in user) {
                userCells += `<td>${this.capitalizeKey(user[prop])}</td>`;
            }

            tableRow += `<tr>${userCells}</tr>`;
        });

        table.innerHTML += `<tbody>${tableRow}</tbody>`;

        document.body.appendChild(table);

        const tableEvent = new CustomEvent('tableCreated');
        window.dispatchEvent(tableEvent);
    }

    capitalizeKey(str) {
        if (typeof str !== 'string' || RegExp('@').test(str)) return str;

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

const createTestTable = new CreateTable(100);

console.log(`new CreateTable(number)`);