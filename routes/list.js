const express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	List = mongoose.model('List');

const isAuthenticated = (req, res, next) => {
  if(!req.user) {
    res.redirect('/'); 
    console.log('redirecting');
  } else {
    next();
  }
};

const timeconvert={
	"last three":3*30,
	"last six":182,
	"last year":365
}

router.use(express.urlencoded({ extended: false }));

router.use(isAuthenticated);

router.get('/', (req, res) => {
	List.find({user: req.user ? req.user._id : undefined}, (err, lists, count) => {
		res.render('list-all.hbs', {lists:lists});
	});
});

router.get('/create', (req, res) => {
  res.render('list-create.hbs');
});

router.post('/create', (req, res) => {
	const {name} = req.body;
	new List({
    user: req.user._id,
		name: name,
		createdAt: new Date(),
	}).save((err, list, count) => {
		res.redirect(`/list/${list.slug}`);
	});
});



function difference(cur,prev){
	const prevDate = new Date(prev).getTime();
	const difference = cur.getTime()- prevDate;
	console.log(difference / (1000 * 3600 * 24));
	return difference / (1000 * 3600 * 24);
}



router.get('/:slug', (req, res) => {

	// console.log("params",req.params);
	// console.log(req.query);
	List.findOne({slug:req.params.slug}, (err, list, count) => {
		if (err){
			console.log(err);
			res.render("error");
		} else{
			// check whether the list is empty 
			// Jounrals.findone.sort();
			const clone = JSON.parse(JSON.stringify(list));
			clone.journals.sort(function(a,b) {return (a.time < b.time) ? 1 : ((b.time < a.time) ? -1 : 0);} );
			// if filter was applied:

			if (req.query.hasOwnProperty("filterform")){
				const date = req.query.date;
				const cur = new Date();
				if (date !== ""){
					const lesstime = timeconvert[date];
					const newArr = clone.journals.filter(element => {
						return difference(cur,element.time)<timeconvert[date];
					})
					clone.journals = newArr;	
				}
			}
			console.log("after filltered:",clone.journals);
			clone.journals.map(element => {
				element.time = element.time.slice(0,10);
			});
			res.render('list-slug.hbs', {list:clone});
		}
	})
});


module.exports = router;
