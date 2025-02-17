import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import axios from 'axios';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/utils/constant';

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState(""); 
    const { token } = useParams(); 
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or expired reset link");
            navigate("/login");
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password
        if (!password) {
            setPasswordError("Password is required.");
            return;
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long.");
            return;
        } else if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }
        setPasswordError(""); 

        try {
            setLoading(true);
            console.log("Reset Token:", token); // Debugging

            // Update this to send 'newPassword' instead of 'password'
            const response = await axios.post(`${USER_API_END_POINT}/reset-password/${token}`, { 
                newPassword: password,  // Send 'newPassword' to match backend
                confirmPassword,  // Keep this if necessary on backend for validation
                token 
            });

            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.error("Reset Password Error:", error.response ? error.response.data : error);
            toast.error(error.response?.data?.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center max-w-7xl mx-auto">
            <form onSubmit={handleSubmit} className="w-full sm:w-96 border border-gray-200 rounded-md p-4 my-10">
                <h1 className="font-bold text-xl mb-5">Reset Password</h1>
                <div className="my-2">
                    <Label>New Password</Label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                    />
                    {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                </div>
                <div className="my-2">
                    <Label>Confirm Password</Label>
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                    />
                </div>
                <Button type="submit" className="w-full my-4" disabled={loading}>
                    {loading ? "Please wait..." : "Reset Password"}
                </Button>
            </form>
        </div>
    );
};

export default ResetPassword;
