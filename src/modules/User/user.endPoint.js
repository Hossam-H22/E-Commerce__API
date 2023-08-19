import { roles } from "./../../middleware/auth.middleware.js";

export const endPoint = {
    all: Object.values(roles),
    admin: roles.Admin,
    users: [roles.User, roles.Seller],
}