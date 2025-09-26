const Appointment = require("../models/appointmentModel");

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json({ message: "Appointment created", appointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all appointments (Admin)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate(
      "userId astrologerId"
    );
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAstrologerAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit;

    // console.log("AstroId", req.user._id);

    const appointments = await Appointment.find({ astrologerId: req.user._id, })
      .skip(skip)
      .limit(limit)
      .populate("userId");

    const totalAppointments = await Appointment.countDocuments({ astrologerId: req.user._id, });

    res.status(200).json({ success: true, count: appointments.length, total: totalAppointments, data: appointments, });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single appointment
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("userId astrologerId");
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAppointment)
      return res.status(404).json({ message: "Appointment not found" });
    res
      .status(200)
      .json({ message: "Appointment updated", updatedAppointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get upcoming appointments
exports.getUpcomingAppointments = async (req, res) => {
  try {
    const now = new Date();
    const appointments = await Appointment.find({
      user: req.user._id,
      date: { $gte: now }, // Filter for appointments that are in the future
    }).sort({ date: 1 }); // Sort by date in ascending order

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get past appointments
exports.getPastAppointments = async (req, res) => {
  try {
    const now = new Date();
    const appointments = await Appointment.find({
      user: req.user._id,
      date: { $lt: now }, // Filter for appointments that are in the past
    }).sort({ date: -1 }); // Sort by date in descending order

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
