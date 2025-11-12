// app/auth/forgot-password/page.js
"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/utils/firebaseBrowser";
import Link from "next/link";
import { FiMail, FiArrowLeft, FiCheck, FiAlertCircle, FiLock } from "react-icons/fi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      setMessage({
        type: "success",
        text: "Password reset email sent! Check your inbox for further instructions.",
      });
    } catch (error) {
      console.error("Error sending password reset email:", error);

      let errorMessage = "Failed to send password reset email. Please try again.";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        default:
          errorMessage = error.message || "An unexpected error occurred.";
      }

      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-amber-600 rounded-2xl flex items-center justify-center">
                <FiLock className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Marketplace</span>
            </div>
          </Link>

          <h2 className="mt-6 text-3xl font-bold text-gray-900">Reset Your Password</h2>

          <p className="mt-2 text-sm text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        {/* Back to Sign In */}
        <div className="text-center">
          <Link href="/auth/signin" className="inline-flex items-center text-sm text-teal-600 hover:text-teal-500 font-medium">
            <FiArrowLeft className="mr-2" />
            Back to sign in
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {!emailSent ? (
            <>
              {/* Instructions */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 text-gray-600">
                  <FiMail className="text-teal-500 text-lg" />
                  <p className="text-sm">We'll send a password reset link to your email</p>
                </div>
              </div>

              {/* Error/Success Message */}
              {message.text && (
                <div
                  className={`mb-6 p-4 rounded-xl flex items-start space-x-3 ${
                    message.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}>
                  {message.type === "success" ? (
                    <FiCheck className="text-green-500 text-lg mt-0.5 flex-shrink-0" />
                  ) : (
                    <FiAlertCircle className="text-red-500 text-lg mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-sm">{message.text}</p>
                </div>
              )}

              {/* Reset Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-amber-600 hover:from-teal-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending Reset Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="text-green-500 text-2xl" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h3>

              <p className="text-gray-600 mb-2">We've sent a password reset link to:</p>

              <p className="text-teal-600 font-medium mb-6">{email}</p>

              <div className="bg-teal-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-teal-700">
                  <strong>Didn't receive the email?</strong> Check your spam folder or make sure you entered the correct email address.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setMessage({ type: "", text: "" });
                  }}
                  className="w-full py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300">
                  Try Another Email
                </button>

                <Link
                  href="/auth/signin"
                  className="block w-full py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-amber-600 hover:from-teal-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-300">
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <Link href="/contact" className="font-medium text-teal-600 hover:text-teal-500">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
