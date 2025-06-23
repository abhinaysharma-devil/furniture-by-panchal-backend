import { db } from "../../drizzle.config.js";
import * as schema from "../../shared/schema.js";
import { eq, and, desc, inArray } from 'drizzle-orm';

const orderDao = {

    getOrderById: (payload) => {
        return new Promise((resolve, reject) => {
            const data = db.select()
                .from(schema.orders)
                .where(eq(schema.orders.id, payload.orderId));

            if (data) {
                resolve(data);
            } else {
                reject([]);
            }
        })
    },

    updateOrderStatusById: (payload) => {
        return new Promise((resolve, reject) => {
            const data = db.update(schema.orders)
                .set({ status: payload.status })
                .where(eq(schema.orders.id, payload.orderId))
                // .returning(true)

            if (data) {
                resolve(data);
            } else {
                reject([]);
            }
        })
    }

}

export { orderDao }