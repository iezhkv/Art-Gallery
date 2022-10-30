const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware');
const { preloadPublication, isPublicationAuthor } = require('../middlewares/publicationMiddleware');
const publicationService = require('../services/publicationService');

router.get('/' , async (req, res) => {
    const publications = await publicationService.getAll().lean();
    res.render('publication', { publications });
});

router.get('/:publicationId/details' , async (req, res) => {
    const publication = await publicationService.getOneDetailed(req.params.publicationId).lean();
    const publication2 = await publicationService.getOneDetailed(req.params.publicationId);

    const isAuthor = publication.author._id == req.user?._id;
    const shared = publication2.usersShared.includes(req.user?._id);
    console.log(shared);

    res.render('publication/details', { ...publication, isAuthor, shared });
});

router.get('/:publicationId/edit' ,isAuth, async (req, res) => {
    const publication = await publicationService.getOneDetailed(req.params.publicationId).lean();
    const isAuthor = publication.author._id == req.user?._id;

    if (isAuthor) {
        res.render('publication/edit', { ...publication, isAuthor });
    } else {
        res.redirect('/login');
    }

});

router.get('/create' ,isAuth, async (req, res) => {
    res.render('publication/create')
});

router.post('/create' ,isAuth, async (req, res) => {
    const publicationData = {...req.body, author: req.user._id};

    try {
        const createdPublication=  await publicationService.create(publicationData);
        res.redirect('/');
    } catch (error) {
        res.render('publication/create', {...publicationData , error: 'check data' });
    }
    
});
router.post('/:publicationId/edit' ,isAuth, async (req, res) => {
    const publicationData = {...req.body, author: req.user._id};
    try {
        await publicationService.update(req.params.publicationId, publicationData);
        res.redirect(`/publications/${req.params.publicationId}/details`);
    } catch (error) {
        res.render('publication/edit', {...publicationData , error: 'check data' });
    }
    
});

router.get('/:publicationId/delete' ,isAuth, async (req, res) => {
    const publication = await publicationService.getOneDetailed(req.params.publicationId).lean();
    const isAuthor = publication.author._id == req.user?._id;

    if (isAuthor) {
        await publicationService.delete(req.params.publicationId);
        res.redirect('/publications');
    } else {
        res.render('publication/details', { ...publication, error: 'Not authorized' });
    }

});

router.get('/:publicationId/share' ,isAuth, async (req, res) => {
    const publication = await publicationService.getOneDetailed(req.params.publicationId).lean();
    const isAuthor = publication.author._id == req.user?._id;
    const publicationData = {...req.body, usersShared: req.user._id};


    if (!isAuthor) {
        await publicationService.update(req.params.publicationId, publicationData);
        res.redirect('/publications');
    } else {
        res.render('publication/details', { ...publication, error: 'Not authorized' });
    }

});




module.exports = router;