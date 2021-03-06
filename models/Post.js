var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Post.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true,required: true ,initial:true},
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } ,default: Date.now },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 50 },
		extended: { type: Types.Html, wysiwyg: true, height: 200 }
	},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
	doc:{type: Types.LocalFile,dest: './public/files',prefix: '/files/',
		format: function(item, file){
		return '<a href="/files/'+file.filename+'">'
	}}
});

Post.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%,categories|20%';
Post.register();
