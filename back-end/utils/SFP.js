class SFP{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name : {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}
        
        console.log(this.queryStr)
        console.log(keyword)
        this.query = this.query.find({ ...keyword }); //products.find(keyword)
        //this.query = this.query.find({ ...keyword });
        return this;

    }

    filter(){
        const queryCopy =  { ...this.queryStr };
        
        //Removing fields from the query
        const removeFields = [ 'keyword' , 'limit' , 'page' ];
        removeFields.forEach(el => delete queryCopy[el]);

        console.log(queryCopy);

        //Advance filter for price, retings ...
        let queryStr = JSON.stringify(queryCopy);
        console.log(queryStr);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`); //match gt and gte with $ => $gte

        console.log(queryStr);
        //to simplify the search in database with $gt and $lte 
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resPerPage){
        console.log("->>> : "+this.queryStr.page);

        const currentPage = Number(this.queryStr.page) || 1;
        console.log(currentPage);
        const skip = resPerPage * (currentPage - 1);
        
        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

module.exports = SFP;  