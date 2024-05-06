const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config.json')
const db = require('_helpers/db');
const axios = require('axios');
const Account = require('model/./account.model.js');

module.exports = {
    authenticate,
    getAll,
    getById,
    search,
    sendOtp,
    genOtp
};

function genOtp(length) {
    var text = "";
    var possible = "123456789";
    for (var i = 0; i < length; i++) {
        var sup = Math.floor(Math.random() * possible.length);
        text += i > 0 && sup == i ? "0" : possible.charAt(sup);
    }
    return Number(text);
}

function sendOtp() {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "App 8dc4b474a1a129cb00c24b6329f574bd-e7c4a9b8-e8e7-49df-9dc7-5014f884f443");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    const raw = JSON.stringify({
        "messages": [
            {
                "destinations": [{ "to": "84899990414" }],
                "from": "ServiceSMS",
                "text": "Congratulations on sending your first message.\nGo ahead and check the delivery report in the next step."
            }
        ]
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://5yk1gj.api.infobip.com/sms/2/text/advanced", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));

    const otp = genOtp(6);
    // Lưu OTP vào bảng accounts
    Account.create({ otp_code: otp });
};

function confirmOtp() {
    // Select otp from account where email = req.body.email

    // ko co ban ghi => email ko ton tai

    // co ban ghi
    // b1: check trung => ko trung la req.body.otp sai
    // b2: neu dung => phia fe se chuyen sang man hinh doi mat khau
}

function changePassword() {
    // update account set password = req.body.pass(chu y phai encode)
    // tra thong bao de fe chuyen sang man hinh login
}

async function getAllAccount() {
    const query = `
    SELECT role,
    user_name,
    password
    FROM accounts
    `
    const results = await db.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
    });

    return _.isEmpty(results) ? [] : results;
};

async function authenticate({ username, password }) {
    const xxx = await getAllAccount();
    console.log(xxx + "eqwejqwejqwe")
    const user = xxx.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token
        };
    }
};

async function getAll() {
    const query = `
    SELECT 
    d.id,
    d.fullname,
    d.workplace,
    d.birth_year,
    d.introduce,
    d.training_process,
    d.gender,
    d.email,
    d.phone_number,
    GROUP_CONCAT(DISTINCT s.code) AS specialization_code,
    GROUP_CONCAT(DISTINCT s.description) AS specialization_description,
    GROUP_CONCAT(DISTINCT p.code) AS position_code,
    GROUP_CONCAT(DISTINCT p.value) AS position_value,
    GROUP_CONCAT(DISTINCT e.code) AS experience_code,
    GROUP_CONCAT(DISTINCT e.value) AS experience_value,
    GROUP_CONCAT(DISTINCT se.code) AS service_code,
    GROUP_CONCAT(DISTINCT se.description) AS service_description,
    GROUP_CONCAT(DISTINCT s.description) AS specialization_description
FROM
    doctors d
        LEFT JOIN
    doctor_specializations ds ON d.id = ds.doctor_id
        LEFT JOIN
    specializations s ON ds.specialization_id = s.id
        LEFT JOIN
    positions p ON d.id = p.doctor_id
        LEFT JOIN
    experiences e ON d.id = e.doctor_id
        LEFT JOIN
    detail_services ds2 ON d.id = ds2.doctor_id
        LEFT JOIN
    services se ON ds2.service_id = se.id
GROUP BY d.id
    ;
        `;
    const results = await db.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
    });

    return _.isEmpty(results) ? [] : results;
}


async function getById(id) {
    return await getDoctor(id);
}

// helper functions
async function getDoctor(id) {
    const query = `
    SELECT
    d.id AS doctor_id,
    d.fullname, 
    d.workplace, 
    d.birth_year,
    d.introduce,
    d.training_process,
    d.gender,
    d.email,
    d.phone_number,
    GROUP_CONCAT(DISTINCT s.description) AS specialization_description
    FROM doctors d
    LEFT JOIN doctor_specializations ds ON d.id = ds.doctor_id
    LEFT JOIN specializations s ON ds.specialization_id = s.id
    WHERE d.id = ${id}
    GROUP BY d.id
    `;

    const [doctor] = await db.query(query, {
        type: db.sequelize.QueryTypes.SELECT,
    });
    if (!doctor) {
        return "Doctor not found";
    }
    return doctor;
}

async function search(fullName, sortBy, sortOrder, pageIndex, pageSize) {
    // Xây dựng câu truy vấn cơ sở dữ liệu dựa trên các tham số tìm kiếm và phân trang
    let query = `
    SELECT d.id AS doctor_id, d.fullname, d.workplace, d.birth_year, d.introduce, d.training_process,
    GROUP_CONCAT(DISTINCT s.description) AS specialization_description
    FROM doctors d
    LEFT JOIN doctor_specializations ds ON d.id = ds.doctor_id
    LEFT JOIN specializations s ON ds.specialization_id = s.id
    `;

    const whereClause = [];
    const queryParams = {};

    // Xây dựng điều kiện tìm kiếm nếu có

    if (fullName) {
        whereClause.push(`d.fullname LIKE :fullName`);
        queryParams.fullName = `%${fullName}%`;
    }
    // Thêm các điều kiện tìm kiếm khác nếu cần

    // Nếu có điều kiện tìm kiếm, thêm vào truy vấn
    if (whereClause.length > 0) {
        query += ` WHERE ${whereClause.join(" AND ")}`;
    }
    // Thêm phần group by và sắp xếp kết quả
    query += ` GROUP BY d.id`;

    // Nếu có điều kiện tìm kiếm, thêm vào truy vấn
    if (whereClause.length > 0 && sortBy && sortOrder) {
        query += ` ORDER BY ${sortBy} ${sortOrder} `;
    }

    // Thực hiện phân trang
    if (pageIndex && pageSize) {
        const offset = (page - 1) * pageSize;
        query += ` LIMIT :pageSize OFFSET :offset`;
        queryParams.pageSize = parseInt(pageSize);
        queryParams.offset = parseInt(offset);
    }

    // Thực thi truy vấn
    const [results] = await db.query(query, {
        replacements: queryParams,
        type: db.sequelize.QueryTypes.SELECT,
    });
    const content = [results];
    const totalElements = content.length;
    const totalPages = totalElements > 0 ? 1 : 0;
    const last = totalPages === 0 || page >= totalPages;

    return {
        data: {
            content,
            pageIndex: page,
            pageSize: pageSize,
            totalElements,
            totalPages,
            last,
        },
    };
    // return _.isEmpty(results) ? [] : [results];
}