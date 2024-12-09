import createError from 'http-errors';
import { Contact } from '../models/contacts.js';
import { fetchAllContacts, createNewContact, updateContactByIdService, deleteContactById } from '../services/contacts.js';

export const getAllContacts = async (req, res) => {
  const contacts = await fetchAllContacts(req.user._id);
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const createContact = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  const newContact = await createNewContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
    userId: req.user._id,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};
