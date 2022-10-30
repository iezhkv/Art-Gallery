const Publication = require('../models/Publication');
const User = require('../models/User');


exports.create = (publicationData) => Publication.create(publicationData);
exports.getAll = () => Publication.find();
exports.getOne = (publicationId) => Publication.findById(publicationId);
exports.getOneDetailed = (publicationId) => Publication.findById(publicationId).populate('author');
exports.delete = (publicationId) => Publication.findByIdAndDelete(publicationId);
exports.update = (publicationId, publicationData) => Publication.findByIdAndUpdate(publicationId,publicationData, {runValidators:true});

