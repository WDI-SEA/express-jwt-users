var mongoose = require('mongoose');

var CoffeeSchema = mongoose.Schema({
	name: String,
	size: Number,
	shots: Number,
	milk: Number,
	milk_type: String
});

var milkArray = [
	"whole",
	"skim",
	"nonfat",
	"soy"
];

CoffeeSchema.set("toJson", {
	transform: function(doc, ret, options){
		var milk = ret.milk >= 0 && ret.milk < milkArray.length ? milkArray[ret.milk] : "foo";
		return {
			id: ret._id,
			name: ret.name,
			size: ret.size,
			shots: ret.shots,
			milk: milk
		};
	}
});

CoffeeSchema.pre('save', function(next){
	var index = milkArray.indexOf(this.milk_type);
	this.milk = index;
	if(index == -1){
		this.milk_type = "none";
	}
	next();
})

module.exports = mongoose.model("Coffee", CoffeeSchema);