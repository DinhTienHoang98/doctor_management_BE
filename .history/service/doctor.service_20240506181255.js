const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config.json')
const db = require('_helpers/db');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const Account = require('model/account.model.js');
const { where } = require('sequelize');

module.exports = {
    authenticate,
    getAll,
    getById,
    search,
    sendOtp,
    genOtp,
    confirmOtp,
    changePassword
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

const otp = genOtp(6);

async function sendOtp(req) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "App 8dc4b474a1a129cb00c24b6329f574bd-e7c4a9b8-e8e7-49df-9dc7-5014f884f443");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    const raw = JSON.stringify({
        "messages": [
            {
                "destinations": [{ "to": "84333377156" }],
                "from": "ServiceSMS",
                "text": "Your OTP is: " + otp
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
        .then((result) => {
            console.log(result); // Log phản hồi từ dịch vụ SMS
        })

    // Kiểm tra xem có tài khoản nào đã tồn tại có cùng email hay không
    const doctor = await db.Account.findOne({ where: { email: req.body.email } });
    console.log("1. ", doctor?.dataValues)
    db.Account.update({ otp_code: otp }, { where: { id: doctor?.dataValues?.id } })
    console.log("2. ", doctor?.dataValues)

};

async function confirmOtp(email, otp, res) {
    try {
        // Lấy OTP từ bảng accounts dựa trên email
        const account = await db.Account.findOne({ where: { email: email, otp_code: otp } });

        // Kiểm tra xem có tìm thấy tài khoản dựa trên email hay không
        if (!account) {
            return res.status(400).json({ message: "Email không tồn tại" });
        }

        // So sánh OTP
        if (account.otp_code !== otp) {
            return res.status(400).json({ message: "Mã OTP không đúng" });
        }

        // Nếu OTP đúng, chuyển hướng sang màn hình đổi mật khẩu (hoặc thực hiện các hành động khác)
        // Ví dụ:
        // res.redirect("/change-password");
        return res.s

    } catch (error) {
        console.error("Xác nhận OTP thất bại:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi xác nhận OTP" });
    }
}

async function changePassword(req, res) {
    try {
        // Kiểm tra xem có đủ thông tin cần thiết để thay đổi mật khẩu không
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
        }

        // Encode mật khẩu mới
        const newPassword = await bcrypt.hash(req.body.password, 5);

        // Thực hiện cập nhật mật khẩu trong cơ sở dữ liệu
        const result = await db.Account.update(
            { password: newPassword },
            { where: { email: req.body.email } }
        );

        // Kiểm tra xem có bản ghi nào được cập nhật không
        if (result[0] === 0) {
            return res.status(404).json({ message: "Không tìm thấy tài khoản" });
        }

        // Trả về thông báo thành công
        return res.status(200).json({ message: "Mật khẩu đã được thay đổi thành công" });

    } catch (error) {
        console.error("Lỗi khi thay đổi mật khẩu:", error);
        res.status(500).json({ message: "Đã xảy ra lỗi khi thay đổi mật khẩu" });
    }
}

// function confirmOtp() {
//     // Select otp from account where email = req.body.email

//     // ko co ban ghi => email ko ton tai

//     // co ban ghi
//     // b1: check trung => ko trung la req.body.otp sai
//     // b2: neu dung => phia fe se chuyen sang man hinh doi mat khau
// }

// function changePassword() {
//     // update account set password = req.body.pass(chu y phai encode)
//     // tra thong bao de fe chuyen sang man hinh login
// }

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