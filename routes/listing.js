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

// All /listings related routes

// index route
router.get("/", wrapAsync(index));

// New and Create Route for Listing
// New ---> GET request at /listings/new to collect Form data
// Create ---> POST request at /listings to add form data to database
router.get("/new", isLoggedIn, renderNewForm);
router.post("/", isLoggedIn, validateListing, wrapAsync(createListing));

//Edit and Update Route For Listing
// Edit ---> GET request at /listings/:id/edit from show.ejs to render edit form
// Update ---> PUT request at /listings/:id to Update Database
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(editListing)
);

// Delete Route for Listing --> DELETE request at /listings/:id From show.ejs
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteListing));

// Show route( GET request at /listings/:id FROM views/listings/index.ejs )
router.get("/:id", wrapAsync(showListing));

module.exports = router;
