class SortTable {
    constructor(el) {
        this.el = el;
        this.checkClick();
    }

    checkClick() {
        this.el.addEventListener('click', (e) => {
            if (e.target.nodeName !== 'TH') return;

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
            const index = e.target.cellIndex;

            this.sortTable(sortBy, index, direction);
        });
    }

    sortTable(sortBy, index, direction) {
        const tableRows = this.el.querySelectorAll('tbody tr');
        const newTbody = document.createElement('tbody');
        const rowsArr = [];

        // fill array with rows of table
        for (let i = 0; i < tableRows.length; i++) {
            rowsArr.push(tableRows[i]);
        }

        // sort array
        rowsArr.sort((a, b) => {
            let aValue = a.children[index].innerText;
            let bValue = b.children[index].innerText;

            if (sortBy === 'number') {
                aValue = this.getNumberFromString(aValue);
                bValue = this.getNumberFromString(bValue);
            }

            if (aValue < bValue) {
                return direction ? -1 : 1;
            }

            if (aValue > bValue) {
                return direction ? 1 : -1;
            }

            return 0;
        });

        // remove table body
        this.el.querySelector('tbody').remove();

        // fill table body with sorted rows
        for (let i = 0; i < rowsArr.length; i++) {
            newTbody.append(rowsArr[i]);
        }

        // append new table body to the table
        this.el.appendChild(newTbody);
    }

    getNumberFromString(str) {
        return parseInt(str.replace(/[^\/\d]/g, ''));
    }
}

window.addEventListener('tableCreated', () => {
    new SortTable(document.querySelector('table'));
});
