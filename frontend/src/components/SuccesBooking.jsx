import React from "react";
import { useNavigate } from "react-router-dom";

const BookingSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Booking Completed!</h1>
                <p className="text-gray-700 mb-6">
                    Thank you for your booking. Your payment was successful, and your trip has been confirmed!
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="btn bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default BookingSuccess;
