const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

// All Listing Related Callbacks (used in routes/listing.js)

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const currentListing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!currentListing) {
    req.flash("error", "Listing You requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { currentListing });
};

module.exports.createListing = async (req, res) => {
  let listing = req.body.listing;
  const newListing = new Listing(listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const currentListing = await Listing.findById(id);
  if (!currentListing) {
    req.flash("error", "Listing You requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { currentListing });
};

module.exports.editListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
