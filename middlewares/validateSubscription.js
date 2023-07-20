const {HttpError} = require("../helpers");

const validateSubscription = schema => {
    const func = (req, res, next) => {
        const { error } = schema.validate(req.body);
        if(error){
            const fieldName = error.details[0].context.label;
            if(Object.keys(req.body).length === 0) {
                next(HttpError(400, `missing required '${fieldName}' field`));
            }
            if(fieldName === 'subscription') {
                next(HttpError(400, "Invalid subscription value. Available options: 'starter', 'pro', 'business'."));
            };
        }
        
        next();
    };

    return func;
};

module.exports = validateSubscription;
