require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');

Các dòng này sử dụng các middleware tích hợp trong Express để xử lý dữ liệu yêu cầu dưới dạng JSON hoặc URL encoded và xử lý vấn đề CORS bằng cách cho phép tất cả các domain truy cập API.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// api routes
app.use('/doctor', require('./controller/doctor.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));