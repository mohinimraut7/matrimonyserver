const User = require("../models/user");
const jwt = require("jsonwebtoken");



// ✅ REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    let {
      fullName,
      userName,
      firstName,
      lastName, 
      mobileNumber,
      email,
      password,
      lookingFor,
      role,
      departmentName,
      office,
      departmentCategory,
    } = req.body;

    // Trim & normalize
    fullName          = fullName?.trim();
    userName          = userName?.trim().toLowerCase();
    firstName         = firstName?.trim();
    lastName          = lastName?.trim();
    mobileNumber      = mobileNumber?.trim();
    email             = email?.trim().toLowerCase();
    lookingFor        = lookingFor?.trim();
    departmentName    = departmentName?.trim();
    office            = office?.trim();
    departmentCategory = departmentCategory?.trim();

    // Validation
    // if (!fullName || !userName || !mobileNumber || !email || !password) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "All fields required ❌",
    //   });
    // }

    // Mobile number format check (10 digits)
    if (!/^\d{10}$/.test(mobileNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number ❌ (10 digits required)",
      });
    }

    // Email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address ❌",
      });
    }

    // Check duplicate userName
    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(409).json({
        success: false,
        message: "Username already exists ❌",
      });
    }

    // Check duplicate email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already registered ❌",
      });
    }

    // Check duplicate mobile
    const existingMobile = await User.findOne({ mobileNumber });
    if (existingMobile) {
      return res.status(409).json({
        success: false,
        message: "Mobile number already registered ❌",
      });
    }

    // Create user
    const newUser = await User.create({
      fullName,
      userName,
      firstName,
      lastName,
      mobileNumber,
      email,
      password,
      lookingFor,
      role,
      departmentName,
      office,
      departmentCategory,
    });

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully ✅",
      user: {
        id:                newUser._id,
        fullName:          newUser.fullName,
        userName:          newUser.userName,
        firstName:         newUser.firstName,
        lastName:          newUser.lastName,
        mobileNumber:      newUser.mobileNumber,
        email:             newUser.email,
        lookingFor:        newUser.lookingFor,
        role:              newUser.role,
        departmentName:    newUser.departmentName,
        office:            newUser.office,
        departmentCategory: newUser.departmentCategory,
      },
    });

  } catch (error) {
    console.log("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error ❌",
    });
  }
};

// ✅ LOGIN USER
// exports.loginUser = async (req, res) => {
//   try {
//     const { userName, password } = req.body;

//     if (!userName || !password) {
//       return res.status(400).json({ success: false, message: "Username आणि Password required आहे ❌" });
//     }

//     const user = await User.findOne({ userName });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User Not Found ❌" });
//     }

//     if (user.password !== password) {
//       return res.status(401).json({ success: false, message: "Invalid Password ❌" });
//     }

//     const token = jwt.sign(
//       { id: user._id, userName: user.userName, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // ── office आणि departmentCategory पण return करा ──
//     return res.status(200).json({
//       success: true,
//       message: "Login Success ✅",
//       token,
//       user: {
//         id: user._id,
//         fullName: user.fullName,
//         userName: user.userName,
//         role: user.role,
//         departmentName: user.departmentName,
//         office: user.office,                         // ← ADD
//         departmentCategory: user.departmentCategory, // ← ADD
//       },
//     });

//   } catch (error) {
//     console.log("Login Error:", error);
//     return res.status(500).json({ success: false, message: "Server Error ❌" });
//   }
// };


exports.loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({
        success: false,
        message: "Username आणि Password required आहे ❌",
      });
    }

    const user = await User.findOne({ userName: userName.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found ❌",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password ❌",
      });
    }

    const token = jwt.sign(
      { id: user._id, userName: user.userName, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login Success ✅",
      token,
      user: {
        id:                 user._id,
        fullName:           user.fullName,
        userName:           user.userName,
        role:               user.role,
        departmentName:     user.departmentName,
        office:             user.office,
        departmentCategory: user.departmentCategory,
      },
    });

  } catch (error) {
    console.log("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error ❌",
    });
  }
};


// 📁 userController.js मध्ये loginByMobile हे replace करा

