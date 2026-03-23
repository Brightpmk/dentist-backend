const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: [true, 'Please add reason for visit'],
    trim: true,
    maxlength: [500, 'Reason cannot be more than 500 characters']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  dentist: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dentist',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);