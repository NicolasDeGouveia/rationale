import "server-only";
import { db } from "@/server/db";

export async function getUserById(id: string) {
  return db.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({ where: { email } });
}

export async function updateUserStripeCustomerId(userId: string, stripeCustomerId: string) {
  return db.user.update({
    where: { id: userId },
    data: { stripeCustomerId },
  });
}
