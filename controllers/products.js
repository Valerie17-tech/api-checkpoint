const Product = require('../models/product')

const getAllProductsStatic = async (req,res) => {
    const products = await Product.find({price: {$gt: 30 } }).sort('name').select('name price createdAt');
    res.status(200).json({ products, nbHits: products.length })

}

const getAllProducts = async (req,res) => {
    // pulling out only the properties we want to apply to the find, thereby destructuring it into req.query
    const { featured,company,name, sort,fields, numericFilters } = req.query
    const queryObject = {}

    if (featured) {
        // if the featured exists or is true then i am setting up the featured on my query object as seen in the code below
        queryObject.featured = featured === 'true' ? true : false
    }
    if(company) {
        // if the company exists or is true then i am setting up the company on my query object as seen in the code below
        queryObject.company = company
    }

    if (name) {
        queryObject.name = { $regex: name, $options: 'i'}
    }

    if(numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)
        
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
            queryObject[field] = { [operator]: Number(value) };
        }

        })
    }

    

    // console.log(queryObject)
    let result = Product.find(queryObject)
    // if there is sort, sort by the parameters else, sort using the createdAt params
    //sort
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList)

    } else {
        result = result.sort('createAt')
    }

    if(fields) {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)


    const products = await result 

    res.status(200).json({ products, nbHits: products.length })
}


module.exports = {
    getAllProductsStatic, 
    getAllProducts,
}