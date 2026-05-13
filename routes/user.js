const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadProfilePhoto");

const {
  registerUser,
  loginUser,
  loginByMobile,
  updateUser,
  getUsers,
  deleteUser,
  saveProfile, getProfile
} = require("../controllers/user");

// ✅ Register
router.post("/register", registerUser);

// ✅ Login
router.post("/login", loginUser);
router.post("/loginByMobile",loginByMobile);



// ✅ Update user by id
// router.patch("/users/:id", updateUser);

router.get("/getUsers", getUsers);

router.delete("/deleteUser/:id",deleteUser);

router.patch("/users/:id/profile", upload.single("photo"), saveProfile);

router.get("/users/:id/profile",   getProfile);  // Get profile


module.exports = router;
