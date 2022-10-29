const Publication = require('../models/Publication');
const User = require('../models/User');


exports.create = (publicationData) => {
    const createdPublication = Publication.create(publicationData);

}