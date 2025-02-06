const express = require("express");
const app = express();
const PORT = 8521;
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());
app.use('/uploads', express.static('uploads'));

// ------------------- Import Controller ------------------- //

const authController = require("./Controllers/authController");
const bannerController = require("./Controllers/bannerController");
const serviceController = require("./Controllers/serviceController");
const balanceController = require("./Controllers/balanceController");
const transactionController = require("./Controllers/transactionController");
const middlewares = require("./Middlewares/auth");

// ------------------- End Import Controller ------------------- //

// ------------------- Define Routes Auth ------------------- //

app.post("/registration", authController.handleRegister);
app.post("/login", authController.handleLogin);

// Profile Routes
app.get("/profile", middlewares.authenticate, authController.getProfile);
app.put("/profile/update", middlewares.authenticate, authController.updateProfile);
app.put("/profile/image", middlewares.authenticate, upload.single("profile_image"), authController.updateProfileImage);

// Banner Routes
app.get("/banner", middlewares.authenticate, bannerController.getBanners);

// Service Routes
app.get("/services", middlewares.authenticate, serviceController.getServices);

// Balance Routes
app.get("/balance", middlewares.authenticate, balanceController.getBalance);

// Transaction Routes
app.get("/transaction/history", middlewares.authenticate, transactionController.getTransactionHistory);
app.post("/transaction", middlewares.authenticate, transactionController.transaction);
app.post("/topup", middlewares.authenticate, transactionController.topup);

// ------------------- End Routes Auth ------------------- //


// ------------------- Listen Server ------------------- //

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// ------------------- End Listen Server ------------------- //