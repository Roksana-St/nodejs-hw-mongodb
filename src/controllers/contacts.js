import { Contact } from '../models/contacts.js';
import createError from 'http-errors';
import { createNewContact } from '../services/contacts.js';


export const getAllContacts = async (req, res) => {
  const contacts = await Contact.find();
  if (!contacts.length) {
    throw createError(404, 'No contacts found');
  }
  res.status(200).json({
    status: 'success',
    message: 'Successfully fetched all contacts!',
    data: contacts,
  });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 'success',
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContact = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(400, 'Missing required fields: name, phoneNumber, or contactType');
  }

  const newContact = await createNewContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const deleteContactById = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const contact = await Contact.findByIdAndDelete(contactId);

    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    res.status(204).send(); 
  } catch (error) {
    next(error); 
  }
};
