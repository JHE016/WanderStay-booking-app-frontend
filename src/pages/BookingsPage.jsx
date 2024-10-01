import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import { Link } from "react-router-dom";
import axios from "axios";
import PlaceImg from "./PlaceImg";
import { differenceInCalendarDays } from 'date-fns';

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios.get('/bookings')
            .then(response => {
                setBookings(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the bookings!", error);
            });
    }, []);

    return (
        <div>
            <AccountNav />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Bookings & Trips</h1>
                {bookings.length > 0 ? bookings.map(booking => (
                    <Link to={`/account/bookings/${booking._id}`} key={booking._id} className="mb-4">
                        <h2 className="text-2xl font-semibold">
                            {/* Null check to ensure place exists before trying to access city */}
                            {booking.place?.city || "Unknown City"}
                        </h2>
                        <p className="text-gray-600">
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                        </p>
                        <div className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden p-4 relative">
                            <div className="w-32 h-32">
                                {booking.place && (
                                    <PlaceImg place={booking.place} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="flex flex-col justify-between flex-grow">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {booking.place?.title || "Unknown Place"}
                                    </h3>
                                    <p className="text-gray-600">
                                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()} • {booking.place?.city || "Unknown City"}
                                    </p>
                                    <h3>
                                        Number of nights: {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))} 
                                    </h3>
                                    {new Date(booking.checkOut) < new Date() ? (
                                        <p className="text-green-600">Completed</p>
                                    ) : (
                                        <p className="text-red-600">Not Completed</p>
                                    )}
                                </div>
                            </div>
                            <div className="absolute top-4 right-4">
                                <p className="text-xl font-bold">
                                    US${booking.price?.toFixed(2) || "N/A"}
                                </p>
                            </div>
                        </div>
                    </Link>
                )) : (
                    <p>No bookings available.</p>
                )}
            </div>
        </div>
    );
}
