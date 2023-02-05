const JsonPatchModel = require("../models/jsonpatch.model");
const jsonPatchService = require("../services/jsonpatch.service");
const jsonpatch = require("fast-json-patch");

module.exports = {
  async applyPatch(req, res) {
    try {
      const params = req.body;
      const differentDataArray = await jsonPatchService.applyPatch(
        params.baseObj,
        params.patch
      );
      const addData = await JsonPatchModel.create({
        baseObject: differentDataArray[0].oldDocumnet,
        jsonPatch: params.patch,
        convertObject: differentDataArray[0].newDocument,
      });
      return res.status(200).json(addData);
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  },

  async updatePatch(req, res) {
    try {
      const params = req.body;
      const jsonPatchdata = await JsonPatchModel.findById(params.id);
      const document = jsonPatchdata?.baseObject; // baseObject
      const convertDoc = jsonPatchdata?.convertObject; // conertDoc
      const updatedObj =
        params?.updatedObj && JSON.parse(JSON.stringify(params?.updatedObj));
      const deletedObj =
        params?.deletedObj && JSON.parse(JSON.stringify(params?.deletedObj));

      const observer = jsonpatch.observe(convertDoc);
      // get all patch
      const allPatch = jsonPatchdata.jsonPatch;
      // update the patch based value by new value
      if (updatedObj) {
        Object.keys(updatedObj).map((key) => {
          document[key] = updatedObj[key];
        });
      }
      // remove the patch from the value
      if (deletedObj) {
        Object.keys(deletedObj).map((key) => {
          delete convertDoc[key];
        });
      }
      let updatedPatchs;
      // after update & delete patch remove the path and get remaining value
      if (updatedObj || deletedObj) {
        let patchRemove = updatedObj || deletedObj;
        Object.keys(patchRemove).map((key) => {
          updatedPatchs = allPatch.filter((x) => {
            let newPath = x.path.substring(1, x.path.length);
            return newPath != key;
          });
        });
      }
      const patch = jsonpatch.generate(observer);
      const convertData = jsonpatch.applyPatch(convertDoc, patch).newDocument;

      const updatedData = await JsonPatchModel.findOneAndUpdate(
        { _id: params.id },
        {
          convertObject: convertData,
          jsonPatch: updatedPatchs,
          baseObject: document,
        },
        { new: true }
      );
      return res.status(200).json(updatedData);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error });
    }
  },
};
