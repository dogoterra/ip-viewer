const headerDisplay = (value) => {
    const header = document.getElementById("resultHeader");
    const list = document.getElementById("resultList");
    header.textContent = value;
    while (list.firstChild) { list.removeChild(list.firstChild); }
}

const resultValues = (header, result) => {
    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item");

    const divAuto = document.createElement("div");
    divAuto.classList.add("me-auto");

    const divBold = document.createElement("div");
    divBold.classList.add("fw-bold");
    divBold.textContent = header;

    const spanElement = document.createElement("span");
    spanElement.textContent = result;

    divAuto.appendChild(divBold);
    divAuto.appendChild(spanElement);
    listItem.appendChild(divAuto);

    document.getElementById("resultList").appendChild(listItem);
}

const getHostname = (value) => {
    try { return (new URL(value.replace(/[%\s]/g, ''))).hostname; }
    catch { return null; }
}