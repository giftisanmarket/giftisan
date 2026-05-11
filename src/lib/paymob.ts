export const PAYMOB_PUBLIC_KEY = process.env.PAYMOB_PUBLIC_KEY || "";
export const PAYMOB_SECRET_KEY = process.env.PAYMOB_SECRET_KEY || "";
export const PAYMOB_HMAC = process.env.PAYMOB_HMAC || "";
export const PAYMOB_INTEGRATION_IDS = process.env.PAYMOB_INTEGRATION_IDS ? process.env.PAYMOB_INTEGRATION_IDS.split(",") : [];

export async function createPaymobIntention(amountCents: number, orderId: string, billingData: any, items: any[]) {
  const response = await fetch("https://accept.paymob.com/v1/intention/", {
    method: "POST",
    headers: {
      "Authorization": `Token ${PAYMOB_SECRET_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: amountCents,
      currency: "EGP",
      payment_methods: PAYMOB_INTEGRATION_IDS.map(id => parseInt(id.trim())), // This is where we pass the integration IDs
      items: items.map(item => ({
        name: item.name || "Item",
        amount: item.amount_cents || item.price * 100, // Intention API usually expects amount in cents for items too
        description: item.description || "Giftisan Product",
        quantity: item.quantity
      })),
      billing_data: {
        first_name: billingData.firstName || "NA",
        last_name: billingData.lastName || "NA",
        email: billingData.email || "test@test.com",
        phone_number: billingData.phone || "+201234567890",
        street: billingData.address || "NA",
        city: billingData.city || "NA",
        country: billingData.country || "EG",
        floor: "NA",
        building: "NA",
        apartment: "NA"
      },
      special_reference: orderId
    })
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("Paymob Intention API Error:", data);
    throw new Error(data.message || "Paymob intention creation failed");
  }

  // Returns the client secret needed for Unified Checkout
  return data.client_secret;
}
