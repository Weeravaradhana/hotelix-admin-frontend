import React, {useCallback, useEffect, useState} from 'react';
/*import { useNavigate } from 'react-router-dom';*/
import  {type Tenant, TenantStatus} from "../../modules/tenant.model.ts";
import {tenantApi} from "../../api/tenant-api.ts";
import TenantTable from "../../component/TenantTable.tsx";


const TenantList: React.FC = () => {
   /* const navigate = useNavigate();*/
 /*   const superAdmin = isSuperAdmin();*/

    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] =
        useState<TenantStatus | 'ALL'>('ALL');

    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        tenantId: string | null;
    }>({ open: false, tenantId: null });

    const [suspendDialog, setSuspendDialog] = useState<{
        open: boolean;
        tenantId: string | null;
        reason: string;
    }>({ open: false, tenantId: null, reason: '' });

    const loadTenants = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (filterStatus === 'ALL') {
                console.log("ALL");
                const res = await tenantApi.getAllTenants(page, size);
                setTenants(res.content);
                setTotal(res.totalElements);
            } else {
                const res = await tenantApi.getTenantByStatus(filterStatus);
                console.log(res.content);
                setTenants(res.content);
                setTotal(res.content.length);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load tenants');
        } finally {
            setLoading(false);
        }
    }, [filterStatus, page, size]);

    useEffect(() => {
        loadTenants();
    }, [page, size, filterStatus, loadTenants]);

    const handleDelete = async () => {
        if (!deleteDialog.tenantId) return;

        try {
            await tenantApi.deleteTenant(deleteDialog.tenantId);
            setSuccess('Tenant deleted successfully');
            setDeleteDialog({ open: false, tenantId: null });
            loadTenants();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete tenant');
            setDeleteDialog({ open: false, tenantId: null });
        }
    };

    const handleSuspend = async () => {
        if (!suspendDialog.tenantId || !suspendDialog.reason.trim()) {
            setError('Suspension reason is required');
            return;
        }

        try {
            await tenantApi.suspendTenant(suspendDialog.tenantId, {
                reason: suspendDialog.reason,
            });
            setSuccess('Tenant suspended successfully');
            setSuspendDialog({ open: false, tenantId: null, reason: '' });
            await loadTenants();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to suspend tenant');
            setSuspendDialog({ open: false, tenantId: null, reason: '' });
        }
    };

    const handleActivate = async (tenantId: string) => {
        try {
            await tenantApi.activateTenant(tenantId);
            setSuccess('Tenant activated successfully');
            await loadTenants();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to activate tenant');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                    Tenant Management
                </h1>

               {/* {superAdmin && (
                    <button
                        onClick={() => navigate('/tenants/create')}
                        className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                        + Add New Tenant
                    </button>
                )}*/}
            </div>

            {/* Filter */}
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <span className="font-semibold text-blue-900">
          Filter by Status:
        </span>
                {(['ALL', TenantStatus.ACTIVE, TenantStatus.SUSPENDED, TenantStatus.DELETED] as const).map(

                    (status) => (

                        <button
                            key={status}
                            onClick={() => {
                                setFilterStatus(status);
                                setPage(0);
                            }}
                            className={`rounded-full border px-4 py-1 text-sm font-medium ${
                                filterStatus === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {status}
                        </button>

                    )

                )}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                </div>
            ) : (
                <TenantTable
                    tenants={tenants}
                    page={page}
                    size={size}
                    total={total}
                    onPageChange={setPage}
                    onSizeChange={(newSize) => {
                        setSize(newSize);
                        setPage(0);
                    }}
                    onDelete={(tenantId) =>
                        setDeleteDialog({ open: true, tenantId })
                    }
                    onSuspend={(tenantId) =>
                        setSuspendDialog({
                            open: true,
                            tenantId,
                            reason: '',
                        })
                    }
                    onActivate={handleActivate}
                />
            )}

            {/* Delete Dialog */}
            {deleteDialog.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-lg bg-white p-6">
                        <h2 className="mb-2 text-lg font-semibold text-blue-900">
                            Confirm Delete
                        </h2>
                        <p className="mb-6 text-sm text-gray-600">
                            Are you sure you want to delete this tenant? This
                            action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() =>
                                    setDeleteDialog({ open: false, tenantId: null })
                                }
                                className="rounded border px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Suspend Dialog */}
            {suspendDialog.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6">
                        <h2 className="mb-2 text-lg font-semibold text-blue-900">
                            Suspend Tenant
                        </h2>
                        <p className="mb-4 text-sm text-gray-600">
                            Please provide a reason for suspending this tenant.
                        </p>

                        <textarea
                            rows={3}
                            value={suspendDialog.reason}
                            onChange={(e) =>
                                setSuspendDialog({
                                    ...suspendDialog,
                                    reason: e.target.value,
                                })
                            }
                            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                            placeholder="Suspension reason"
                        />

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() =>
                                    setSuspendDialog({
                                        open: false,
                                        tenantId: null,
                                        reason: '',
                                    })
                                }
                                className="rounded border px-4 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSuspend}
                                className="rounded bg-yellow-600 px-4 py-2 font-semibold text-white hover:bg-yellow-700"
                            >
                                Suspend
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toasts */}
            {error && (
                <div className="fixed right-6 top-6 z-50 rounded-md bg-red-50 px-4 py-3 text-red-700 shadow">
                    <div className="flex items-center gap-3">
                        <span className="font-medium">{error}</span>
                        <button onClick={() => setError(null)}>✕</button>
                    </div>
                </div>
            )}

            {success && (
                <div className="fixed right-6 top-6 z-50 rounded-md bg-green-50 px-4 py-3 text-green-700 shadow">
                    <div className="flex items-center gap-3">
                        <span className="font-medium">{success}</span>
                        <button onClick={() => setSuccess(null)}>✕</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TenantList;
