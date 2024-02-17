const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Save URL Where user was supposed to Redirect before Login
    req.session.redirectURL = req.originalUrl;

    req.flash("error", "You must be Logged In !");
    return res.redirect("/login");
  }
  next();
};

// Passport Clears the info stored in Session after redireting to route
// Hence We are saving it in res.locals
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectURL) {
    res.locals.redirectURL = req.session.redirectURL;
  }

  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  // Authorization
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Listing validate middleware
module.exports.validateListing = (req, res, next) => {
    const result = listingSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, result.error);
    } else {
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    const result = reviewSchema.validate(req.body);
    if(result.error){
        //let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,result.error);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);

    if(! review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You did not created this review!");
        return res.redirect(`/listings/${id}`); 
    }
    next();
}