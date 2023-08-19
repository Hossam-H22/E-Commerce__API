import { roles } from "./../../middleware/auth.middleware.js";

export const endPoint = {
    get: [roles.User],
    create: [roles.User],
    cancel: [roles.User],
    adimnUpdateOrder: [roles.Admin],
}