import React, { useState, useContext, useEffect } from "react";
import { FaStar } from "react-icons/fa6";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { v4 as uuidv4 } from 'uuid';
const Booking = ({ price, title, reviewsArray, avgRating,id }) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const { user } = useContext(AuthContext);

  const [data, setData] = useState({
    userId: user && user._id,
    tourName: title,
    fullName: "",
    totalPrice: price,
    phone: "",
    maxGroupSize: 1,
    bookAt: currentDate,
    date: "",
  });

  const calculatedPrice = data.maxGroupSize * price;

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      tourName: title,
      totalPrice: calculatedPrice,
    }));
  }, [title, calculatedPrice]);

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please Sign In first");
      return;
    }

    try {
      // Call backend to create a Stripe session
      const response = await fetch(`http://localhost:3050/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: calculatedPrice * 100, // Convert to cents
          tourName: title,
          userId: user._id,
        }),
      });

      const result = await response.json();

      if (response.ok && result.url) {
        // Redirect to Stripe's Checkout page
        await fetch(`http://localhost:3050/api/booking`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentIntentId:uuidv4(),
            userId:user._id,
            tourId:id,
            bookingDate:data.date,
            totalPrice:calculatedPrice,
            username:data.fullName,
            tourname:title,
            members:data.maxGroupSize,
            phone:data.phone
          }),
        });
        window.location.href = result.url;

      } else {
        toast.error(result.message || "Failed to create payment session");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Server not responding");
    }
  };

  return (
    <div className="booking-container">
      <div className="flex justify-between items-center">
        <h3 className="text-[25px] md:text-[40px] font-bold mb-4 text-start text-BaseColor">
          ${price} <span>/per person</span>
        </h3>
        <div className="flex items-center gap-2">
          <i>
            <FaStar />
          </i>
          <span className="flex gap-1">
            <div>{avgRating}</div>
            <div>({reviewsArray.length})</div>
          </span>
        </div>
      </div>

      <div className="py-6 space-y-4">
        <h5 className="text-[18px] md:text-2xl font-semibold">Booking Information</h5>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              className="booking_input"
              type="text"
              placeholder="Full Name"
              id="fullName"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="booking_input"
              type="text"
              placeholder="Contact No."
              id="phone"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="booking_input"
              type="number"
              placeholder="Number of Persons?"
              id="maxGroupSize"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="booking_input"
              type="date"
              id="date"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mt-12">
            <div className="flex my-4 justify-between">
              <span>Gross Price: </span>
              <p className="font-semibold">Rs. {price}</p>
            </div>
            <div className="flex my-4 border-b-[1px] pb-2 border-black justify-between">
              <span>GST: </span>
              <p className="font-semibold">0%</p>
            </div>
            <div className="flex my-6 justify-between font-bold text-lg">
              <span>Net Price: </span>
              <p>Rs. {calculatedPrice}</p>
            </div>
          </div>
          <button type="submit" className="btn w-full">
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
