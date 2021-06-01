const mongoose = require('mongoose');

//Collection
const ordertSchema = new mongoose.Schema({

      shippingInfo : {

      }
      

});

module.exports = mongoose.model('Order',ordertSchema); 
