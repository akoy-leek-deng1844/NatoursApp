/* eslint-disable prefer-arrow-callback */
const mongoose = require("mongoose");



const tourSchema = new mongoose.Schema(
  {
   name: {
    type: String,
    unique: true,
    required: [true, "A tour must have a name"],
    trim: true,
    minlength:[10, 'a tour name must not be less than 10 characters'],
    maxlength:[40, 'a tour name must not be more than 40 characters'],
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  priceDiscount: {
    type: Number,
    // validate: {
    //   validator: function (val) {
    //     return val < this.price
    //   },
    //   message: 'Discount ({VALUE}) must be less than the price'
    // }
  },
 
  maxGroupSize: {
    type: Number,
    required: [true, 'a tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'a tour must have difficulty level'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message:'You can only put easy, medium or difficult'
    }
  },
  duration: {
    type: Number,
    required: [true, 'a tour must have a duration']
  },
  ratingsAVerage: {
    type: Number,
    default: 4.5,
    min:[1, 'ratings must not be less than 1'],
    max:[5, 'ratings must not be more than 5'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  summary: {
    type: String,
    // trim: true,
    // required: [true, 'a tour must have a summary description']
  },
  secretTour: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    // trim: true
  },
  imageCover: {
    type: String,
    // required: [true, 'a tour must have an image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],

  });

const Tour = mongoose.model("Tour", tourSchema);
tourSchema.pre('save', function (next) {
  next();
})
tourSchema.post('save', function (docs, next) {
  next();
})

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } })
  this.start = Date.now()
  next();
})
tourSchema.post(/^find/, function (docs, next) {
  console.log(`this query took ${Date.now() - this.start} millseconds`)
  
  
  next();
})
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next()
})

module.exports = Tour;
