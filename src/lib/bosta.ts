/**
 * Bosta Shipping Integration Service
 * Official Bosta API v2 integration for Giftisan
 */

const BOSTA_BASE_URL = process.env.BOSTA_BASE_URL || "https://api.bosta.co/api/v2";
const BOSTA_API_KEY = process.env.BOSTA_API_KEY || "";

export interface BostaAddress {
  firstLine: string;
  city?: string;
  district?: string;
  zone?: string;
  buildingNumber?: string;
  floor?: string;
  apartment?: string;
}

export interface BostaReceiver {
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
}

export interface CreateDeliveryParams {
  type?: number; // 10: Standard Delivery, 20: Exchange, 30: CRP (Customer Return Pickup)
  cod?: number; // Cash on Delivery amount in EGP (0 for prepaid)
  businessReference: string; // Giftisan Order ID or Item ID
  receiver: BostaReceiver;
  dropOffAddress: BostaAddress;
  pickupAddress?: BostaAddress;
  notes?: string;
  itemsCount?: number;
  description?: string;
}

/**
 * Creates a shipping delivery order on Bosta
 */
export async function createBostaDelivery(params: CreateDeliveryParams) {
  if (!BOSTA_API_KEY) {
    throw new Error("BOSTA_API_KEY is not configured in environment variables.");
  }

  const payload = {
    type: params.type || 10,
    cod: params.cod ?? 0,
    businessReference: params.businessReference,
    receiver: {
      firstName: params.receiver.firstName || "Customer",
      lastName: params.receiver.lastName || "",
      phone: params.receiver.phone,
      email: params.receiver.email || undefined,
    },
    dropOffAddress: {
      firstLine: params.dropOffAddress.firstLine,
      city: params.dropOffAddress.city || "Cairo",
      district: params.dropOffAddress.district,
      buildingNumber: params.dropOffAddress.buildingNumber,
      floor: params.dropOffAddress.floor,
      apartment: params.dropOffAddress.apartment,
    },
    ...(params.pickupAddress && {
      pickupAddress: {
        firstLine: params.pickupAddress.firstLine,
        city: params.pickupAddress.city,
        district: params.pickupAddress.district,
      },
    }),
    specs: {
      packageType: "Parcel",
      packageDetails: {
        itemsCount: params.itemsCount || 1,
        description: params.description || "Giftisan Handmade Items",
      },
    },
    notes: params.notes || "",
  };

  const response = await fetch(`${BOSTA_BASE_URL}/deliveries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: BOSTA_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("[Bosta Create Delivery Error]:", data);
    throw new Error(data.message || data.error || "Failed to create delivery in Bosta");
  }

  return {
    deliveryId: data.data?._id || data._id,
    trackingNumber: data.data?.trackingNumber || data.trackingNumber,
    state: data.data?.state || data.state,
    raw: data,
  };
}

/**
 * Fetch delivery tracking status by trackingNumber or deliveryId
 */
export async function getBostaTracking(trackingNumber: string) {
  const response = await fetch(`${BOSTA_BASE_URL}/deliveries/${trackingNumber}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(BOSTA_API_KEY && { Authorization: BOSTA_API_KEY }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tracking info from Bosta: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch Airway Bill (AWB) printable label URL / Base64 PDF
 */
export async function getBostaAWB(deliveryId: string) {
  if (!BOSTA_API_KEY) {
    throw new Error("BOSTA_API_KEY is not configured.");
  }

  const response = await fetch(`${BOSTA_BASE_URL}/deliveries/awb/${deliveryId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: BOSTA_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch AWB from Bosta");
  }

  return response.json();
}

/**
 * Request courier pickup from an artisan or central warehouse
 */
export async function createBostaPickupRequest(params: {
  scheduledDate: string; // YYYY-MM-DD
  scheduledTimeSlot?: string; // "10:00 to 13:00" or "13:00 to 16:00"
  pickupAddress: BostaAddress;
  contactPerson: { name: string; phone: string; email?: string };
  packageCount: number;
  notes?: string;
}) {
  if (!BOSTA_API_KEY) {
    throw new Error("BOSTA_API_KEY is not configured.");
  }

  const payload = {
    scheduledDate: params.scheduledDate,
    scheduledTimeSlot: params.scheduledTimeSlot || "10:00 to 16:00",
    pickupAddress: params.pickupAddress,
    contactPerson: params.contactPerson,
    packageCount: params.packageCount,
    notes: params.notes,
  };

  const response = await fetch(`${BOSTA_BASE_URL}/pickups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: BOSTA_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}
