require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { model } = require("mongoose");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
console.log(
  "========================================================kdfkmkldmfklmfkl===================="
);
console.log(
  process.env.CLOUD_NAME,
  process.env.CLOUDINARY_KEY,
  process.env.CLOUDINARY_SECRET
);

const Storages = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cloudinaryDemo",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

model.exports = {
  Storages,
};
