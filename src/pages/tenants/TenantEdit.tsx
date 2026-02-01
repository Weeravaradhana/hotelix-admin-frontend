import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TenantForm, {type TenantFormData} from "../../component/TenantForm.tsx";
import {SubscriptionPlan} from "../../modules/tenant.model.ts";
import {tenantApi} from "../../api/tenant-api.ts";
;

const TenantEdit: React.FC = () => {
    const navigate = useNavigate();
    const { tenantId } = useParams<{ tenantId: string }>();
/*    const superAdmin = isSuperAdmin();*/

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState<TenantFormData>({
        hotelName: "",
        email: "",
        phoneNumber: "",
        address: "",
        subscriptionPlan: SubscriptionPlan.FREE,
        metadata: "",
    });


    const [subscriptionPlan, setSubscriptionPlan] =
        useState<SubscriptionPlan>(SubscriptionPlan.FREE);

    useEffect(() => {
        if (!tenantId) return;

        tenantApi
            .getTenantById(tenantId)
            .then((tenant) => {
                setFormData({
                    hotelName: tenant.hotelName,
                    email: tenant.email,
                    phoneNumber: tenant.phoneNumber,
                    address: tenant.address,
                    subscriptionPlan: tenant.subscriptionPlan,
                    metadata: tenant.metadata || "",
                });
                setSubscriptionPlan(tenant.subscriptionPlan);
            })
            .catch((err) =>
                setError(err.response?.data?.message || "Failed to load tenant")
            )
            .finally(() => setFetchLoading(false));
    }, [tenantId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tenantId) return;

        if (!formData.hotelName || !formData.phoneNumber || !formData.address) {
            setError("Please fill in all required fields");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await tenantApi.updateTenant(tenantId, {
                hotelName: formData.hotelName,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                metadata: formData.metadata || undefined,
            });

            setSuccess("Tenant updated successfully");
            setTimeout(() => navigate("/tenants"), 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update tenant");
        } finally {
            setLoading(false);
        }
    };

    const handleSubscriptionUpdate = async () => {
        if (!tenantId) return;

        setLoading(true);
        try {
            await tenantApi.updateSubscription(tenantId, { subscriptionPlan });
            setSuccess("Subscription plan updated successfully");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update subscription");
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Edit Tenant</h1>
                <button
                    onClick={() => navigate("/tenants")}
                    className="rounded-lg border px-4 py-2 hover:bg-gray-50"
                >
                    Back to List
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="rounded-xl border bg-white p-6">
                    <TenantForm
                        formData={formData}
                        onChange={setFormData}
                        isEditMode
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/tenants")}
                        disabled={loading}
                        className="rounded-lg border px-6 py-2 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>

            {/* Subscription Update */}
            { (
                <div className="rounded-xl border bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                        Update Subscription Plan
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <select
                            value={subscriptionPlan}
                            onChange={(e) =>
                                setSubscriptionPlan(e.target.value as SubscriptionPlan)
                            }
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={SubscriptionPlan.FREE}>Basic</option>
                            <option value={SubscriptionPlan.PRO}>Pro</option>
                            <option value={SubscriptionPlan.ENTERPRISE}>Enterprise</option>
                        </select>

                        <button
                            onClick={handleSubscriptionUpdate}
                            disabled={
                                loading || subscriptionPlan === formData.subscriptionPlan
                            }
                            className="rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
                        >
                            Update Plan
                        </button>
                    </div>
                </div>
            )}

            {/* Alerts */}
            {error && (
                <div className="rounded-lg bg-red-100 p-4 text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-lg bg-green-100 p-4 text-green-700">
                    {success}
                </div>
            )}
        </div>
    );
};

export default TenantEdit;
