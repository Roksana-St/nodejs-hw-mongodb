import { Contact } from '../models/contacts.js';

export const fetchAllContacts = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const contacts = await Contact.find({ userId }).skip(skip).limit(limit);
  const total = await Contact.countDocuments({ userId });

  return { contacts, total, page, pages: Math.ceil(total / limit) };
};


export const createNewContact = async (contactData) => {
  const contact = new Contact(contactData);
  return await contact.save();
};

export const updateContactByIdService = async (contactId, updateData) => {
  return Contact.findByIdAndUpdate(contactId, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteContactById = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId); 
};

