var keystone = require('keystone'),
	Enquiry = keystone.list('Mark');

exports = module.exports = function(req, res) {

	

	var view = new keystone.View(req, res),
		locals = res.locals;

	locals.data = {
		posts: [],
		categories: []
	};
	// Set locals
	locals.section = 'marking';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	
	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'marking' }, function(next) {
		
		var newEnquiry = new Enquiry.model(),
			updater = newEnquiry.getUpdateHandler(req);
		
		// reset changes
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name,stuid,markingto,score,reason',
			errorMessage: 'There was a problem submitting your mark:'
		}, function(err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});
		
	});


	// Load the posts
	view.on('init', function(next) {
		
		var q = keystone.list('Post').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author categories');
			
		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});
		
	});

	
	if (!req.user) {

		req.flash('error', 'Please sign in to access marking page.');
		res.redirect('/');
	} else if(!req.user.canAccessKeystone){
		req.flash('error', 'No Access Permissions!!');
		res.redirect('/');		
	}else{
		view.render('marking');
	}
};
