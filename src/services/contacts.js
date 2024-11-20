import { Contact } from '../models/contacts.js';

export const fetchAllContacts = async () => {
  return await Contact.find();
};

export const createNewContact = async (contactData) => {
  const contact = new Contact(contactData);
  return await contact.save();
};

export const deleteContactById = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId); 
};
