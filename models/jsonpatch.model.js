const mongoose = require('mongoose')


const JsonPatchSchema = new mongoose.Schema({
    baseObject:Object,
    jsonPatch:Array,
    convertObject:Object,
})

module.exports = mongoose.model('JsonPatch', JsonPatchSchema)