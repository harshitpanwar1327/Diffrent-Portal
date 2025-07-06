import { getHealthLogic, getHealthByGroupLogic } from '../services/HealthServices.js'

export const getHealth = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;

    try {
        let response = await getHealthLogic(limit, offset);
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.log("Error", error);
        return res.status(400).json({success: false, message: "Internal Server Error!"});
    }
}

export const getHealthByGroup = async (req, res) => {
    let page = parseInt(req.body.page) || 1;
    let limit = parseInt(req.body.limit) || 10;
    let offset = (page - 1) * limit;
    let id = req.body.id;

    try {
        let response = await getHealthByGroupLogic(limit, offset, id);
        if(response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.log("Error", error);
        return res.status(400).json({success: false, message: "Internal Server Error!"});
    }
}