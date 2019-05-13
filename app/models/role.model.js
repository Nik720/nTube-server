import mongoose from 'mongoose'

const RoleSchema = mongoose.Schema({
    name: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Role', RoleSchema);