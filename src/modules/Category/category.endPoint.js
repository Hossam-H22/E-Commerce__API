import { roles } from "./../../middleware/auth.middleware.js";

export const endPoint = {
    get: Object.values(roles),
    create: [roles.Admin],
    update: [roles.Admin],
}