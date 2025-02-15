const Appointment = require('../models/Appointment');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

/*
const getAllAppointments = async (req, res) => {
    res.send('get all appointments');
}
*/
//====================================================================
const getAllAppointments = async (req, res) => {
    const appointments = await Appointment.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({ appointments, count:appointments.length })
}

//========================================================================

const getAppointment = async (req, res) => {
    const { user: { userId }, 
            params: { id: appointmentId } 
    } = req;

    console.log('appointmentId:', appointmentId);
    console.log('userId:', userId);

    const appointment = await Appointment.findOne({
        _id: appointmentId,
        createdBy: userId
    });

    if (!appointment) {
        console.log('Appointment not found!');
        throw new NotFoundError(`No appointment with id ${appointmentId}`);
    }

    res.status(StatusCodes.OK).json({ appointment });
};


const createAppointment = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const appointment = await Appointment.create(req.body);
    res.status(StatusCodes.CREATED).json({ appointment });
}

const updateAppointment = async (req, res) => {
    const {
        body:{date, title},
        user:{userId}, 
        params:{id:appointmentId} 
    } = req

    if (!date || !title || date.trim() === '' || title.trim() === '') {
        throw new BadRequestError('Appointment fields cannot be empty')
    }

    const appointment = await Appointment.findByIdAndUpdate(  //** */
        { _id: appointmentId, createdBy: userId },
        req.body, 
        { new:true, runValidators:true }
    )
    if(!appointment) {
        throw new NotFoundError(`No appointment with id${appointmentId}`)
    }
    res.status(StatusCodes.OK).json({ appointment })
}


const deleteAppointment = async (req, res) => {
    const {
        user:{userId}, 
        params:{id:appointmentId} 
    } = req

    const appointment = await Appointment.findByIdAndRemove({
        _id:appointmentId,
        createdBy:userId,
    })
    
    if(!appointment) {
        throw new NotFoundError(`No appointment with id${appointmentId}`)
    }
    res.status(StatusCodes.OK).json({ msg: "The entry was deleted." });
    // res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
}