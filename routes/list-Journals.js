const express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	List = mongoose.model('List'),
	Journal = mongoose.model('Journal');
router.post('/create', (req, res) => {
	const {listSlug,date,content} = req.body;
	let datetime = new Date(date);
	if (datetime > Date.now() || isNaN(datetime)){
		datetime = new Date();
	}
	console.log(listSlug);
	List.findOneAndUpdate({slug:listSlug}, {$push: {journals:{"time":datetime,content}}}, (err, list, count) => {
		console.log(err);
		res.redirect(`/list/${listSlug}`);
	});
	
});

router.post('/edit', async (req,res)=>{
	const {date,content,listSlug,_id} = req.body;
	console.log(req.body);
	let list = await List.findOne({slug:listSlug}).exec();
	let change = list.journals.filter(journal=>{
		 return (journal._id.toString() === _id);
	})
	change[0].content = content;
	change[0].time = new Date(date);
	console.log(list.journals)
	list.save((err,savedlist)=>{
		if (err){
			throw err;
		} else{
			res.redirect(`/list/${listSlug}`)
		}
	})
})

module.exports = router;
