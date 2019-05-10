module.exports = {
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