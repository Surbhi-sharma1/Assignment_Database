export function selectValue(list: string[], cell: HTMLTableCellElement) {
    let td = document.createElement("td");
    td.setAttribute('id', 'select');
    let select = document.createElement("select") as HTMLSelectElement;
    select.setAttribute('id', 'dropdown');

    for (const i of list) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;

        if (td.textContent === i) {
            option.selected = true;
        }
        else option.selected = false;
        select.appendChild(option);
    }
    td.append(select);
    cell.replaceWith(td);
}