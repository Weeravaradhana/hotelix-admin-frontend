// ==============================
// Subscription Plan
// ==============================
export const SubscriptionPlan = {
    FREE: 'FREE',
    PRO: 'PRO',
    ENTERPRISE: 'ENTERPRISE',
} as const;

export type SubscriptionPlan =
    typeof SubscriptionPlan[keyof typeof SubscriptionPlan];

export const TenantStatus = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    DELETED: 'DELETED',
} as const;

export type TenantStatus =
    typeof TenantStatus[keyof typeof TenantStatus];


export interface Tenant {
    tenantId: string;
    hotelName: string;
    email: string;
    phoneNumber: string;
    address: string;
    subscriptionPlan: SubscriptionPlan;
    status: TenantStatus;
    metadata?: string;
    createdAt: string;
    updatedAt: string;
}


export interface CreateTenantRequest {
    hotelName: string;
    email: string;
    phoneNumber: string;
    address: string;
    subscriptionPlan: SubscriptionPlan;
    metadata?: string;
}

export interface UpdateTenantRequest {
    hotelName?: string;
    phoneNumber?: string;
    address?: string;
    metadata?: string;
}

export interface UpdateSubscriptionRequest {
    subscriptionPlan: SubscriptionPlan;
}

export interface SuspendTenantRequest {
    reason: string;
}
