const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  deleteListing,
  editListing,
} = require("../controllers/listing.js");

// Middleware for handling multipart/form-data,
// which is primarily used for uploading files.
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// All /listings related routes

// index route (GET "/")
// Create ---> POST request at /listings to add form data to database
router
  .route("/")
  .get(wrapAsync(index))
  .post(isLoggedIn,  upload.single("listing[image]"),validateListing,wrapAsync(createListing));  
  

// New ---> GET request at /listings/new to collect Form data
router.get("/new", isLoggedIn, renderNewForm);

// Update ---> PUT request at /listings/:id to Update Database
// Delete Route for Listing --> DELETE request at /listings/:id From show.ejs
// Show route( GET request at /listings/:id FROM views/listings/index.ejs )
router
  .route("/:id")
  .put(isLoggedIn, isOwner,  upload.single("listing[image]"),validateListing, wrapAsync(editListing))
  .delete(isLoggedIn, isOwner, wrapAsync(deleteListing))
  .get(wrapAsync(showListing));

//Edit and Update Route For Listing
// Edit ---> GET request at /listings/:id/edit from show.ejs to render edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

module.exports = router;
