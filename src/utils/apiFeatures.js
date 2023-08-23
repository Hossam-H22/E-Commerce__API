


class ApiFeatures {
    constructor(mongooseQuery, queryData){
        this.mongooseQuery = mongooseQuery;
        this.queryData = queryData;
        this.metadata = {};
    }
    populate(){
        const availableDetails = ['categoryId', 'subcategoryId', 'brandId', 'reviews'];
        const detailsFields = [];
        this.queryData.details?.split(',').forEach(item => {
            if(availableDetails.includes(item)){
                detailsFields.push({ path: item });
            }
        })
        this.mongooseQuery.find({ isDeleted: false }).populate(detailsFields);
        return this;
    }
    paginate() {
        let { page, size } = this.queryData
        if(!page || page <=0) page = 1;
        if(!size || size <=0) size = 20;
        if (size > 40) size = 40;
        const skip = (parseInt(page) - 1) * parseInt(size);
        this.limit = parseInt(size);
        this.page = parseInt(page);
        this.mongooseQuery.limit(parseInt(size)).skip(skip);
        return this;
    }
    filter(){
        const excludeQueryParams = ['page', 'size', 'sort', 'fields', 'details'];
        const filterQuery = { ...this.queryData };
        excludeQueryParams.forEach(param => {
            delete filterQuery[param];
        });
        const filteredParams = JSON.parse(JSON.stringify(filterQuery).replace(/(gt|gte|lt|lte|in|nin|eq|neq)/g, match => `$${match}`));
        this.mongooseQuery.find(filteredParams);
        return this;
    }
    sort(){
        this.mongooseQuery.sort(this.queryData.sort?.includes(',')? this.queryData.sort?.replaceAll(',', ' ') : this.queryData.sort);
        return this;
    }
    select(){
        this.mongooseQuery.select(this.queryData.fields?.includes(',')? this.queryData.fields?.replaceAll(',', ' ') : this.queryData.fields);
        return this;
    }
    search(){
        if(this.queryData.search) {
            this.mongooseQuery.find({
                $or: [
                    { name: { $regex: this.queryData.search, $options: 'i' } },
                    { description: { $regex: this.queryData.search, $options: 'i' } },
                ],
            });
        }
        return this;
    }

}

export default ApiFeatures;