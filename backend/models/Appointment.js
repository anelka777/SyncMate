const { required } = require('joi')
const mongoose = require('mongoose')

const AppointmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true,  'Please provide date and time for the appointment'],
    },
    title: {
        type: String,
        required: [true, 'Please provide appointment title'],
        maxlength: 50,
    },
    description: {
        type: String,
        maxlength: 200,
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'canceled'],
        default: 'scheduled'
    },
    createdBy: {
        type:mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema)