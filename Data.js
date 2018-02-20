class Data {
    constructor(el) {
        this.el = el;
        this.el.addEventListener('dataRequest', (e) => {
            this.receive(e.detail);
        });

        this.el.addEventListener('sortRequest', (e) => {
            this.sort(e.detail);
        });
    }

    receive(usersAmount) {
        const amount = usersAmount > 1 ? usersAmount : 1;
        const url = `https://randomuser.me/api/?nat=US&results=${amount}`;
        let data = [];

        fetch(url)
            .then(res => res.json())
            .then(data => data.results)
            .then(results => {
                data = results.map((user, index) => {
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
            })
            .then(() => {
                const dataReceivedEvent = new CustomEvent('dataReceived', {
                    detail: {data}
                });
                this.el.dispatchEvent(dataReceivedEvent);
            });
    }

    sort(obj) {
        const sortedArray = obj.sortableArray.sort((a, b) => {
            let aValue = a[obj.sortBy];
            let bValue = b[obj.sortBy];

            if (obj.sortBy === 'phone') {
                aValue = helpers.getNumberFromString(aValue);
                bValue = helpers.getNumberFromString(bValue);
            }

            if (aValue < bValue) {
                return obj.direction ? -1 : 1;
            }

            if (aValue > bValue) {
                return obj.direction ? 1 : -1;
            }

            return 0;
        });

        const arraySortedEvent = new CustomEvent('arraySorted', {
            detail: {sortedArray}
        });
        this.el.dispatchEvent(arraySortedEvent);
    }
}