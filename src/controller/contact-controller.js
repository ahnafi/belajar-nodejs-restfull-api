import contactService from "../service/contact-service.js";

const create = async (req, res, next) => {
  try {
    const username = req.user.username;
    const request = req.body;
    const contact = await contactService.create(username, request);

    res.status(200).json({
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const username = req.user.username;
    const contactId = req.params.contactId;
    const contact = await contactService.get(username, contactId);
    res.status(200).json({
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  get,
};
