const express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
List = mongoose.model('List');


router.post('/delete', async (req,res)=>{
	console.log("here");
	console.log(req.body);
	const {_id,name} = (req.body);
	let list = await List.findOne({slug:name}).exec();
	console.log(_id);
	const map = list.journals.filter(journal=>{
		return journal._id.toString() !== _id
		}
	)
	list.journals = map;
	const saved = await list.save();
	res.send(saved);
})
module.exports = router;