const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware')
const publicationService = require('../services/publicationService');

router.get('/' , async (req, res) => {
    const publications = await publicationService.getAll().lean();
    res.render('publication', { publications });
});

router.get('/:publicationId/details' , async (req, res) => {
    const publication = await publicationService.getOneDetailed(req.params.publicationId).lean();
    const isAuthor = publication.author._id == req.user?._id;

    res.render('publication/details', { ...publication, isAuthor });
});

router.get('/:publicationId/edit' ,isAuth, async (req, res, next) => {
    const publication = await publicationService.getOne(req.params.publicationId);    
    //IsAuthor
    if (publication.author != req.user._id) {
        return next({massage: 'You are not authorized', status: 401});
    }

    res.render('publication/edit', {...publication});
});


router.get('/create', isAuth, (req, res) =>{
    res.render('publication/create');
});

router.post('/create', isAuth, async (req, res) =>{
    const publicationData = {...req.body, author: req.user._id};
    const createdPublication=  await publicationService.create(publicationData);
    res.redirect('/');
});


module.exports = router;