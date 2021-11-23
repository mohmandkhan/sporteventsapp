const express = require('express');
const multer = require('multer');

const UserController = require('./controllers/UserController');
const EventController = require('./controllers/EventController');
const DashboardController = require('./controllers/DashboardController');
const LoginController = require('./controllers/LoginController');
const RegistrationController = require('./controllers/RegistrationController');
const ApprovalController = require('./controllers/ApprovalController');
const RejectionController = require('./controllers/RejectionController');
const routes = express.Router();

const uploadConfig = require('../config/upload.js');
const upload = multer(uploadConfig);

//Default Route
routes.get('/status', (req, res) => {
    res.send({status: 200});
})

//TODO
// Login Controller
routes.post('/login', LoginController.store);

// Subscribe Controller


//Registration
routes.post('/registration/:eventId', RegistrationController.create);
routes.get('/registration/:registration_id', RegistrationController.getRegistration);
routes.post('/registration/:registration_id/approvals', ApprovalController.approval);
routes.post('/registration/:registration_id/rejections', RejectionController.rejection);

//Dashboard Routes
routes.get('/dashboard/:sport', DashboardController.getAllEvents)
routes.get('/dashboard', DashboardController.getAllEvents)
routes.get('/event/:eventId', DashboardController.getEventById);
routes.get('/user/events/', DashboardController.getAllEventsByUserId);

//Event Routes
routes.post('/event', upload.single('thumbnail'), EventController.createEvent);
routes.delete('/event/:eventId', EventController.delete);

//User Routes
routes.post('/user/register', UserController.createUser);
routes.get('/user/:userId', UserController.getUserById);


module.exports = routes;