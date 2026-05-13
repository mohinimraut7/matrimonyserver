
const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.mimetype === "application/pdf") {
      return {
        folder: "matrimony/applications",
        resource_type: "raw",
        access_mode: "public",
        public_id:
          "revenue_pdf_" +
          Date.now() +
          "_" +
          Math.round(Math.random() * 1e9),
      };
    }
    return {
      folder: "matrimony/applications",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id:
        "revenue_img_" +
        Date.now() +
        "_" +
        Math.round(Math.random() * 1e9),
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowedPDF = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  const allowedExcel = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ];

  if (file.fieldname === "attachment" && allowedPDF.includes(file.mimetype)) {
    cb(null, true);
  } else if (
    file.fieldname === "excelFile" &&
    allowedExcel.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type ❌`), false);
  }
};

const uploadBoth = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const handleUploadBoth = (req, res, next) => {
  uploadBoth.fields([
    { name: "attachment", maxCount: 1 },
    { name: "excelFile", maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed ❌",
      });
    }

    // =============================
    // ✅ EXCEL UPLOAD TO CLOUDINARY
    // =============================

    if (req.files?.excelFile?.[0]) {
      try {
        const file = req.files.excelFile[0];

        await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "matrimony/applications",
              resource_type: "raw", // Excel must be raw
              use_filename: true,   // keep original filename
              unique_filename: false,
              access_mode: "public",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                req.files.excelFile[0].secure_url = result.secure_url;
                resolve(result);
              }
            }
          );

          stream.end(file.buffer);
        });
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Excel upload failed ❌",
        });
      }
    }

    // =============================
    // ✅ ATTACHMENT UPLOAD (UNCHANGED)
    // =============================

    if (req.files?.attachment?.[0]) {
      try {
        const file = req.files.attachment[0];
        return new Promise((resolve) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "matrimony/applications",
              resource_type:
                file.mimetype === "application/pdf" ? "raw" : "image",
              access_mode: "public",
            },
            (error, result) => {
              if (error) {
                return res.status(400).json({
                  success: false,
                  message: "Cloudinary upload failed ❌",
                });
              }
              req.files.attachment[0].secure_url = result.secure_url;
              next();
              resolve();
            }
          );
          stream.end(file.buffer);
        });
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
    } else {
      next();
    }
  });
};

module.exports = { handleUploadBoth };


