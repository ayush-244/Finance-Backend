const Record = require("../models/Record");

exports.getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total Income
    const totalIncome = await Record.aggregate([
      { $match: { userId, type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Total Expense
    const totalExpense = await Record.aggregate([
      { $match: { userId, type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Category-wise breakdown
   const categoryBreakdownRaw = await Record.aggregate([
        { $match: { userId } },
        {
    $group: {
      _id: "$category",
      total: { $sum: "$amount" },
             },
        },
    ]);

    const categoryBreakdown = categoryBreakdownRaw.map((item) => ({
    category: item._id,
    total: item.total,
    }));

    // Recent transactions
    const recent = await Record.find({ userId })
      .sort({ date: -1 })
      .limit(5);

    const income = totalIncome[0]?.total || 0;
    const expense = totalExpense[0]?.total || 0;

    res.json({
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
      categoryBreakdown,
      recentTransactions: recent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};