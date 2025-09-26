const Consultation = require("../models/consultationModel");

// Create a new consultation
exports.createConsultation = async (req, res) => {
  try {
    const consultation = new Consultation(req.body);
    await consultation.save();
    res.status(201).json({ message: "Consultation created", consultation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all consultations (Admin)
exports.getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find().populate('userId astrologerId');
    res.status(200).json(consultations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all consultations (Admin)
exports.getAstrologerConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({astrologerId:req.user._id}).populate('userId astrologerId');
    res.status(200).json(consultations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single consultation
exports.getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id).populate('userId astrologerId');
    if (!consultation) return res.status(404).json({ message: "Consultation not found" });
    res.status(200).json(consultation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update consultation
exports.updateConsultation = async (req, res) => {
  try {
    const updatedConsultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedConsultation) return res.status(404).json({ message: "Consultation not found" });
    res.status(200).json({ message: "Consultation updated", updatedConsultation });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a consultation
exports.deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndDelete(req.params.id);
    if (!consultation) return res.status(404).json({ message: "Consultation not found" });
    res.status(200).json({ message: "Consultation deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
