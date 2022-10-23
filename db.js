const mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs'),
  passportLocalMongoose = require('passport-local-mongoose');
require('dotenv').config();

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more lists
const User = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
	lists:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
  });
  
  // a journal in a journal list
  // * includes the date when the journal was written and its content
  const Journal = new mongoose.Schema({
	time: {type: Date, required: true},
	content: {type: String, required: true},
  }, {
	_id: true
  });
  
  // a journal list
  // * each list must have a related user
  // * a list can have 0 or more journals
  const List = new mongoose.Schema({
	user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	name: {type: String, required: true},
	createdAt: {type: Date, required: true},
	journals: [Journal]
  });


User.plugin(passportLocalMongoose);
List.plugin(URLSlugs('name'));

mongoose.model('User', User);
mongoose.model('List', List);
mongoose.model('Journal', Journal);
mongoose.connect(process.env.ATLAS_URI);
