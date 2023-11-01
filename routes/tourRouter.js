const express = require("express");
const {topToursAlias, getAllTours, getSingleTour, deleteTour, editTour, postTour, getTourStats, monthlyPlan } = require('../Controllers/tourHandler')

const router = express.Router();

router.route('/top-tours').get(topToursAlias, getAllTours)
router.route('/tours-stats').get(getTourStats)
router.route('/monthly-plans/:year').get(monthlyPlan)
router.route("/").get(getAllTours).post(postTour);
router.route("/:id").get(getSingleTour).patch(editTour).delete(deleteTour);

module.exports = router;

