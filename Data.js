class Data {
    receive(usersAmount) {
        const amount = usersAmount > 1 ? usersAmount : 1;
        const url = `https://randomuser.me/api/?nat=US&results=${amount}`;

        fetch(url)
            .then(res => res.json())
            .then(data => data.results)
            .then(results => {
                table.users = results.map((user, index) => {
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
            .then(() => table.create());
    }

    sort(obj) {
        return obj.sortableArray.sort((a, b) => {
            let aValue = a[obj.index];
            let bValue = b[obj.index];

            if (obj.sortBy === 'number') {
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
    }
}

const tableData = new Data();