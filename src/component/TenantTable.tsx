import React from 'react';
import { useNavigate } from 'react-router-dom';
import {SubscriptionPlan, type Tenant, TenantStatus} from "../modules/tenant.model.ts";


interface TenantTableProps {
    tenants: Tenant[];
    page: number;
    size: number;
    total: number;
    onPageChange: (page: number) => void;
    onSizeChange: (size: number) => void;
    onDelete: (tenantId: string) => void;
    onSuspend: (tenantId: string) => void;
    onActivate: (tenantId: string) => void;
}

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

const TenantTable: React.FC<TenantTableProps> = ({
                                                     tenants,
                                                     page,
                                                     size,
                                                     total,
                                                     onPageChange,
                                                     onSizeChange,

                                                 }) => {
    const navigate = useNavigate();
   /* const superAdmin = isSuperAdmin();*/

    const totalPages = Math.ceil(total / size);

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100">
                    <tr>
                        {[
                            'Hotel Name',
                            'Email',
                            'Phone',
                            'Subscription',
                            'Status',
                            'Created At',
                            'Actions',
                        ].map((h) => (
                            <th
                                key={h}
                                className="px-4 py-3 text-left text-sm font-semibold text-blue-900"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {tenants.length === 0 ? (
                        <tr>
                            <td
                                colSpan={7}
                                className="py-16 text-center text-gray-500"
                            >
                  <span className="text-lg font-medium">
                    No tenants found
                  </span>
                            </td>
                        </tr>
                    ) : (
                        tenants.map((tenant) => (
                            <tr
                                key={tenant.tenantId}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="px-4 py-3 font-medium">
                                    {tenant.hotelName}
                                </td>
                                <td className="px-4 py-3">{tenant.email}</td>
                                <td className="px-4 py-3">{tenant.phoneNumber}</td>
                                <td className="px-4 py-3">
                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${planBadge(
                            tenant.subscriptionPlan
                        )}`}
                    >
                      {tenant.subscriptionPlan}
                    </span>
                                </td>
                                <td className="px-4 py-3">
                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(
                            tenant.status
                        )}`}
                    >
                      {tenant.status}
                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {new Date(tenant.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            title="View"
                                            onClick={() =>
                                                navigate(`/tenants/${tenant.tenantId}`)
                                            }
                                            className="rounded p-1 text-blue-600 hover:bg-blue-50"
                                        >
                                            👁
                                        </button>

                                        <button
                                            title="Edit"
                                            onClick={() =>
                                                navigate(
                                                    `/tenants/${tenant.tenantId}/edit`
                                                )
                                            }
                                            className="rounded p-1 text-blue-600 hover:bg-blue-50"
                                        >
                                            ✏️
                                        </button>

                                      {/*  {superAdmin &&
                                            tenant.status === TenantStatus.ACTIVE && (
                                                <button
                                                    title="Suspend"
                                                    onClick={() =>
                                                        onSuspend(tenant.tenantId)
                                                    }
                                                    className="rounded p-1 text-yellow-600 hover:bg-yellow-50"
                                                >
                                                    ⛔
                                                </button>
                                            )}

                                        {superAdmin &&
                                            tenant.status ===
                                            TenantStatus.SUSPENDED && (
                                                <button
                                                    title="Activate"
                                                    onClick={() =>
                                                        onActivate(tenant.tenantId)
                                                    }
                                                    className="rounded p-1 text-green-600 hover:bg-green-50"
                                                >
                                                    ✅
                                                </button>
                                            )}

                                        {superAdmin && (
                                            <button
                                                title="Delete"
                                                onClick={() =>
                                                    onDelete(tenant.tenantId)
                                                }
                                                className="rounded p-1 text-red-600 hover:bg-red-50"
                                            >
                                                🗑
                                            </button>
                                        )}*/}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-3">
                <div className="text-sm text-gray-600">
                    Page {page + 1} of {totalPages}
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={size}
                        onChange={(e) => onSizeChange(Number(e.target.value))}
                        className="rounded border border-gray-300 px-2 py-1 text-sm"
                    >
                        {[10, 20, 50, 100].map((s) => (
                            <option key={s} value={s}>
                                {s} / page
                            </option>
                        ))}
                    </select>

                    <button
                        disabled={page === 0}
                        onClick={() => onPageChange(page - 1)}
                        className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <button
                        disabled={page + 1 >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                        className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TenantTable;
