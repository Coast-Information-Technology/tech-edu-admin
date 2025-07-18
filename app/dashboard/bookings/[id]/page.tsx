"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function BookingDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    // Fetch booking by id (placeholder)
    setBooking({
      id,
      user: "John Doe",
      date: "2024-07-20",
      status: "confirmed",
      service: "Consultation",
      notes: "Sample notes",
    });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send PUT/PATCH request to API
    // await api.put(`/api/bookings/${id}`, booking);
    router.push("/dashboard/bookings");
  };

  const handleDelete = () => {
    // TODO: Send DELETE request to API
    // await api.delete(`/api/bookings/${id}`);
    router.push("/dashboard/bookings");
  };

  if (!booking) return <div>Loading...</div>;

  return (
    <form onSubmit={handleUpdate} className="max-w-md mx-auto mt-8 space-y-4">
      <input
        name="user"
        value={booking.user}
        onChange={handleChange}
        className="w-full border p-2"
      />
      <input
        name="date"
        type="date"
        value={booking.date}
        onChange={handleChange}
        className="w-full border p-2"
      />
      <select
        name="status"
        value={booking.status}
        onChange={handleChange}
        className="w-full border p-2"
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <input
        name="service"
        value={booking.service}
        onChange={handleChange}
        className="w-full border p-2"
      />
      <input
        name="notes"
        value={booking.notes}
        onChange={handleChange}
        className="w-full border p-2"
      />
      <div className="flex gap-2">
        <Button type="submit">Update</Button>
        <Button type="button" variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </form>
  );
}
