var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'home';
	locals.filters = {
		category: req.params.category,
	};
	locals.data = {
		posts: [],
		categories: [],
		columnadeldia: {}
	};

	// Load all categories
	view.on('init', function (next) {
		console.log("click");
		keystone.list('PostCategory').model.find().sort('name').exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.categories = results;

			// Load the counts for each category
			async.each(locals.data.categories, function (category, next) {

				keystone.list('Post').model.count().where('categories').in([category.id]).exec(function (err, count) {
					category.postCount = count;
					next(err);
				});

			}, function (err) {
				next(err);
			});
		});
	});

	// Load the current category filter
	view.on('init', function (next) {

		if (req.params.category) {
			keystone.list('PostCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
				locals.data.category = result;
				next(err);
			});
		} else {
			next();
		}
	});
	// Load columna del dia
	view.on('init', function (next) {

		
		var q = keystone.list('Post').model.find()
			.where('categories','5891190f9095f7e2092d2066')
			.where('state','published')
			.sort('-publishedDate')
			.limit(1)
			.populate('author categories');
		
		q.exec(function (err, results) {
			// console.log('______del dia_________');
			// console.log(results);
			// console.log('______+++++++_________');
			locals.data.columnadeldia = results;
			next(err);
		});
	});
	// Load the posts
	view.on('init', function (next) {

		var q = keystone.list('Post').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10,
			filters: {
				state: 'published',
			},
		})
			.sort('-publishedDate')
			.populate('author categories');

		if (locals.data.category) {
			q.where('categories').in([locals.data.category]);
		}

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	});

	// Render the view
	view.render('index');
};
