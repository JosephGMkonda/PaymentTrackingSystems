import { generateMonthlyReport } from '../services/reportService.js';

export const getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.params;
    
    // Convert to numbers and validate
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    
    if (isNaN(yearNum) ){
      return res.status(400).json({
        success: false,
        message: 'Invalid year parameter. Must be a number.'
      });
    }
    
    if (isNaN(monthNum)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid month parameter. Must be a number.'
      });
    }
    
    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        message: 'Invalid month. Must be between 1 and 12.'
      });
    }

    const report = await generateMonthlyReport(yearNum, monthNum);
    
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating monthly report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate monthly report',
      error: error.message
    });
  }
};