"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Booking {
  id: string;
  user: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
  service: string;
  notes?: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Fetch bookings from API
    // Replace with your actual API call
    setBookings([
      {
        id: "1",
        user: "John Doe",
        date: "2024-07-20",
        status: "confirmed",
        service: "Consultation",
      },
      // ...more bookings
    ]);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>
      <Button asChild>
        <Link href="/dashboard/admin/bookings/create">Create Booking</Link>
      </Button>
      <table className="min-w-full mt-4">
        <thead>
          <tr>
            <th>User</th>
            <th>Date</th>
            <th>Status</th>
            <th>Service</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.user}</td>
              <td>{booking.date}</td>
              <td>{booking.status}</td>
              <td>{booking.service}</td>
              <td>
                <Link href={`/dashboard/admin/bookings/${booking.id}`}>
                  <Button size="sm">View</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
