const User = require('../models/User');

// @desc    Get all users (with their bookings)
// @route   GET /api/v1/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
    try {
        // ดึง User ทุกคน และดึงข้อมูลการจองของแต่ละคนมาด้วย
        const users = await User.find()
            .populate({
                path: 'bookings',
                select: 'bookingDate dentist',
                populate: {
                    path: 'dentist',
                    select: 'name'
                }
            });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private (Admin only)
exports.getUser = async (req, res, next) => {
    try {
        // เพิ่ม .populate เพื่อดึงข้อมูลการจอง และชื่อคุณหมอที่จองด้วย
        const user = await User.findById(req.params.id)
            .populate({
                path: 'bookings',
                select: 'bookingDate dentist', // เลือกเอาเฉพาะวันที่จองกับ ID หมอ
                populate: {
                    path: 'dentist',
                    select: 'name specialization' // ดึงชื่อหมอกับความเชี่ยวชาญมาโชว์
                }
            });

        if (!user) {
            return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้งานรายนี้' });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};