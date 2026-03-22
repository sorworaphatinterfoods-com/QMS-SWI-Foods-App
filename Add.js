// QC Criteria
const qcCriteria = {
    "TEMP_01 - RM Core Temperature": { type: "number", min: 0, max: 5 },
    "MAC_03 - Mixing Time": { type: "number", min: 5, max: 15 },
    "CHEM_01 - Raw Meat pH": { type: "number", min: 5.8, max: 6.2 },
    "PHY_06 - Foreign Matter": { type: "text", allowed: ["ไม่มีสิ่งแปลกปลอม", "Pass"] }
};

function checkQC(parameter, value) {
    const criteria = qcCriteria[parameter];
    if (!criteria) return true;
    if (criteria.type === "number") {
        const num = parseFloat(value);
        return !isNaN(num) && num >= criteria.min && num <= criteria.max;
    }
    if (criteria.type === "text") {
        return criteria.allowed.includes(value);
    }
    return true;
}

function loadRecords() {
    const records = JSON.parse(localStorage.getItem('auditRecords')) || [];
    const tbody = document.getElementById('recordTableBody');
    tbody.innerHTML = '';

    const filterProcess = document.getElementById('filterProcess').value;
    const filterStatus = document.getElementById('filterStatus').value;

    let filtered = records.filter(r => {
        const isPass = checkQC(r.parameter, r.result);
        const status = isPass ? "Pass" : "Fail";
        return (!filterProcess || r.process === filterProcess) &&
               (!filterStatus || status === filterStatus);
    });

    if (!filtered.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">ไม่มีข้อมูล</td></tr>';
        return;
    }

    filtered.forEach(r => {
        const isPass = checkQC(r.parameter, r.result);
        const row = `<tr class="${isPass ? '' : 'table-danger'}">
            <td>${r.time}</td>
            <td>${r.process}</td>
            <td>${r.parameter}</td>
            <td><strong>${r.result}</strong> ${isPass ? '✅' : '❌'}</td>
            <td>${r.auditor}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}
