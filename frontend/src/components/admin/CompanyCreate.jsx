import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);  // Track loading state
    const dispatch = useDispatch();

    // Validate company name
    const isValid = companyName.trim() !== '';

    const registerNewCompany = async () => {
        if (!isValid) {
            toast.error('Company name cannot be empty');
            return;
        }

        setLoading(true);  // Show loading indicator

        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            } else {
                toast.error(res?.data?.message || 'Failed to create company');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while creating the company');
        } finally {
            setLoading(false);  // Hide loading indicator
        }
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>Your Company Name</h1>
                    <p className='text-gray-500'>What would you like to give your company name? You can change this later.</p>
                </div>

                <Label>Company Name</Label>
                <Input
                    type="text"
                    className="my-2"
                    placeholder="JobHunt, Microsoft, etc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    aria-describedby="company-name-helper-text"
                />
                <div className="text-sm text-gray-500" id="company-name-helper-text">
                    Please provide the name of your company.
                </div>

                <div className='flex items-center gap-2 my-10'>
                    <Button variant="outline" onClick={() => navigate("/admin/companies")}>Cancel</Button>
                    <Button
                        onClick={registerNewCompany}
                        disabled={!isValid || loading}
                        isLoading={loading}  // Show loading spinner on button
                    >
                        {loading ? 'Creating...' : 'Continue'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CompanyCreate;
