import { Contact } from '../models/contacts.js';

export const fetchAllContacts = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const contacts = await Contact.find({ userId }).skip(skip).limit(limit);
  const total = await Contact.countDocuments({ userId });

  return { contacts, total, page, pages: Math.ceil(total / limit) };
};

export const findContactByIdAndOwner = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId }); 
};



export const createNewContact = async (contactData) => {
  const contact = new Contact(contactData);
  return await contact.save();
};

export const updateContactByIdService = async (contactId, userId, updateData) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId }, 
    updateData,
    { new: true, runValidators: true }
  );
};

export const deleteContactById = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId }); 
};


