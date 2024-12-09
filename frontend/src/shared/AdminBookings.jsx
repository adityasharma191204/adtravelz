/* eslint-disable react/prop-types */
import BASE_URL from "../utils/config";
import { toast } from "react-toastify";

const BookingCard = ({ booking }) => {
  console.log(booking);
  const {
    tourName,
    tourname,
    fullName,
    username,
    userId,
    members,
    phone,
    totalPrice,
    maxGroupSize,
    date,
    bookingDate,
    createdAt,
    _id,
  } = booking;

  const setCreatedAt = new Date(createdAt);
  const newCreatedAt = setCreatedAt.toDateString(); // Get a string representing the date portion

  const booked = new Date(date || bookingDate);
  const bookedFor = booked.toDateString(); // Get a string representing the date portion

  const confirmDelete = async () => {
    const result = window.confirm("Is this booking completed?");
    if (result) {
      deleteBooking();
    }
  };

  const deleteBooking = async () => {
    try {
      const response = await fetch(`${BASE_URL}/booking/${_id}`, {
        method: "DELETE",
      });
      const { message } = await response.json();

      if (response.ok) {
        // toast.success(message)
        location.reload();
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error("Server not responding");
    }
  };

  return (
    <>
      <tbody className="rounded overflow-hidden py-8 px-3 border-b-gray-500 border-b-[1px]   ">
        <tr className="w-full text-center overflow-hidden">
          <td className="">{tourName || tourname}</td>
          <td className="">{fullName || username}</td>
          <td className="">{userId}</td>
          <td className="">{maxGroupSize || members}</td>
          <td className="">{phone}</td>
          <td className="">{bookedFor}</td>
          <td className="">{newCreatedAt}</td>
          <td className="">{totalPrice}</td>
          <td>
            <button onClick={confirmDelete} className="Redbtn my-2 mx-2 ">
              Completed
            </button>
          </td>
        </tr>
      </tbody>
    </>
  );
};

export default BookingCard;
