const Users = require('../app/models/Users');
module.exports = {
    userRegistrationValidator: async (req, res, next) => {
        let user = req.body.user;
        if(!user.name) {
            return res.status(422).send({
                errors: {
                    message: 'Name is required',
                },
            });
        }

        if(!user.email) {
            return res.status(422).send({
                errors: {
                    message: 'Email is required',
                },
            });
        }
        let emailStatus = await Users().validateUniqeEmail(user.email);
        if(emailStatus) {
            return res.status(422).send({
                errors: {
                    message: 'Email is aleready exists.',
                },
            });
        }

        if(!user.password) {
            return res.status(422).send({
                errors: {
                    message: 'Password is required',
                },
            });
        }

        if(user.password !== user.cpassword) {
            return res.status(422).send({
                errors: {
                    message: 'Confirm password does not matched',
                },
            });
        }
        return next();
    },
    validateVideo: function(req, res, next) {
        if (req.file == undefined ) {
            res.statusCode = 400;
            return res.json({
                errors: ['Please select file']
            });
        }

        req.checkBody('title', 'Title should not blank').notEmpty();
        req.checkBody('description', 'Description should not blank').notEmpty();

        var errors = req.validationErrors();
        if (errors) {
        var response = { errors: [] };
        errors.forEach(function(err) {
            response.errors.push(err.msg);
        });

        res.statusCode = 400;
        return res.json(response);
        }

        return next();
    }
}