const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('review')
        // const reviews = await collection.find(criteria).toArray()
        var reviews = await collection.aggregate([
            {
                $match: criteria
            },
            {
                $lookup:
                {
                    localField: 'byUserId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'byUser'
                }
            },
            {
                $unwind: '$byUser'
            },
            {
                $lookup:
                {
                    localField: 'aboutToyId',
                    from: 'toy',
                    foreignField: '_id',
                    as: 'aboutToy'
                }
            },
            {
                $unwind: '$aboutToy'
            }
        ]).toArray()
        reviews = reviews.map(review => {
            review.byUser = { _id: review.byUser._id, fullname: review.byUser.fullname }
            review.aboutToy = { _id: review.aboutToy._id, name: review.aboutToy.name }
            delete review.byUserId
            delete review.aboutToyId
            return review
        })

        return reviews
    } catch (err) {
        logger.error('cannot find reviews', err)
        throw err
    }

}

async function remove(reviewId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { userId, isAdmin } = store
        const collection = await dbService.getCollection('review')
        // remove only if user is owner/admin
        const criteria = { _id: ObjectId(reviewId) }
        if (!isAdmin) criteria.byUserId = ObjectId(userId)
        await collection.deleteOne(criteria)
    } catch (err) {
        logger.error(`cannot remove review ${reviewId}`, err)
        throw err
    }
}


async function add(review) {
    try {
        // peek only updatable fields!
        const reviewToAdd = {
            byUserId: ObjectId(review.byUserId),
            aboutToyId: ObjectId(review.aboutToyId),
            txt: review.txt,
            imgUrls: review.imgUrls
        }
        const collection = await dbService.getCollection('review')
        let res = await collection.insertOne(reviewToAdd)
        console.log(res);
        return res.ops[0]
    } catch (err) {
        logger.error('cannot insert review', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.aboutToyId) {
    //    const txtCriteria = { $regex: filterBy.aboutToyId, $options: 'i' }
    //    criteria.aboutToyId = txtCriteria
    criteria.aboutToyId = ObjectId(filterBy.aboutToyId)
    }
    if (filterBy.byUser) {
    criteria.byUser = ObjectId(filterBy.byUser)

    //    const txtCriteria = { $regex: filterBy.byUser, $options: 'i' }
    //    criteria.byUser = txtCriteria
    }
    // if (filterBy.type && filterBy.type !== 'All') {
    //    criteria.type = filterBy.type
    // }
    // if (filterBy.price) {
    //    criteria.price = { $gte: +filterBy.price }
    // }
    return criteria
 }
 

module.exports = {
    query,
    remove,
    add
}


