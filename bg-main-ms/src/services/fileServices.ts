import logging from "../config/logging";

exports.getFiles = async (req, res) => {
    try{
        res.status(200).json({});
    }catch (err) {
        logging.error(err.message);
    }
}