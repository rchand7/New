import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import axios from 'axios';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/utils/constant';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState(""); // Track error message for email validation
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Simple email validation
        if (!email) {
            setEmailError("Email is required.");
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Please enter a valid email address.");
            return;
        }
        setEmailError(""); // Clear error message if valid

        try {
            setLoading(true);
            const response = await axios.post(`${USER_API_END_POINT}/forgot-password`, { email });
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/login"); // Redirect user to login page after successful email submission
            }
        } catch (error) {
            // Handle network or server errors
            if (error.response && error.response.data) {
                toast.error(error.response.data.message || "An unexpected error occurred.");
            } else {
                toast.error("An error occurred. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center max-w-7xl mx-auto">
            <form onSubmit={handleSubmit} className="w-full sm:w-96 border border-gray-200 rounded-md p-4 my-10">
                <h1 className="font-bold text-xl mb-5">Forgot Password</h1>
                <div className="my-2">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>} {/* Display email error message */}
                </div>
                <Button type="submit" className="w-full my-4" disabled={loading}>
                    {loading ? "Please wait..." : "Submit"}
                </Button>
            </form>
        </div>
    );
};

export default ForgotPassword;
