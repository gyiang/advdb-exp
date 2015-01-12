var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */
var Mark = new keystone.List('Mark', {
	nocreate: false,
	noedit: false
});

Mark.add({
	name: { type: Types.Name },
	stuid: { type: String },
	markingto: { type: String,required: true,initial:true},
	score:{type: Types.Number,required: true,initial:true},
	reason: { type: Types.Markdown, required: true,initial:true},
	createdAt: { type: Date, default: Date.now }
});

Mark.defaultSort = '-createdAt';
Mark.defaultColumns = 'name, stuid, markingto, score';
Mark.register();
