import addressService from "../service/address-service.js";

const create = async (req, res, next) => {
  try {
    const username = req.user.username;
    const contactId = req.params.contactId;
    const request = req.body;
    const result = await addressService.create(username, contactId, request);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
};
