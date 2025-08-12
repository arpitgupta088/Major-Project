// const Joi =  require('joi');
// module.exports.listingSchema = Joi.object({
//     listing: Joi.object({
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         location: Joi.string().required(),
//         country: Joi.string().required(),
//         price: Joi.number().required().min(0), // price ko number hona chahiye aur 0 se kam nahi
//         image: Joi.string().allow("", null) // image ko string ya null ya empty string allow karega
//     }).required()
// });

// module.exports.reviewSchema = Joi.object({
//     review: Joi.object({
//         rating: Joi.number().required().min(1).max(5), 
//         comment: Joi.string().required(),
//     }).required(),
// });

const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            url: Joi.string().uri()
        }).optional()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});
