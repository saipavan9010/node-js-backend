const mongoose = require('mongoose');


const versionSchema = new mongoose.Schema(
    {
        
        AppVersion:{
            type:String,

        },
},
);
const Appversion = mongoose.model("AppVersions", versionSchema);

module.exports=Appversion

