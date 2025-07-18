"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CreateBooking() {
  const [form, setForm] = useState({
    user: "",
    date: "",
    status: "pending",
    service: "",
    notes: "",
  });
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send POST request to API
    // await api.post('/api/bookings', form);
    router.push("/dashboard/bookings");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-4">
      <input
        name="user"
        placeholder="User"
        value={form.user}
        onChange={handleChange}
        required
        className="w-full border p-2"
      />
      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        required
        className="w-full border p-2"
      />
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border p-2"
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <input
        name="service"
        placeholder="Service"
        value={form.service}
        onChange={handleChange}
        required
        className="w-full border p-2"
      />
      <input
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
        className="w-full border p-2"
      />
      <Button type="submit">Create Booking</Button>
    </form>
  );
}
