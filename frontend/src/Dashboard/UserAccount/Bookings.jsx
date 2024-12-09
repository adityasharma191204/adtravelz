import React, { useContext } from "react";
import useFetch from "../../hooks/useFetch";
import BASE_URL from "../../utils/config";
import { AuthContext } from "../../context/AuthContext";
import BookingCard from "../../shared/BookingCard";
import { AiOutlineConsoleSql } from "react-icons/ai";

const Bookings = () => {
  const { user } = useContext(AuthContext);
  const { apiData: bookings } = useFetch(`${BASE_URL}/bookings/user/${user._id}`);
  console.log(bookings);
  return (
    <div className="py-8">
      <div className="flex flex-col gap-5">
        <table className="w-full table-auto text-xs md:text-sm gap-4 border-collapse border">
          <thead className="w-full py-2">
            <tr>
              <th className="tableData">Tour</th>
              <th className="hidden md:block tableData">Persons</th>
              <th className="tableData">Booked for</th>
              <th className="tableData">Price</th>
              <th></th>
            </tr>
          </thead>
          {bookings?.map((booking) => (
            <BookingCard booking={booking} key={booking._id} />
          ))}
        </table>
      </div>
    </div>
  );
};

export default Bookings;
