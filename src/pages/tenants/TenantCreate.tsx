import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TenantForm, {type TenantFormData} from "../../component/TenantForm.tsx";
import {SubscriptionPlan} from "../../modules/tenant.model.ts";
import {tenantApi} from "../../api/tenant-api.ts";


const TenantCreate: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<TenantFormData>({
        hotelName: '',
        email: '',
        phoneNumber: '',
        address: '',
        subscriptionPlan: SubscriptionPlan.FREE,
        metadata: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.hotelName ||
            !formData.email ||
            !formData.phoneNumber ||
            !formData.address
        ) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await tenantApi.createTenant({
                hotelName: formData.hotelName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                subscriptionPlan: formData.subscriptionPlan,
                metadata: formData.metadata || undefined,
            });

            navigate('/tenants');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create tenant');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                    Create New Tenant
                </h1>

                <button
                    onClick={() => navigate('/tenants')}
                    className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                    ← Back to List
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <TenantForm formData={formData} onChange={setFormData} />

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading && (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        )}
                        {loading ? 'Creating...' : 'Create Tenant'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/tenants')}
                        disabled={loading}
                        className="rounded-md border border-gray-300 px-6 py-2.5 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                </div>
            </form>

            {/* Error Toast */}
            {error && (
                <div className="fixed right-6 top-6 z-50 w-full max-w-sm rounded-md border border-red-200 bg-red-50 p-4 text-red-700 shadow">
                    <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="text-lg leading-none"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TenantCreate;
