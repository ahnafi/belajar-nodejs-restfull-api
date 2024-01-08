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

const update = async (req, res, next) => {
  try {
    const username = req.user.username;
    const newData = req.body;
    const contactId = req.params.contactId;
    newData.id = contactId;
    const contact = await contactService.update(username, newData);
    res.status(200).json({
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const username = req.user.username;
    const contactId = req.params.contactId;
    await contactService.remove(username, contactId);

    res.status(200).json({
      data: "OK",
    });
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const username = req.user.username;
    const request = {
      name: req.query.name,
      email: req.query.email,
      phone: req.query.phone,
      size: req.query.size,
      page: req.query.page,
    };
    const result = await contactService.search(username, request);

    res.status(200).json({
      data: result.data,
      paging: result.paging,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  get,
  update,
  remove,
  search,
};