exports.loginByMobile = async (req, res) => {
  try {
    const { mobileNo } = req.body;

    console.log("📱 loginByMobile called:", mobileNo);

    if (!mobileNo) {
      return res.status(400).json({ success: false, message: "Mobile number required ❌" });
    }

    const trimmed = mobileNo.toString().trim();

    // mobileNumber OR mobileno — दोन्ही try करतो
    let user = await User.findOne({
      $or: [
        { mobileNumber: trimmed },
        { mobileno: trimmed },
        { mobile: trimmed },
        { phone: trimmed },
      ]
    });

    console.log("🔍 User found:", user ? user.userName : "NOT FOUND");

    // ✅ User नसला तर auto-register करतो
    if (!user) {
      console.log("🆕 User not found — auto registering:", trimmed);

      user = await User.create({
        mobileNumber: trimmed,
        mobileno: trimmed,
        mobile: trimmed,
        userName: `user_${trimmed.slice(-4)}`,   // शेवटचे 4 digits username
        fullName: `User ${trimmed.slice(-4)}`,
        role: "User",
        departmentName: "",
        office: "",
        departmentCategory: "",
      });

      console.log("✅ Auto-registered user:", user.userName);
    }

    const token = jwt.sign(
      { id: user._id, userName: user.userName, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "OTP Login Success ✅",
      token,
      user: {
        id:                 user._id,
        fullName:           user.fullName,
        userName:           user.userName,
        role:               user.role,
        departmentName:     user.departmentName,
        office:             user.office,
        departmentCategory: user.departmentCategory,
      },
    });

  } catch (error) {
    console.log("LoginByMobile Error:", error);
    return res.status(500).json({ success: false, message: "Server Error ❌" });
  }
};

// ✅ UPDATE USER
// exports.updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatePayload = req.body;

//     if (!updatePayload || Object.keys(updatePayload).length === 0) {
//       return res.status(400).json({ success: false, message: "Update data required ❌" });
//     }

//     // Never allow password update from this route
//     delete updatePayload.password;

//     // Trim & normalize
//     if (updatePayload.fullName)     updatePayload.fullName     = updatePayload.fullName.trim();
//     if (updatePayload.userName)     updatePayload.userName     = updatePayload.userName.trim().toLowerCase();
//     if (updatePayload.mobileNumber) updatePayload.mobileNumber = updatePayload.mobileNumber.trim();
//     if (updatePayload.email)        updatePayload.email        = updatePayload.email.trim().toLowerCase();

//     // Mobile format check
//     if (updatePayload.mobileNumber && !/^\d{10}$/.test(updatePayload.mobileNumber)) {
//       return res.status(400).json({ success: false, message: "Invalid mobile number ❌ (10 digits required)" });
//     }

//     // Email format check
//     if (updatePayload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatePayload.email)) {
//       return res.status(400).json({ success: false, message: "Invalid email address ❌" });
//     }

//     // Check duplicate userName
//     if (updatePayload.userName) {
//       const existing = await User.findOne({ userName: updatePayload.userName, _id: { $ne: id } });
//       if (existing) {
//         return res.status(409).json({ success: false, message: "Username already taken ❌" });
//       }
//     }

//     // Check duplicate email
//     if (updatePayload.email) {
//       const existing = await User.findOne({ email: updatePayload.email, _id: { $ne: id } });
//       if (existing) {
//         return res.status(409).json({ success: false, message: "Email already registered ❌" });
//       }
//     }

//     // Check duplicate mobileNumber
//     if (updatePayload.mobileNumber) {
//       const existing = await User.findOne({ mobileNumber: updatePayload.mobileNumber, _id: { $ne: id } });
//       if (existing) {
//         return res.status(409).json({ success: false, message: "Mobile number already registered ❌" });
//       }
//     }

//     const user = await User.findByIdAndUpdate(id, updatePayload, {
//       new: true, runValidators: true,
//     }).select("-password");

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User Not Found ❌" });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "User Updated Successfully ✅",
//       user,
//     });

//   } catch (error) {
//     console.log("Update Error:", error);
//     return res.status(500).json({ success: false, message: "Server Error ❌" });
//   }
// };


// ✅ GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully ✅",
      count: users.length,
      users,
    });
  } catch (error) {
    console.log("Get Users Error:", error);
    return res.status(500).json({ success: false, message: "Server Error ❌" });
  }
};


// ✅ DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User Not Found ❌" });
    }

    return res.status(200).json({
      success: true,
      message: "User Deleted Successfully ✅",
      deletedUser: {
        id:           user._id,
        fullName:     user.fullName,
        userName:     user.userName,
        mobileNumber: user.mobileNumber,
        email:        user.email,
      },
    });

  } catch (error) {
    console.log("Delete Error:", error);
    return res.status(500).json({ success: false, message: "Server Error ❌" });
  }
};



