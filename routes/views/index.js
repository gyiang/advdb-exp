var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	// Init locals
	locals.section = 'home';
	locals.data = {
		posts: []
	};

	if(req.user){
		// Load the posts
		view.on('init', function(next) {
			
			var q = keystone.list('Post').paginate({
					page: req.query.page || 1,
					perPage: 10,
					maxPages: 10
				})
				.where('author',req.user._id)
				.sort('-publishedDate')
				.populate('author');

					
			q.exec(function(err, results) {
				locals.data.posts = results;
				next(err);
			});
			
		});
	}
	
	// Render the view
	view.render('index');
	
};
