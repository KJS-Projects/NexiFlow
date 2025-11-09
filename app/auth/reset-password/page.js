// app/auth/reset-password/page.js
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/utils/firebase";
import Link from "next/link";
import { FiLock, FiCheck, FiAlertCircle, FiArrowLeft } from "react-icons/fi";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [validCode, setValidCode] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [oobCode, setOobCode] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    // Get the oobCode from URL parameters
    const code = searchParams.get("oobCode");

    if (code) {
      setOobCode(code);
      verifyResetCode(code);
    } else {
      setVerifying(false);
      setMessage({
        type: "error",
        text: "Invalid or missing reset code. Please request a new password reset link.",
      });
    }
  }, [searchParams]);

  const verifyResetCode = async (code) => {
    try {
      await verifyPasswordResetCode(auth, code);
      setValidCode(true);
    } catch (error) {
      console.error("Error verifying reset code:", error);
      setMessage({
        type: "error",
        text: "This password reset link is invalid or has expired. Please request a new one.",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage({
        type: "success",
        text: "Password reset successfully! You can now sign in with your new password.",
      });

      // Clear form
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error resetting password:", error);

      let errorMessage = "Failed to reset password. Please try again.";

      switch (error.code) {
        case "auth/weak-password":
          errorMessage = "Password is too weak. Please choose a stronger password.";
          break;
        case "auth/expired-action-code":
          errorMessage = "This password reset link has expired. Please request a new one.";
          break;
        case "auth/invalid-action-code":
          errorMessage = "This password reset link is invalid. Please request a new one.";
          break;
        default:
          errorMessage = error.message || "An unexpected error occurred.";
      }

      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto"></div>
            </div>
            <p className="mt-4 text-gray-600">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <FiLock className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Marketplace</span>
            </div>
          </Link>

          <h2 className="mt-6 text-3xl font-bold text-gray-900">Set New Password</h2>

          <p className="mt-2 text-sm text-gray-600">{validCode ? "Enter your new password below" : "Unable to reset password"}</p>
        </div>

        {/* Back to Sign In */}
        <div className="text-center">
          <Link href="/auth/signin" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 font-medium">
            <FiArrowLeft className="mr-2" />
            Back to sign in
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {validCode ? (
            <>
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
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                      placeholder="Enter new password"
                      minLength={6}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters long</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                      placeholder="Confirm new password"
                      minLength={6}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || message.type === "success"}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>

              {message.type === "success" && (
                <div className="mt-6 text-center">
                  <Link href="/auth/signin" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 font-medium">
                    Sign in with your new password
                  </Link>
                </div>
              )}
            </>
          ) : (
            /* Invalid Code State */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="text-red-500 text-2xl" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">Invalid Reset Link</h3>

              <p className="text-gray-600 mb-6">{message.text || "This password reset link is invalid or has expired."}</p>

              <div className="space-y-3">
                <Link
                  href="/auth/forgot-password"
                  className="block w-full py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300">
                  Request New Reset Link
                </Link>

                <Link
                  href="/auth/signin"
                  className="block w-full py-3 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300">
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
