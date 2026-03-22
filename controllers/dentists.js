const Dentist = require('../models/Dentist');
const Booking =require('../models/Booking')

//@desc      Get all dentists
//@route     GET /api/v1/dentists
//@access    Public
exports.getDentists = async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over remove fields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);
  console.log(reqQuery);

  // Create Query String
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  query = Dentist.find(JSON.parse(queryStr)).populate('bookings');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    const total = await Dentist.countDocuments();
    query = query.skip(startIndex).limit(limit);

    // Executing query
    const dentists = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }

    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: dentists.length,
      pagination, // อย่าลืมใส่ pagination เข้าไปใน response ด้วยครับ
      data: dentists
    });

  } catch (err) {
    console.log("--- ERROR DETECTED ---");
    console.log(err); 
    console.log("----------------------");
    res.status(400).json({ success: false });
  }
};


//@desc      Get single dentist
//@route     GET /api/v1/dentists/:id
//@access    Public
exports.getDentist = async (req, res, next) => {
  try {
    // แนะนำให้ใส่ .populate('bookings') ที่นี่ด้วยถ้าอยากเห็นว่าหมอคนนี้มีใครจองบ้าง
    const dentist = await Dentist.findById(req.params.id);

    if (!dentist) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: dentist
    });

  } catch (err) {
    res.status(400).json({ success: false });
  }
};


//@desc      Create a dentist
//@route     POST /api/v1/dentists
//@access    Private (Admin)
exports.createDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.create(req.body);

    res.status(201).json({
      success: true,
      data: dentist
    });
  } catch (err) {
    res.status(400).json({ success: false, message: "Cannot create Dentist" });
  }
};


//@desc      Update single dentist
//@route     PUT /api/v1/dentists/:id
//@access    Private (Admin)
exports.updateDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!dentist) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: dentist
    });

  } catch (err) {
    res.status(400).json({ success: false });
  }
};


//@desc      Delete single dentist
//@route     DELETE /api/v1/dentists/:id
//@access    Private (Admin)
exports.deleteDentist = async (req, res, next) => {
  try {
    const dentist = await Dentist.findById(req.params.id);

    if (!dentist) {
      return res.status(400).json({ success: false });
    }

    // 3. เมื่อลบหมอ ให้ลบการจอง (Bookings) ทั้งหมดที่เกี่ยวข้องกับหมอคนนี้ด้วย (Cascade Delete)
    await Booking.deleteMany({ dentist: req.params.id });
    
    await Dentist.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      data: {}
    });

  } catch (err) {
    res.status(400).json({ success: false });
  }
};