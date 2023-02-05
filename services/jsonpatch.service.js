const jsonpatch = require('fast-json-patch');


module.exports = {
     applyPatch(baseObj,patch){
        const docArray= [];
            const oldObj=JSON.parse(JSON.stringify(baseObj))
            const result = jsonpatch.applyPatch(baseObj,patch,true).newDocument;
            docArray.push({newDocument:result,oldDocumnet:oldObj})
            return docArray
    }
}