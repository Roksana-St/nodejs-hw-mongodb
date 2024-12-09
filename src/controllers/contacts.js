import { Contact } from '../models/contacts.js';
import createError from 'http-errors';

export const getAllContacts = async (req, res) => {
  const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = req.query;

  const currentPage = parseInt(page, 10);
  const limit = parseInt(perPage, 10);
  const skip = (currentPage - 1) * limit;

  const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const filter = { userId: req.user._id }; 
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const totalItems = await Contact.countDocuments(filter);
  const contacts = await Contact.find(filter).sort(sortOptions).skip(skip).limit(limit);

  res.status(200).json({
    status: 'success',
    data: {
      data: contacts,
      page: currentPage,
      perPage: limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findOne({ _id: contactId, userId: req.user._id }); 
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json(contact);
};

export const createContact = async (req, res) => {
  const newContact = new Contact({ ...req.body, userId: req.user._id }); 
  await newContact.save();
  res.status(201).json(newContact);
};

export const updateContactById = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json(updatedContact);
};

export const deleteContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId: req.user._id });
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).send();
};
