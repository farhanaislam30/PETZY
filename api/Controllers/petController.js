import Pet from "../models/petModel.js";

// Get all pets
export const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new pet (admin only)
export const createPet = async (req, res) => {
  try {
    const { name, type, breed, age, price, description, image, status } = req.body;
    
    const newPet = new Pet({
      name,
      type,
      breed,
      age,
      price,
      description,
      image,
      status: status || 'available'
    });

    const savedPet = await newPet.save();
    res.status(201).json(savedPet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a pet (admin only)
export const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, breed, age, price, description, image, status } = req.body;

    const updatedPet = await Pet.findByIdAndUpdate(
      id,
      { name, type, breed, age, price, description, image, status },
      { new: true, runValidators: true }
    );

    if (!updatedPet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.status(200).json(updatedPet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a pet (admin only)
export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPet = await Pet.findByIdAndDelete(id);

    if (!deletedPet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single pet by ID
export const getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
