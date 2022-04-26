import { CRUD } from "./crudInterface.js";
import { User } from "./user.js";
import { findIndexByID, getCustomer, getCustomerIdByName, getRoleKey, getRoles } from "./findOperations.js";
import { myURL } from "app.js";
import { selectValue } from "./select.js";
import { cursorTo } from "readline";
import { userController } from "src/controller.js";
import { type } from "os";
export class UserCRUD implements CRUD<User>
{
    users: User[];
    col: string[];
    customerLists: string[];
    roleLists: string[];
    tableContainer: HTMLDivElement;
    tableEle: HTMLTableElement;
    myURL: string;
    AddBtn: HTMLButtonElement;
    addContainer: HTMLDivElement;

    constructor() {
        this.users = [];
        this.col = [];
        this.customerLists = [];
        this.roleLists = []
        this.tableContainer = document.querySelector('.table')! as HTMLDivElement;
        this.myURL = `http://localhost:5000`;
        this.tableEle = document.createElement("table") as HTMLTableElement;
        this.AddBtn = document.createElement("button");
        this.AddBtn.classList.add("create-btn");
        this.AddBtn.addEventListener('click', () => this.addUser());
        this.addContainer = document.querySelector('.AddContainer');
        this.initialize();
    }

    async initialize() {
        const dataR = await getRoles(this.myURL);
        this.roleLists = dataR;
        const dataL = await getCustomer(this.myURL);
        this.customerLists = dataL;
        const response = await fetch(this.myURL + '/users');
        const data = await response.json();
        for (let key in data[0]) {
            if (this.col.indexOf(key) < 0 && (key !== "id")) {
                this.col.push(key);

            }
        }
        data.forEach((ob: any) => {
            this.users.push(new User(ob.id, ob.firstname, ob.middlename, ob.lastname, ob.email, ob.phone, ob.role, ob.address, ob.customer, ob.created_on, ob.modified_on));
        }
        )
    }
    load() {
        this.tableEle = document.createElement("table");
        let tr = this.tableEle.insertRow(-1);

        for (let i = 0; i < this.col.length; i++) {
            let th = tr.insertCell(i);
            th.innerHTML = this.col[i];
        }
        this.AddBtn.innerHTML = "Add User";
        this.addContainer.append(this.AddBtn);
        this.users.forEach((user) => this.loadTableContent(user))
    }
    loadTableContent(user: User) {
        let tr = document.createElement("tr");
        let editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.addEventListener('click', () => this.update(user));
        editBtn.setAttribute('class', 'edit');
        let deleteBtn = document.createElement("button");
        deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "Delete";
        deleteBtn.addEventListener('click', () => this.delete(user));
        deleteBtn.classList.add("dlt");

        tr.innerHTML = `<td id = "fname">${user.firstname}</td>
                        <td id = "middle">${user.middlename}</td>
                        <td id = "last">${user.lastname}</td>
                        <td id = "email">${user.email}</td>
                        <td id = "phone">${user.phone}</td>
                        <td id = "role-cell">${user.role}</td>
                        <td id = "customer">${user.customer}</td>
                        <td id = "address">${user.address}</td>
                        <td id = "created_on">${user.created_on}</td>
                        <td id = "modified_on">${user.modified_on}</td>`;
        tr.append(editBtn);
        tr.append(deleteBtn);
        this.tableEle.append(tr);
        this.tableContainer.innerHTML = "";
        this.tableContainer.append(this.tableEle);

    }

