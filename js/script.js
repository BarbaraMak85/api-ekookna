const buttonAddUser = document.getElementById('button-add-user');
buttonAddUser.addEventListener('click', addUser);


function getUsersList() {
    fetch('http://test.eko.eu')
        .then(response => response.json())
        .then(response => {
            const usersTable = document.querySelector('#users');
            usersTable.innerHTML = '';
            let id = 1;
            for (let user of response.users) {

                const userHTML = `
                <tr>
                    <td>${user.first_name}</td>
                    <td>${user.last_name}</td>
                    <td>${user.postal_code}</td>
                    <td>${user.street}</td>
                    <td>${user.city}</td>
                    <td>${user.age}</td>
                    <td>
                        <button data-show="${user.id}">Szczegóły</button>
                        <button data-edit="${user.id}">Edytuj</button>
                        <button data-delete="${user.id}">Usuń</button>
                    </td>
                </tr>`;
                usersTable.innerHTML = usersTable.innerHTML + userHTML;
                id++;
            }

            for (let detailsBtn of document.querySelectorAll('[data-show]')) {
                detailsBtn.addEventListener('click', getUserDetails)
            }

            for (let deleteBtn of document.querySelectorAll('[data-delete]')) {
                deleteBtn.addEventListener('click', deleteUser)
            }

            for (let editBtn of document.querySelectorAll('[data-edit]')) {
                editBtn.addEventListener('click', editUser)
            }

        })
}

const cancelEditBtn = document.querySelector('#button-cancel-edit');
cancelEditBtn.addEventListener('click', cancelEdit);

function cancelEdit() {
    document.querySelector('#button-add-user').dataset.id = '';
    document.querySelector('#button-add-user').textContent = 'Dodaj użytkownika';
    document.querySelector('#button-cancel-edit').style.display = 'none';

    const inputs = document.querySelectorAll('input');

    for (let i = 0; i < 6; i++) {
        inputs[i].value = '';
    }
}

function editUser() {
    document.querySelector('#button-add-user').dataset.id = this.dataset.edit;
    document.querySelector('#button-add-user').textContent = 'Zapisz użytkownika';
    document.querySelector('#button-cancel-edit').style.display = 'inline-block';

    const fields = this.parentNode.parentNode.querySelectorAll('td');
    const inputs = document.querySelectorAll('input');

    for (let i = 0; i < 6; i++) {
        inputs[i].value = fields[i].textContent;
    }

}

function getUserDetails() {
    fetch(`http://test.eko.eu/user/${this.dataset.show}`)
        .then(response => response.json())
        .then(response => {
            alert(`Imie: ${response.user.first_name}\nNazwisko: ${response.user.last_name}\nKod pocztowy: ${response.user.postal_code}\nUlica: ${response.user.street}\nMiasto: ${response.user.city}\nWiek: ${response.user.age}`)
        })
}

function deleteUser() {
    if (confirm('Czy na pewno chcesz usunac tego uzytkownika?')) {
        const deleteData = new FormData();
        deleteData.append('_method', 'DELETE');

        fetch(`http://test.eko.eu/user/${this.dataset.delete}`, {
                method: 'POST',
                body: deleteData
            })
            .then(response => response.json())
            .then(response => {
                getUsersList();
            })
    }
}

getUsersList();

function addUser() {
    const userData = new FormData();

    let url = 'http://test.eko.eu/user';

    if (this.dataset.id) {
        url = `http://test.eko.eu/user/${this.dataset.id}`;
        userData.append('_method', 'PUT');
    }

    userData.append('first_name', document.querySelector('[name = "user_name"]').value);
    userData.append('last_name', document.querySelector('[name = "user_lastname"]').value);
    userData.append('postal_code', document.querySelector('[name = "user_postal_code"]').value);
    userData.append('street', document.querySelector('[name = "user_street"]').value);
    userData.append('city', document.querySelector('[name = "user_city"]').value);
    userData.append('age', document.querySelector('[name = "user_age"]').value);

    this.dataset.id = '';
    document.querySelector('#button-add-user').textContent = 'Dodaj uzytkownika';
    document.querySelector('#button-cancel-edit').style.display = 'none';

    fetch(url, {
            method: 'POST',
            body: userData
        })
        .then(response => response.json())
        .then(response => {
            getUsersList();
            const inputs = document.querySelectorAll('input');
            for (let i = 0; i < 6; i++) {
                inputs[i].value = '';
            }
        })
}