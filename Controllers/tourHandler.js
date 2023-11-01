const Tour = require("../models/tourmodel");
const APIfeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.topToursAlias = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAVerage,price';
  req.query.fields = 'name,summary,price,ratingsAVerage,duration,ratingsQuantity';
  next()
}


exports.getAllTours = catchAsync(async (req, res, next) => {
  
    // FIRST APPROACH..
    // const queryObj = { ...req.query };
    // const excludedSorts = ['sort', 'page', 'limit', 'fields'];
    // excludedSorts.forEach(el => delete queryObj[el]);
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
   
    // let query = Tour.find(JSON.parse(queryStr));
   
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');

    //   query = query.sort(sortBy)
    // } else {
    //   query.sort('-createdAt')
    // }
 
    // if (req.query.fields) {
    //   const sortBy = req.query.fields.split(',').join(' ');
    //   query = query.select(sortBy)
    // } else {
    //   query.select('-__v')
    // }

    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 20;
    // const skip = (page - 1) * limit;
    
    // query = query.skip(skip).limit(limit);
    // if (req.query.page) {
    //   const numDocs = await Tour.countDocuments();
    //   if(skip>= numDocs) throw new Error('nO MORE DOCS')
    // }

    // EXECUTE QUERY
const features = new APIfeatures(Tour.find(), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();
const tours = await features.query;

res.status(200).json({
  status: "success",
  results: tours.length,
  data: { tours },
});
 
});

exports.getSingleTour = catchAsync(async (req, res, next) => {
  const singleTour = await Tour.findById(req.params.id);
  if (!singleTour) {
    return next(new AppError('This tour does not exist', 404))
  }
  res.status(200).json({
    status: "success",
    data: { singleTour },
  });
});
exports.editTour = catchAsync(async (req, res, next) => {
  const singleTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!singleTour) {
    return next(new AppError("This tour does not exist", 404));
  }
  res.status(200).json({
    status: "success",
    data: { singleTour },
  });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  const singleTour = await Tour.findByIdAndDelete(req.params.id);
  if (!singleTour) {
    return next(new AppError("This tour does not exist", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});



exports.postTour = catchAsync( async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  console.log(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAVerage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: "$difficulty",
        numRatings: { $sum: "$ratingsQuantity" },
        numTours: { $sum: 1 },
        avgRating: { $avg: "$ratingsAVerage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      data: stats,
    },
  });
})
exports.monthlyPlan = catchAsync(async (req, res, next) => {
 const year = req.params.year * 1;
 const monthlyPlans = await Tour.aggregate([
   {
     $unwind: "$startDates",
   },
   {
     $match: {
       startDates: {
         $gte: new Date(`${year}-01-01`),
         $lte: new Date(`${year}-12-31`),
       },
     },
   },
   {
     $group: {
       _id: { $month: "$startDates" },
       numTours: { $sum: 1 },
       tours: { $push: "$name" },
     },
   },

   {
     $addFields: {
       month: "$_id",
     },
   },
   {
     $project: {
       _id: 0,
     },
   },
 ]);
 res.status(200).json({
   status: "success",
   data: {
     data: monthlyPlans,
   },
 });
})
