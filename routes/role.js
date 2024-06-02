const express = require("express");
const isAuth = require("../middleware/employee");
const roleController = require("../controllers/role");

const router = express.Router();

router.post("/add", isAuth, roleController.addRole);
router.get("/show", roleController.showRole);

module.exports = router;
