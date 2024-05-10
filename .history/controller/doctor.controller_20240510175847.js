const express = require('express');
const router = express.Router();
const service = require('../service/doctor.service');

// routes
router.post('/authenticate', authenticate);     // public route
router.get('/', getAll); // admin only
router.get('/:id', getById);       // all authenticated users
router.post('/search', searchDoctors);
router.post('/send-otp', sendOtp);
router.post('/confirm-otp', confirmOtp);
router.post('/change-password', changePassword);


module.exports = router;

function sendOtp(req, res, next) {
    service.sendOtp(req);
    return ("Send OTP success")
}

function confirmOtp(req, res, next) {
    service.confirmOtp(req.body?.email, req.body?.otp, res)
        .then(account => account ? res.json(account) : console.log(account))
        .catch(err => next(err));

}

function changePassword(req, res, next) {
    service.changePassword(req.body?.email, req.body?.password, res)
        .then(account => account ? res.json(account) : console.log(account))
        .catch(err => next(err));
}

function authenticate(req, res, next) {
    console.log(req.body + "ssss")
    service.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

// route functions

function getAll(req, res, next) {
    service.getAll()
        .then(doctors => res.json(doctors))
        .catch(next);
}

function getById(req, res, next) {
    service.getById(req.params.id)
        .then(doctor => res.json(doctor))
        .catch(next);
}

function searchDoctors(req, res, next) {
    console.log(req);
    // Lấy các tham số tìm kiếm, phân trang và sắp xếp từ query string
    const fullName = req.body.fullName;
    const pageIndex = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;
    const sortBy = req.body.sortBy || 'fullname'; // Mặc định sắp xếp theo tên đầy đủ
    const sortOrder = req.body.sortOrder != null ? req.body.sortOrder : 'ASC'; // Mặc định sắp xếp tăng dần

    service.search(fullName, sortBy, sortOrder, pageIndex, pageSize)
        .then(doctors => res.json(doctors))
        .catch(next);
}