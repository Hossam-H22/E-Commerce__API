
import { roles } from "./../../middleware/auth.middleware.js";

export const endPoint = {
    get: Object.values(roles),
    create: [roles.Seller],
    update: [roles.Admin, roles.Seller],
    wishlist: [roles.User],
}