// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bus: {
    type: Object,
    required: true
  },
  seats: {
    type: Array,
    required: true
  },
  passengerDetails: {
    type: Array,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0 
  },
  status: {
    type: String,
    default: 'confirmed',
    enum: ['confirmed', 'cancelled', 'completed']
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  pnr: {
    type: String,
    unique: true,
    default: () => Math.random().toString(36).substring(2, 10).toUpperCase()
  }
},{
  // Add validation error transformation
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
    }
  },
  toObject: {
    transform: function(doc, ret) {
      delete ret.__v;
    }
  }
});

// Add pre-save validation
bookingSchema.pre('save', function(next) {
  if (!this.totalPrice && this.bus?.price && this.seats?.length) {
    this.totalPrice = this.bus.price * this.seats.length;
  }
  next();
});


// Change this line to use named export
export const Booking = mongoose.model('Booking', bookingSchema);