// ✅ SAVE / UPDATE PROFILE

// ✅ SAVE PROFILE (with photo upload)
exports.saveProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profileFields = {
      // Step 1
      dob:           req.body.dob,
      gender:        req.body.gender,
      maritalStatus: req.body.maritalStatus,
      profileFor:    req.body.profileFor,
      height:        req.body.height,
      weight:        req.body.weight,
      bodyType:      req.body.bodyType,
      complexion:    req.body.complexion,
      mobile:        req.body.mobile,
      about:         req.body.about,
      // Step 2
      motherTongue:  req.body.motherTongue,
      nationality:   req.body.nationality,
      country:       req.body.country,
      currentState:  req.body.currentState,
      currentCity:   req.body.currentCity,
      birthCity:     req.body.birthCity,
      birthTime:     req.body.birthTime,
      rashi:         req.body.rashi,
      nakshatra:     req.body.nakshatra,
      gotra:         req.body.gotra,
      manglik:       req.body.manglik,
      // Step 3
      religion:          req.body.religion,
      caste:             req.body.caste,
      subCaste:          req.body.subCaste,
      casteNoBar:        req.body.casteNoBar,
      religiousPractice: req.body.religiousPractice,
      community:         req.body.community,
      // Step 4
      fatherName:       req.body.fatherName,
      fatherOccupation: req.body.fatherOccupation,
      motherName:       req.body.motherName,
      motherOccupation: req.body.motherOccupation,
      brothers:         req.body.brothers,
      brothersMarried:  req.body.brothersMarried,
      sisters:          req.body.sisters,
      sistersMarried:   req.body.sistersMarried,
      familyType:       req.body.familyType,
      familyValues:     req.body.familyValues,
      familyStatus:     req.body.familyStatus,
      familyLocation:   req.body.familyLocation,
      // Step 5
      education:      req.body.education,
      fieldOfStudy:   req.body.fieldOfStudy,
      college:        req.body.college,
      employmentType: req.body.employmentType,
      occupation:     req.body.occupation,
      company:        req.body.company,
      income:         req.body.income,
      workLocation:   req.body.workLocation,
      // Step 6
      diet:      req.body.diet,
      smoking:   req.body.smoking,
      drinking:  req.body.drinking,
      fitness:   req.body.fitness,
      languages: req.body.languages ? JSON.parse(req.body.languages) : [],
      hobbies:   req.body.hobbies   ? JSON.parse(req.body.hobbies)   : [],
      vehicle:   req.body.vehicle,
      property:  req.body.property,
      // Step 7
      partnerAgeMin:        req.body.partnerAgeMin,
      partnerAgeMax:        req.body.partnerAgeMax,
      partnerHeightMin:     req.body.partnerHeightMin,
      partnerHeightMax:     req.body.partnerHeightMax,
      partnerMaritalStatus: req.body.partnerMaritalStatus,
      partnerReligion:      req.body.partnerReligion,
      partnerCaste:         req.body.partnerCaste,
      partnerEducation:     req.body.partnerEducation,
      partnerIncome:        req.body.partnerIncome,
      partnerLocation:      req.body.partnerLocation,
      partnerDiet:          req.body.partnerDiet,
      partnerManglik:       req.body.partnerManglik,
      partnerDesc:          req.body.partnerDesc,
    };

    // ✅ Step 8 — Photo Cloudinary वर upload झाली असेल तर URL save करा
    if (req.file) {
      profileFields.photos   = [req.file.path]; // Cloudinary URL
      profileFields.verified = false;
    }

    // undefined values काढा
    Object.keys(profileFields).forEach(
      key => profileFields[key] === undefined && delete profileFields[key]
    );

    const user = await User.findByIdAndUpdate(
      id,
      { $set: profileFields },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User Not Found ❌" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile Saved Successfully ✅",
      user,
    });

  } catch (error) {
    console.log("Save Profile Error:", error);
    return res.status(500).json({ success: false, message: "Server Error ❌" });
  }
};

// ✅ GET PROFILE BY ID
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found ❌",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully ✅",
      user,
    });

  } catch (error) {
    console.log("Get Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error ❌",
    });
  }
};

