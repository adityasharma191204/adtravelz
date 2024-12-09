import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import Stripe from "stripe";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import tourRoutes from "./routes/tourRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import Booking from "./models/Booking.js"; // Import Booking model

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3050;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB connection error:", err));

// Middleware
const allowedOrigins = [
  "https://adtravelz-frontend.onrender.com",
  // "http://localhost:5173",
  // "http://127.0.0.1:5173",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// Stripe Payment Route
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, tourName, userId } = req.body;

    if (!amount || !tourName || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: tourName },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/success`,
      cancel_url: `http://localhost:5173/booking-cancel`,
    });

    res.status(200).json({ url: session.url});
  } catch (err) {
    console.error("Stripe session creation error:", err.message);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// Booking Route
app.post("/api/booking", async (req, res) => {
  console.log(req.body)
  try {
    const { paymentIntentId, userId, tourId, bookingDate, totalPrice ,username,tourname,members,phone} = req.body;

    if (!paymentIntentId || !userId || !tourId || !bookingDate || !totalPrice || !username || !tourname || !members || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save the booking in the database
    const booking = new Booking({
      userId,
      tourId,
      bookingDate,
      totalPrice,
      paymentIntentId,
      username,
      tourname,
      members,
      phone
    });

    await booking.save(); // Save booking to MongoDB
    console.log("Booking saved:", booking);

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/bookings/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Missing required userId" });
    }

    // Fetch all bookings for the given userId
    const bookings = await Booking.find({ userId }).populate("tourId"); // Assuming `tourId` is a reference to the Tour model

    if (!bookings.length) {
      return res.status(404).json({ error: "No bookings found for this user" });
    }
    console.log(bookings);
    res.status(200).json({ message: "Bookings fetched successfully", data:bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/tours/booked", async (req, res) => {
  try {
    // Fetch all bookings and populate the tourId to get full tour details
    const bookings = await Booking.find(); // Assuming `tourId` is a reference to the Tour model

    if (!bookings.length) {
      return res.status(404).json({ error: "No booked tours found" });
    }

    // Return all booked tours (no specific filtering)
    // const bookedTours = bookings.map((booking) => booking.tourId); // Extract only the tour information from bookings
    // console.log(bookedTours)
    res.status(200).json({
      message: "All booked tours fetched successfully",
      data: bookings, // This will include all tours associated with bookings
    });
  } catch (error) {
    console.error("Error fetching booked tours:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tour", tourRoutes);
app.use("/api/review", reviewRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Trips & Travels API!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
