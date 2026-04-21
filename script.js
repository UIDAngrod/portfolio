// ===== NAV-BAR =====

function toggleMenu() {
    const dropdown = document.querySelector(".dropdown");
    const menuToggle = document.querySelector(".menu-toggle");

    if (dropdown && menuToggle) {
        dropdown.classList.toggle("active");
        menuToggle.classList.toggle("active");
    }
}

// ===== TYPEWRITER (Home) =====

const texts = [
    "angehender ICT-Fachmann",
    "ein IT Fan",
    "ein lernfreudiger Mensch"
];

let speed = 100;
const textElement = document.querySelector(".home-typewriter-text");

let textIndex = 0;
let characterIndex = 0;

function typeWriter() {
    if (!textElement) return;

    if (characterIndex < texts[textIndex].length) {
        textElement.innerHTML += texts[textIndex].charAt(characterIndex);
        characterIndex++;
        setTimeout(typeWriter, speed);
    } else {
        setTimeout(eraseText, 1000);
    }
}

function eraseText() {
    if (!textElement) return;

    if (textElement.innerHTML.length > 0) {
        textElement.innerHTML = textElement.innerHTML.slice(0, -1);
        setTimeout(eraseText, 50);
    } else {
        textIndex = (textIndex + 1) % texts.length;
        characterIndex = 0;
        setTimeout(typeWriter, 500);
    }
}

window.onload = function () {
    typeWriter();
};

let currentTab = 0;

function switchTab(btn, index) {
    const tabs = document.querySelectorAll('.lernen-tab');
    const track = document.getElementById('tabTrack');

    tabs.forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    track.style.transform = `translateX(-${index * 100}%)`;
}

function scrollTabs(dir) {
    const scroll = document.getElementById('lernenTabs');
    scroll.scrollBy({ left: dir * 160, behavior: 'smooth' });
}


// ===== SUBNET CALCULATOR =====
 
function subnetSyncSlider(val) {
    document.getElementById('subnetCidrText').value = val;
    document.getElementById('subnetCidrDisplay').textContent = '/' + val;
}
 
document.addEventListener('DOMContentLoaded', function () {
    const cidrText = document.getElementById('subnetCidrText');
    const ipInput  = document.getElementById('subnetIp');
 
    if (cidrText) {
        cidrText.addEventListener('input', function () {
            const v = parseInt(this.value);
            if (!isNaN(v) && v >= 1 && v <= 32) {
                document.getElementById('subnetSlider').value = v;
                document.getElementById('subnetCidrDisplay').textContent = '/' + v;
            }
        });
        cidrText.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') subnetCalc();
        });
    }
 
    if (ipInput) {
        ipInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') subnetCalc();
        });
    }
});
 
function subnetIpToNum(ip) {
    const parts = ip.split('.').map(Number);
    if (
        parts.length !== 4 ||
        parts.some(p => isNaN(p) || p < 0 || p > 255)
    ) return null;
    return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}
 
function subnetNumToIp(n) {
    return [24, 16, 8, 0].map(s => (n >> s) & 255).join('.');
}
 
function subnetGetClass(firstOctet) {
    if (firstOctet < 128)  return 'A';
    if (firstOctet < 192)  return 'B';
    if (firstOctet < 224)  return 'C';
    if (firstOctet < 240)  return 'D (Multicast)';
    return 'E (Reserviert)';
}
 
function subnetCalc() {
    const errEl  = document.getElementById('subnetError');
    const resEl  = document.getElementById('subnetResults');
 
    errEl.style.display = 'none';
    resEl.style.display = 'none';
 
    const ipRaw = document.getElementById('subnetIp').value.trim();
    const cidr  = parseInt(document.getElementById('subnetCidrText').value);
 
    // Validate
    if (!ipRaw) {
        errEl.textContent = 'Bitte eine IP-Adresse eingeben.';
        errEl.style.display = 'block';
        return;
    }
    if (isNaN(cidr) || cidr < 1 || cidr > 32) {
        errEl.textContent = 'CIDR muss zwischen 1 und 32 liegen.';
        errEl.style.display = 'block';
        return;
    }
 
    const ipNum = subnetIpToNum(ipRaw);
    if (ipNum === null) {
        errEl.textContent = 'Ungültige IP-Adresse. Beispiel: 192.168.1.0';
        errEl.style.display = 'block';
        return;
    }
 
    // Calculate
    const maskNum  = cidr === 32
        ? 0xFFFFFFFF
        : (~((1 << (32 - cidr)) - 1)) >>> 0;
 
    const netNum   = (ipNum & maskNum) >>> 0;
    const bcastNum = (netNum | (~maskNum >>> 0)) >>> 0;
    const wildNum  = (~maskNum) >>> 0;
 
    const totalHosts = Math.pow(2, 32 - cidr);
    const usable     = cidr >= 31 ? totalHosts : Math.max(0, totalHosts - 2);
    const firstHost  = cidr >= 31 ? netNum  : netNum  + 1;
    const lastHost   = cidr >= 31 ? bcastNum : bcastNum - 1;
    const firstOctet = (netNum >> 24) & 255;
 
    // Fill results
    document.getElementById('sNet').textContent   = subnetNumToIp(netNum);
    document.getElementById('sBcast').textContent = subnetNumToIp(bcastNum);
    document.getElementById('sMask').textContent  = subnetNumToIp(maskNum);
    document.getElementById('sWild').textContent  = subnetNumToIp(wildNum);
    document.getElementById('sFirst').textContent = subnetNumToIp(firstHost);
    document.getElementById('sLast').textContent  = subnetNumToIp(lastHost);
    document.getElementById('sHosts').textContent = usable.toLocaleString('de-CH');
    document.getElementById('sClass').textContent = subnetGetClass(firstOctet);
 
    // Bar
    const pct = Math.round((cidr / 32) * 100);
    document.getElementById('sBarPct').textContent     = pct + '% Netz-Bits';
    document.getElementById('sBarFill').style.width    = pct + '%';
 
    // Bit visual
    const bitsEl = document.getElementById('sBits');
    bitsEl.innerHTML = '';
    for (let i = 0; i < 32; i++) {
        const div = document.createElement('div');
        div.className = 'subnet-bit ' + (i < cidr ? 'net' : 'host');
        bitsEl.appendChild(div);
    }
    document.getElementById('sNetBits').textContent  = cidr;
    document.getElementById('sHostBits').textContent = 32 - cidr;
 
    resEl.style.display = 'block';
}