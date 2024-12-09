import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    tourId: { type: String, required: true },
    bookingDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    paymentIntentId: { type: String, required: true },
    username: { type: String, required: true },
    tourname: { type: String, required: true },
    members: { type: String, required: true },
    phone: { type: String, required: true },

  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
