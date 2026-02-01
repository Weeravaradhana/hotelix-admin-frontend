import { apiClient } from './axios';
import type {
    CreateTenantRequest,
    SuspendTenantRequest,
    Tenant,
    TenantStatus, UpdateSubscriptionRequest,
    UpdateTenantRequest
} from "../modules/tenant.model.ts";
import type {Page} from "../modules/page.model.ts";


const BASE_PATH = '/api/tenants';
export const tenantApi = {
    createTenant: async (data:CreateTenantRequest): Promise<Tenant> => {
        const response = await apiClient.post<Tenant>(BASE_PATH, data);
        return  response.data;
    },


    getTenantById: async (tenantId: string): Promise<Tenant> => {
        const response = await apiClient.get<Tenant>(`${BASE_PATH}/${tenantId}`);
        return response.data;
    },

    getAllTenants: async (page: number = 0 , size : number = 20): Promise<Page<Tenant>> => {
        const response = await apiClient.get<Page<Tenant>>(BASE_PATH, {
            params: {page, size},
        });
        console.log("response", response.data.content);
        return response.data;
    },

    getTenantByStatus: async (status: TenantStatus , page: number = 0 , size : number = 20): Promise<Page<Tenant>> => {
        console.log("status", status);
        const response = await apiClient.get<Page<Tenant>>(`${BASE_PATH}/status/${status}`, {
            params: {page, size},
        });
        console.log("response", response.data.content);
        return response.data;
    },

    updateTenant: async (tenantId: string, data: UpdateTenantRequest): Promise<Tenant> => {
        const response = await apiClient.put<Tenant>(`${BASE_PATH}/${tenantId}`, data);
        return response.data;
    },

    updateSubscription: async (
        tenantId: string,
        data: UpdateSubscriptionRequest
    ): Promise<Tenant> => {
        const response = await apiClient.patch<Tenant>(
            `${BASE_PATH}/${tenantId}/subscription`,
            data
        );
        return response.data;
    },

    suspendTenant: async (tenantId: string, data: SuspendTenantRequest): Promise<Tenant> => {
        const response = await apiClient.patch<Tenant>(`${BASE_PATH}/${tenantId}/suspend`, data);
        return response.data;
    },

    activateTenant: async (tenantId: string): Promise<Tenant> => {
        const response = await apiClient.patch<Tenant>(`${BASE_PATH}/${tenantId}/activate`);
        return response.data;
    },

    deleteTenant: async (tenantId: string): Promise<void> => {
        await apiClient.delete(`${BASE_PATH}/${tenantId}`);
    },
}