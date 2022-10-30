const publicationService = require('../services/publicationService')

exports.preloadPublication = async (req, res, next) => {
    const publication = await publicationService.getOne(req.params.publicationId).lean();

    req.publication = publication;

    next();
}

exports.isPublicationAuthor = async (req, res, next) => {

    const publication = await publicationService.getOneDetailed(req.params.publicationId).lean();
    const isAuthor = publication.author._id == req.user?._id;

    // req.publication = publication;
    if (!isAuthor) {
        return next({massage: 'You are not authorized', status: 401});
    }
    next();
}