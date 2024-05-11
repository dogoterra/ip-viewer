const domainFormat = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
const fetchURLs = ['https://v4.doip.me/', 'https://doip.me/'];

const inputIP = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

const showError = () => {
    headerDisplay("❌ Invalid IP or Domain ❌");
    searchButton.disabled = false;
}

const getCurrentIP = async () => {
    const responses = await Promise.all(fetchURLs.map(url => fetch(url)));
    const data = await Promise.all(responses.map(res => res.text()));
    if (data[0] === data[1]) requestAPI(data[0], true);
    else requestAPI(data[0] + '&d=' + data[1], true);
}

const validateIP = () => {
    headerDisplay("⌛ Loading... ⌛");
    searchButton.disabled = true;
    if (ipaddr.isValid(inputIP.value)) requestAPI(inputIP.value);
    else if (inputIP.value.match(domainFormat)) domainToIP(inputIP.value);
    else (urlToDomain(inputIP.value));
}

const domainToIP = async (value) => {
    const response = await fetch('https://cloudflare-dns.com/dns-query?name=' + value, {
        muteHttpExceptions: true,
        headers: { accept: "application/dns-json" }
    });
    const data = await response.json();
    const validAnswer = data.Answer && data.Answer.some(answer => answer.type === 1);
    if (validAnswer) {
        const validData = data.Answer.find(answer => answer.type === 1);
        requestAPI(validData.data);
    } else showError();
}

const urlToDomain = (value) => {
    const hostname = getHostname(value);
    if (hostname !== null && hostname.match(domainFormat)) {
        inputIP.value = hostname;
        domainToIP(hostname);
    } else showError();
}

const requestAPI = async (value, current) => {
    const response = await fetch('https://api.doip.me/?f=' + value);
    const data = await response.json();
    if (data.status === 0) {
        headerDisplay(current ? "🔥 Your connection 🔥" : "💛 Result 💛");
        resultValues((data.dual === null ? "IP" : "IPv4"), data.ip);
        if (data.dual !== null) resultValues("IPv6", data.dual);
        if (data.rdns !== null) resultValues("rDNS", data.rdns);
        resultValues("Location", data.location);
        resultValues("ISP", data.telecom);
        searchButton.disabled = false;
    } else showError();
}

searchButton.addEventListener('click', validateIP);
inputIP.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchButton.click(); });
addEventListener('DOMContentLoaded', getCurrentIP);
