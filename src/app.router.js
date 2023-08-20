

import userRouter from "./modules/User/user.router.js"
import authRouter from "./modules/Auth/auth.router.js"
import categoryRouter from "./modules/Category/category.router.js"
import couponRouter from "./modules/Coupon/coupon.router.js"
import brandRouter from "./modules/Brand/brand.router.js"
import productRouter from "./modules/Product/product.router.js"
import cartRouter from "./modules/Cart/cart.router.js"
import orderRouter from "./modules/Order/order.router.js"
import connectDB from './../DB/connection.js';
import { globalErrorHandling } from "./utils/errorHandling.js";
import path from 'path'
import { fileURLToPath } from 'url'
import morgan from "morgan"
import cors from 'cors'

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const initApp = (app, express) => {

    // var whitelist = ['http://localhost:5000', ]; // allowed FE links to access backend
    // var corsOptions = {
    //     origin: function (origin, callback) {
    //         if (whitelist.indexOf(origin) !== -1) callback(null, true);
    //         else callback(new Error('Not allowed by CORS'));
    //     }
    // }
    // app.use(cors(corsOptions));
    app.use(cors({})); // allow acces from anyWare


    // to calculate request time
    if (process.env.MOOD == "DEV") {
        app.use(morgan("dev"));
    }
    else {
        app.use(morgan("common"));
    }


    // convert Buffer Data
    app.use((req, res, next) => {
        if(req.originalUrl == '/order/webhook') next();
        else express.json({})(req, res, next);
    });

    // Media Routing
    const fullPath = path.join(__dirname, './uploads')
    app.use("/uploads", express.static(fullPath));

    // App Routing
    app.get('/', (req, res) => res.status(200).json({ message: 'Welcomme to E-commerce App' }));
    app.use("/user", userRouter);
    app.use("/auth", authRouter);
    app.use("/category", categoryRouter);
    app.use("/coupon", couponRouter);
    app.use("/brand", brandRouter);
    app.use("/product", productRouter);
    app.use("/cart", cartRouter);
    app.use("/order", orderRouter);


    app.all("*", (req, res, next) => {
        return res.status(404).json({ message: "In-valid routing please check url" });
    });

    // Error handling middleware
    app.use(globalErrorHandling);

    // Connection DB
    connectDB();
}

export default initApp