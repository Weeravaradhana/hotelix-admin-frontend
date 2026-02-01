import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {SubscriptionPlan, type Tenant, TenantStatus} from "../../modules/tenant.model.ts";
import {tenantApi} from "../../api/tenant-api.ts";


const statusBadge = (status: TenantStatus) => {
    switch (status) {
        case TenantStatus.ACTIVE:
            return 'bg-green-100 text-green-700';
        case TenantStatus.SUSPENDED:
            return 'bg-yellow-100 text-yellow-700';
        case TenantStatus.DELETED:
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const planBadge = (plan: SubscriptionPlan) => {
    switch (plan) {
        case SubscriptionPlan.FREE:
            return 'bg-gray-100 text-gray-700';
        case SubscriptionPlan.PRO:
            return 'bg-blue-100 text-blue-700';
        case SubscriptionPlan.ENTERPRISE:
            return 'bg-purple-100 text-purple-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const TenantDetails: React.FC = () => {
    const navigate = useNavigate();
    const { tenantId } = useParams<{ tenantId: string }>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tenant, setTenant] = useState<Tenant | null>(null);

    useEffect(() => {
        loadTenant();
    }, [tenantId]);

    const loadTenant = async () => {
        if (!tenantId) return;

        setLoading(true);
        try {
            const data = await tenantApi.getTenantById(tenantId);
            setTenant(data);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                'Failed to load tenant details'
            );
        } finally {
            setLoading(false);
        }
    };

    /* Loading */
    if (loading) {
        return (
            <div className="flex justify-center py-16">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                </div>
        );
    }

    /* Not found */
    if (!tenant) {
        return (
            <div className="rounded-md bg-red-50 p-4 text-red-700">
                Tenant not found
        </div>
    );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
    <h1 className="text-2xl font-bold text-gray-800">
        Tenant Details
    </h1>

    <div className="flex gap-2">
    <button
        onClick={() =>
    navigate(`/tenants/${tenantId}/edit`)
}
    className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
            ✏️ Edit Tenant
    </button>
    <button
    onClick={() => navigate('/tenants')}
    className="rounded-md border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100"
        >
            ← Back to List
    </button>
    </div>
    </div>

    {/* Main Card */}
    <div className="rounded-lg border border-gray-200 bg-white p-6">
        {/* Title */}
        <div className="flex flex-wrap items-start justify-between gap-4">
    <div>
        <h2 className="text-xl font-bold">
        {tenant.hotelName}
        </h2>
        <p className="text-sm text-gray-500">
        ID: {tenant.tenantId}
    </p>
    </div>

    <div className="flex gap-2">
    <span
        className={`rounded-full px-3 py-1 text-sm font-semibold ${statusBadge(
        tenant.status
    )}`}
>
    {tenant.status}
    </span>
    <span
    className={`rounded-full px-3 py-1 text-sm font-semibold ${planBadge(
        tenant.subscriptionPlan
    )}`}
>
    {tenant.subscriptionPlan}
    </span>
    </div>
    </div>

    <hr className="my-6" />

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Contact Info */}
        <div className="rounded-lg border border-gray-200 p-5">
    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-900">
              📧 Contact Information
    </h3>

    <div className="space-y-4">
    <div>
        <p className="text-xs text-gray-500">
        Email Address
    </p>
    <p className="font-medium">{tenant.email}</p>
    </div>

    <div>
    <p className="text-xs text-gray-500">
        Phone Number
    </p>
    <p className="font-medium">
    {tenant.phoneNumber}
    </p>
    </div>

    <div>
    <p className="text-xs text-gray-500">
        Address
        </p>
        <p className="font-medium">
        {tenant.address}
        </p>
        </div>
        </div>
        </div>

    {/* Timeline */}
    <div className="rounded-lg border border-gray-200 p-5">
    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-900">
              📅 Timeline
    </h3>

    <div className="space-y-4">
    <div>
        <p className="text-xs text-gray-500">
        Created At
    </p>
    <p className="font-medium">
    {new Date(
            tenant.createdAt
        ).toLocaleString()}
    </p>
    </div>

    <div>
    <p className="text-xs text-gray-500">
        Last Updated
    </p>
    <p className="font-medium">
        {new Date(
                tenant.updatedAt
            ).toLocaleString()}
        </p>
        </div>
        </div>
        </div>

    {/* Metadata */}
    {tenant.metadata && (
        <div className="md:col-span-2 rounded-lg border border-gray-200 p-5">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-900">
            ℹ️ Additional Information
    </h3>

    <pre className="overflow-auto rounded bg-gray-100 p-4 text-sm">
        {tenant.metadata}
        </pre>
        </div>
    )}
    </div>
    </div>

    {/* Error Toast */}
    {error && (
        <div className="fixed right-6 top-6 z-50 rounded-md bg-red-50 px-4 py-3 text-red-700 shadow">
        <div className="flex items-center gap-3">
        <span className="font-medium">{error}</span>
            <button onClick={() => setError(null)}>✕</button>
    </div>
    </div>
    )}
    </div>
);
};

export default TenantDetails;
