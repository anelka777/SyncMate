const Appointment = require('../models/Appointment');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');


const getAllAppointments = async (req, res) => {
    res.send('get all appointments');
}

const getAppointment = async (req, res) => {
    res.send('get appointment');
}


const createAppointment = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const appointment = await Appointment.create(req.body);
    res.status(StatusCodes.CREATED).json({ appointment });
}

const updateAppointment = async (req, res) => {
    res.send('update appointment');
}


const deleteAppointment = async (req, res) => {
    res.send('delete appointment')
}

module.exports = {
    getAllAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
}