const Joi=require("joi");
const { category } = require("./controllers/listing");
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().min(1).required(),
        description: Joi.string().min(1).required(),  // Should trigger error if empty
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: {
            url:Joi.string().allow("", null).optional(),
            filename: Joi.string().required()
         } ,
         category:Joi.string(),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
rating:Joi.number().required().min(1).max(5),
comment: Joi.string().required()
    })
})