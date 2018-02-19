class Table {
    constructor(rowsAmount) {
        if (typeof rowsAmount !== 'number') {
            throw new Error('type of argument must be a number');
        }
        this.isAlive = false;
        this.el = null;
        this.users = [];
        tableData.receive(rowsAmount);
    }

    create() {
        if (this.isAlive) {
            this.destroy();
        }
        const table = document.createElement('table');

        table.innerHTML += this.assembleHead(this.users);
        table.innerHTML += this.assembleBody(this.users);

        document.body.appendChild(table);

        console.log('table created');

        this.isAlive = true;
        this.el = table;
        this.clickHandler();
    }

    update(tableEl, newData) {
        if (!this.isAlive) {
            throw new Error(`can not update table, table alive status = ${this.isAlive}`);
        }

        const newTbody = document.createElement('tbody');

        // remove table body
        tableEl.querySelector('tbody').remove();

        // fill table body with sorted rows
        newTbody.innerHTML += this.assembleBody(newData);

        // append new table body to the table
        tableEl.appendChild(newTbody);
    }

    assembleHead(usersArray) {
        let tableHead = '';

        for (let key in usersArray[0]) {
            let type = 'string';

            if (key === 'phone') {
                type = 'number';
            }
            if (usersArray[0].hasOwnProperty(key)) {
                tableHead += `<th data-sort-by=${type}>${helpers.capitalizeStr(key)}</th>`;
            }
        }

        return `<thead><tr>${tableHead}</tr></thead>`;
    }

    assembleBody(usersArray) {
        let tableRows = '';

        usersArray.forEach((user) => {
            let userCells = '';

            for (let prop in user) {
                if (user.hasOwnProperty(prop)) {
                    userCells += `<td>${helpers.capitalizeStr(user[prop])}</td>`;
                }
            }

            tableRows += `<tr>${userCells}</tr>`;
        });

        return `<tbody>${tableRows}</tbody>`;
    }

    clickHandler() {
        this.el.addEventListener('click', (e) => {
            if (e.target.nodeName !== 'TH') {
                return;
            }

            let direction = true;
            const th = this.el.querySelectorAll('th');
            for (let i = 0; i < th.length; i++) {
                th[i].classList.remove('active');
            }
            e.target.classList.add('active');

            if (e.target.classList.contains('active--revert')) {
                e.target.classList.remove('active--revert');
                direction = false;
            } else {
                e.target.classList.add('active--revert');
            }

            const sortBy = e.target.getAttribute('data-sort-by').toLowerCase();
            const index = e.target.innerText.toLowerCase();

            this.update(this.el, tableData.sort({
                table: this.el,
                sortableArray: this.users,
                sortBy,
                index,
                direction
            }));
        });
    }

    destroy() {
        const table = document.querySelector('table');
        if (table) {
            table.remove();
            console.log('table deleted');
            this.isAlive = false;
        }
    }
}

const table = new Table(10);

console.log(`new Table(number)`);