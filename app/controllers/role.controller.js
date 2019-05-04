const Role = require('../models/role.model.js');

// Create and Save a new Role
exports.create = (req, res) => {
	// Validate request
    if(!req.body.name) {
        return res.status(400).send({
            message: "Role name can not be empty"
        });
    }

    // Create a Role
    const role = new Role({
        name: req.body.name,
    });

    // Save Role in the database
    role.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Role."
        });
    });
};

// Retrieve and return all roles from the database.
exports.findAll = (req, res) => {
	Role.find()
    .then(roles => {
        res.send(roles);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving roles."
        });
    });
};

// Find a single role with a roleId
exports.findOne = (req, res) => {
	Role.findById(req.params.roleId)
    .then(role => {
        if(!role) {
            return res.status(404).send({
                message: "Role not found with id " + req.params.roleId
            });            
        }
        res.send(role);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Role not found with id " + req.params.roleId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving role with id " + req.params.roleId
        });
    });
};

// Update a role identified by the roleId in the request
exports.update = (req, res) => {
	// Validate Request
    if(!req.body.name) {
        return res.status(400).send({
            message: "Role name can not be empty"
        });
    }

    // Find role and update it with the request body
    Role.findByIdAndUpdate(req.params.roleId, {
        name: req.body.name
    }, {new: true})
    .then(role => {
        if(!role) {
            return res.status(404).send({
                message: "Role not found with id " + req.params.roleId
            });
        }
        res.send(role);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Role not found with id " + req.params.roleId
            });                
        }
        return res.status(500).send({
            message: "Error updating role with id " + req.params.roleId
        });
    });
};

// Delete a role with the specified roleId in the request
exports.delete = (req, res) => {
	Role.findByIdAndRemove(req.params.roleId)
    .then(role => {
        if(!role) {
            return res.status(404).send({
                message: "Role not found with id " + req.params.roleId
            });
        }
        res.send({message: "Role deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Role not found with id " + req.params.roleId
            });                
        }
        return res.status(500).send({
            message: "Could not delete role with id " + req.params.roleId
        });
    });
};