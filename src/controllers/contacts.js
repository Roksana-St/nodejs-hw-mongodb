import createError from 'http-errors';
import { Contact } from '../models/contacts.js';
import { fetchAllContacts, createNewContact, updateContactByIdService, deleteContactById } from '../services/contacts.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = await saveFileToCloudinary(req.file); 
    res.status(200).json({
      status: 200,
      message: 'File uploaded successfully',
      data: { fileUrl }, 
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error uploading file to Cloudinary',
      error: error.message,
    });
  }
};



export const getAllContacts = async (req, res) => {
  const contacts = await fetchAllContacts(req.user._id);
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const createContact = async (req, res) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    let photoUrl = null;
    if (req.file) {
      photoUrl = await saveFileToCloudinary(req.file);
    }

    const newContact = await createNewContact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId: req.user._id,
      photo: photoUrl,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error creating contact',
      error: error.message,
    });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const updateData = req.body;

    if (req.file) {
      const photoUrl = await saveFileToCloudinary(req.file);
      updateData.photo = photoUrl; 
    }

    const updatedContact = await updateContactByIdService(contactId, updateData);

    if (!updatedContact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact!',
      data: updatedContact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Error updating contact',
      error: error.message,
    });
  }
};
