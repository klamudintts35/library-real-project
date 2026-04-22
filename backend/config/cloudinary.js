// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

// export default cloudinary;


// import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

// console.log("cloudinary config key:", process.env.CLOUD_API_KEY);
// console.log("cloudinary config name:", process.env.CLOUD_NAME);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export default cloudinary;