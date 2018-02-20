class Table {
    constructor(rowsAmount) {
        if (typeof rowsAmount !== 'number') {
            throw new Error('type of argument must be a number');
        }
        this.el = document.createElement('table');
        this.data = new Data(this.el);

        const dataRequestEvent = new CustomEvent('dataRequest', {
            detail: rowsAmount
        });
        this.el.dispatchEvent(dataRequestEvent);

        this.el.addEventListener('dataReceived', (e) => {
            this.users = e.detail.data;
            this.create();
        });

        this.el.addEventListener('arraySorted', (e) => {
            this.update(this.el, e.detail.sortedArray);
        });

    }

    create() {
        this.el.innerHTML += this.assembleHead(this.users);
        this.el.innerHTML += this.assembleBody(this.users);

        document.body.appendChild(this.el);

        this.clickHandler();
    }

    update(tableEl, newData) {
        const newTbody = document.createElement('tbody');

        tableEl.querySelector('tbody').remove();

        newTbody.innerHTML += this.assembleBody(newData);

        tableEl.appendChild(newTbody);
    }

    assembleHead(usersArray) {
        let tableHead = '';

        for (let key in usersArray[0]) {
            if (usersArray[0].hasOwnProperty(key)) {
                tableHead += `<th>${helpers.capitalizeStr(key)}</th>`;
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

            const sortBy = e.target.innerText.toLowerCase();

            const sortRequestEvent = new CustomEvent('sortRequest', {
                detail: {
                    sortableArray: this.users,
                    sortBy,
                    direction
                }
            });
            this.el.dispatchEvent(sortRequestEvent);
        });
    }

    destroy() {
        const table = document.querySelector('table');
        if (table) {
            table.remove();
            console.log('table deleted');
        }
    }
}

const table = new Table(10);
const table2 = new Table(10);