    addUser() {
        let newRow = this.tableEle.insertRow(-1);
        newRow.contentEditable = 'true';
        for (let i = 0; i < this.col.length; i++) {
            let newCell = newRow.insertCell(0);
        }
        let roleCell = newRow.children[5] as HTMLTableCellElement;
        selectValue(this.roleLists, roleCell);
        let customerCell = newRow.children[6] as HTMLTableCellElement;
        selectValue(this.customerLists, customerCell);
        let submit = document.createElement('submit') as HTMLButtonElement;
        submit.innerHTML = 'Submit';
        submit.classList.add('submit')
        newRow.append(submit);
        submit.addEventListener('click', async () => {

            newRow.contentEditable = 'false';
            let roleContent, customerContent;
            let selectedrole, selectedCustomer;

            for (let i = 0; i <= 2; i++) {

                let r = newRow.children[5].children[0].children[i] as HTMLOptionElement;

                if (r.selected) {
                    selectedrole = r.textContent;
                }
            }

            for (let j = 0; j <= 2; j++) {
                let option;
                let s = newRow.children[6].children[0].children[j] as HTMLOptionElement;
                if (option = s) {
                    selectedCustomer = option.textContent;
                }
            }
            const data1 = await getRoleKey(this.myURL, selectedrole);
            const data = await getCustomerIdByName(this.myURL, selectedCustomer);

            const newUser = {
                customerid: data[0].customerid,
                id: this.users.length + 1,
                firstname: newRow.children[0].textContent,
                middlename: newRow.children[1].textContent,
                lastname: newRow.children[2].textContent,
                email: newRow.children[3].textContent,
                phone: newRow.children[4].textContent,
                role: data1[0].key,
                customer: selectedCustomer,
                address: newRow.children[7].textContent,
                created_on: '',
                modified_on: ''
            }
            this.create(newUser);
        })
    }
    async create(user: User) {
        console.log(user);
        const createUrl = this.myURL + '/add';
        const res = await fetch(createUrl, {
            method: 'post',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let getUser = await fetch(this.myURL + '/users');
        let Data = await getUser.json();
        let ob = Data[Data.length - 1];
        const mybody = {
            "id": ob.id,
            "firstname": ob.firstname,
            "middlename": ob.middlename,
            "lastname": ob.lastname,
            "email": ob.email,
            "phone": ob.phone,
            "role": ob.role,
            "customer": ob.customer,
            "address": ob.address,
            "created_on": ob.created_on,
            "modified_on": ob.modified_on

        }

        this.users.push(mybody);
        this.load();
    }
    read(): User[] {
        return this.users;
    }
    async update(user: User) {
        let index = findIndexByID(user.id, this.users);
        let tr = this.tableEle.children[index + 1] as HTMLTableRowElement;
        let editbtn = tr.children[tr.children.length - 2] as HTMLButtonElement;
        let dltbtn = tr.children[tr.children.length - 1] as HTMLButtonElement;
        let cell = tr.cells.namedItem("role-cell") as HTMLTableCellElement;
        let customerCell = tr.cells.namedItem("customer");
        let created_onCell = tr.cells.namedItem('created_on');
        let modified_onCell = tr.cells.namedItem('modified_on');
        created_onCell.contentEditable = "false";
        modified_onCell.contentEditable = "false";
        if (editbtn.innerHTML === "Edit") {
            tr.contentEditable = "true";
            editbtn.innerHTML = "Save";
            dltbtn.innerHTML = "Cancel";
            editbtn.contentEditable = "false";
            dltbtn.contentEditable = "false";

            let select = document.createElement("select") as HTMLSelectElement;
            select.classList.add("select");
            select.setAttribute('id', 'select');
            selectValue(this.customerLists, customerCell);
            selectValue(this.roleLists, cell);
        }
        else {
            this.save(user);
        }
    }
    async save(user: User) {
        let index = findIndexByID(user.id, this.users);
        let tr = this.tableEle.children[index + 1] as HTMLTableRowElement;
        let editbtn = tr.children[tr.children.length - 2] as HTMLButtonElement;
        let dltbtn = tr.children[tr.children.length - 1] as HTMLButtonElement;
        let fnameCell = tr.cells.namedItem("fname");
        let middlenameCell = tr.cells.namedItem("middle");
        let lastnameCell = tr.cells.namedItem("last");
        let emailCell = tr.cells.namedItem("email");
        let phoneCell = tr.cells.namedItem("phone");
        let customer = tr.cells.namedItem("customer");
        let addressCell = tr.cells.namedItem("address");

        let selectCell = tr.cells.namedItem("select");

        tr.contentEditable = "false";
        editbtn.innerHTML = "Edit";
        dltbtn.innerHTML = "Delete";
        const updateURL = this.myURL + '/update/' + `${user.id}`;

        user.firstname = fnameCell.textContent!;
        user.middlename = middlenameCell.textContent!;
        user.lastname = lastnameCell.textContent!;
        user.email = emailCell.textContent!;
        user.phone = phoneCell.textContent!;
        user.address = addressCell.textContent!;
        for (let i = 0; i <= 2; i++) {
            let s = tr.children[5].children[i] as HTMLOptionElement;
            let optionValue;
            if (s.selected) {
                user.role = s.textContent!;
            }
        }
        let td = document.createElement("td");
        td.setAttribute('id', 'role-cell');
        tr.children[5].replaceWith(td);
        let roleCell = tr.cells.namedItem('role-cell');
        roleCell.innerHTML = user.role;

        const customerList = await getCustomer(this.myURL);
        for (let i = 0; i <= customerList.length; i++) {
            let c = tr.children[6].children[i] as HTMLOptionElement
            if (c.selected) {
                user.customer = c.textContent;
            }
            let td1 = document.createElement('td1');
            td1.setAttribute('id', 'customer');
            tr.children[6].append(td1);
            let customerCell = tr.cells.namedItem('customer');
            customerCell.innerHTML = user.role;

        }

        const mybody = {
            // "id": user.id,
            "firstname": user.firstname,
            "middlename": user.middlename,
            "lastname": user.lastname,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "customername": user.customer,
            "address": user.address
        };
        const response = await fetch(updateURL, {
            method: 'PUT',
            body: JSON.stringify(mybody), // string or object
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async delete(user: User) {

        const index = findIndexByID(user.id, this.users);
        let tr = this.tableEle.children[index + 1] as HTMLTableRowElement;
        let dltbtn = tr.children[tr.children.length - 1] as HTMLButtonElement;
        if (dltbtn.innerHTML === "Delete") {
            const deleteURL = this.myURL + '/delete/' + `${user.id}`;
            const response = await fetch(deleteURL,
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });

            tr.remove();
            this.users.splice(index, 1);
            this.load();
        }
        else {
            this.cancel(user);
        }

    }

    cancel(user: User) {
        let index = findIndexByID(user.id, this.users);
        let tr = this.tableEle.children[index + 1] as HTMLTableRowElement;
        let editbtn = tr.children[tr.children.length - 2] as HTMLButtonElement;
        let dltbtn = tr.children[tr.children.length - 1] as HTMLButtonElement;

        tr.contentEditable = "false";
        dltbtn.innerHTML = "Delete";
        editbtn.innerHTML = "Edit";
        this.load();
    }

    refresh() {
        this.users = [];
        this.initialize();
        this.load();
    }
}