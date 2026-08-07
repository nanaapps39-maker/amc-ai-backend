import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const subscribersFile = path.join(__dirname, "subscribers.json");

// Ensure subscribers.json exists
if (!fs.existsSync(subscribersFile)) {
  fs.writeFileSync(subscribersFile, JSON.stringify([]));
}

function loadSubscribers() {
  const raw = fs.readFileSync(subscribersFile, "utf8");
  return JSON.parse(raw);
}

function saveSubscribers(subscribers) {
  fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2));
}

function upsertSubscriber(record) {
  const subscribers = loadSubscribers();

  const index = subscribers.findIndex(
    (s) => s.subscriptionId === record.subscriptionId
  );

  if (index === -1) {
    subscribers.push(record);
  } else {
    subscribers[index] = { ...subscribers[index], ...record };
  }

  saveSubscribers(subscribers);
}

export function handleStripeEvent(event) {
  const type = event.type;
  const data = event.data.object;

  // Handle subscription lifecycle
  if (
    type === "customer.subscription.created" ||
    type === "customer.subscription.updated"
  ) {
    const record = {
      subscriptionId: data.id,
      customerId: data.customer,
      status: data.status,
      planId: data.items?.data[0]?.plan?.id || null,
      currentPeriodStart: new Date(
        data.current_period_start * 1000
      ).toISOString(),
      currentPeriodEnd: new Date(
        data.current_period_end * 1000
      ).toISOString(),
      cancelAtPeriodEnd: data.cancel_at_period_end || false,
      canceledAt: data.canceled_at
        ? new Date(data.canceled_at * 1000).toISOString()
        : null,
      updatedAt: new Date().toISOString()
    };

    upsertSubscriber(record);
  }

  // Handle subscription deletion
  if (type === "customer.subscription.deleted") {
    const record = {
      subscriptionId: data.id,
      customerId: data.customer,
      status: data.status,
      canceledAt: data.canceled_at
        ? new Date(data.canceled_at * 1000).toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    upsertSubscriber(record);
  }

  // Handle checkout completion
  if (type === "checkout.session.completed") {
    const record = {
      subscriptionId: data.subscription,
      customerId: data.customer,
      email: data.customer_details?.email || null,
      mode: data.mode,
      createdAt: new Date().toISOString()
    };

    upsertSubscriber(record);
  }
}

export { loadSubscribers };


