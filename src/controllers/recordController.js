const Record = require("../models/Record");

const validateRecord = (data) => {
  const { amount, type, category } = data;

  if (!amount || amount <= 0) return "Amount must be greater than 0";
  if (!["income", "expense"].includes(type)) return "Invalid type";
  if (!category) return "Category is required";

  return null;
};

exports.createRecord = async (req, res) => {
  try {
    const errorMsg = validateRecord(req.body);
    if (errorMsg) {
      return res.status(400).json({ message: errorMsg });
    }

    const record = await Record.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(record);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

exports.getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;

    let filter = { userId: req.user._id };

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const records = await Record.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (record.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const errorMsg = validateRecord({
      amount: req.body.amount ?? record.amount,
      type: req.body.type ?? record.type,
      category: req.body.category ?? record.category,
    });

    if (errorMsg) {
      return res.status(400).json({ message: errorMsg });
    }

    Object.assign(record, req.body);
    await record.save();

    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (record.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await record.deleteOne();

    res.json({ message: "Record deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};