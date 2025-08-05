"use client";
import React from "react";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-red-800 mb-4">
            Payment Cancelled
          </h1>
          <p className="text-red-600 text-lg mb-8">
            Your payment was cancelled. No charges were made to your account.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/products">
              <button className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Browse Products
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="px-6 py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-all duration-300">
                Go to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
