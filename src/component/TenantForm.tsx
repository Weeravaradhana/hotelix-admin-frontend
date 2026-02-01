import React from 'react';
import  {SubscriptionPlan} from "../modules/tenant.model.ts";


export interface TenantFormData {
    hotelName: string;
    email: string;
    phoneNumber: string;
    address: string;
    subscriptionPlan: SubscriptionPlan;
    metadata?: string;
}

interface TenantFormProps {
    formData: TenantFormData;
    onChange: (data: TenantFormData) => void;
    isEditMode?: boolean;
}

const TenantForm: React.FC<TenantFormProps> = ({
                                                   formData,
                                                   onChange,
                                                   isEditMode = false,
                                               }) => {
    const handleChange =
        (field: keyof TenantFormData) =>
            (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                onChange({
                    ...formData,
                    [field]: event.target.value,
                });
            };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-6 text-xl font-semibold text-gray-800">
                {isEditMode ? 'Edit Tenant Information' : 'Create New Tenant'}
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Hotel Name *
                    </label>
                    <input
                        type="text"
                        value={formData.hotelName}
                        onChange={handleChange('hotelName')}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Email *
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={handleChange('email')}
                        disabled={isEditMode}
                        className={`w-full rounded-md border px-3 py-2 focus:outline-none ${
                            isEditMode
                                ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-500'
                        }`}
                        required
                    />
                    {isEditMode && (
                        <p className="mt-1 text-xs text-gray-500">
                            Email cannot be changed
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Phone Number *
                    </label>
                    <input
                        type="text"
                        value={formData.phoneNumber}
                        onChange={handleChange('phoneNumber')}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Subscription Plan *
                    </label>
                    <select
                        value={formData.subscriptionPlan}
                        onChange={handleChange('subscriptionPlan')}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-500"
                        required
                    >
                        <option value={SubscriptionPlan.FREE}>
                            Free – Essential features for small hotels
                        </option>
                        <option value={SubscriptionPlan.PRO}>
                            Pro – Advanced features for growing businesses
                        </option>
                        <option value={SubscriptionPlan.ENTERPRISE}>
                            Enterprise – Full features for large organizations
                        </option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Address *
                    </label>
                    <textarea
                        rows={2}
                        value={formData.address}
                        onChange={handleChange('address')}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-500"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Metadata (Optional)
                    </label>
                    <textarea
                        rows={3}
                        value={formData.metadata || ''}
                        onChange={handleChange('metadata')}
                        placeholder="Additional information in JSON format"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-blue-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default TenantForm;
