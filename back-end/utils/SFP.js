class SFP{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        //if keyword existe i will search in DB else i do nothings
        const keyword = this.queryStr.keyword ? {
            name : { //search by name
                $regex : this.queryStr.keyword,
                $options : 'i' //"i" is for case insensitive match
            }
        } : {}

        /* 
        
           var Person = mongoose.model('Person', yourSchema);
   // find each person with a name contains 'Ghost'
   Person.findOne({ "name" : { $regex: /Ghost/, $options: 'i' } },
          function (err, person) {
                 if (err) return handleError(err);
                 console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation);

   });
        */
        
        console.log(this.queryStr)
        console.log(keyword)
        this.query = this.query.find({ ...keyword }); //Product.find()
        //this.query and this.queryStr;
        return this;

    }

    filter(){
        const queryCopy =  { ...this.queryStr }; //create copy queryStr
        
        //Removing fields from the query
        const removeFields = [ 'keyword' , 'limit' , 'page' ];
        removeFields.forEach(el => delete queryCopy[el]);

        console.log(queryCopy);

        //filter for price, retings ...
        let queryStr = JSON.stringify(queryCopy); //to String
        console.log(queryStr);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`); //match gt and gte with $ => $gte

        console.log(queryStr);
        //to simplify the search in database with $gt and $lte 
        this.query = this.query.find(JSON.parse(queryStr)); //to Json
        return this;
    }

    pagination(resPerPage){
        console.log("->>> : "+this.queryStr.page);

        const currentPage = Number(this.queryStr.page) || 1;
        console.log(currentPage);
        const skip = resPerPage * (currentPage - 1);
        
        this.query = this.query.limit(resPerPage).skip(skip);
        //give 4 product if i move then skip the 4 and give new 4 
        return this;
    }
}

module.exports = SFP;  