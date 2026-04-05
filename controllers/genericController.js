const mongoose = require('mongoose');

/**
 * Tạo mới một bản ghi (Document)
 * @param {mongoose.Model} model - Model Mongoose cần thao tác
 */
const create = (model) => (req, res, next) => {
    // Khởi tạo instance mới từ dữ liệu trong body
    const doc = new model({
        ...req.body
    });

    return doc
        .save()
        .then((result) => res.status(201).json({ success: true, result }))
        .catch((error) => res.status(400).json({ success: false, error: error.message }));
};

/**
 * Lấy danh sách tất cả bản ghi
 * @param {mongoose.Model} model - Model Mongoose cần thao tác
 * @param {string|object} populate - Cấu hình nối bảng (nếu có)
 */
const getAll = (model, populate) => (req, res, next) => {
    let query = model.find();

    // Tự động lọc bỏ các bản ghi đã bị xóa mềm (is_deleted: true)
    if (model.schema.paths.is_deleted) {
        query = query.where({ is_deleted: { $ne: true } });
    }

    // Thực hiện nối bảng nếu có yêu cầu
    if (populate) query = query.populate(populate);

    return query
        .then((results) => res.status(200).json({ success: true, results }))
        .catch((error) => res.status(500).json({ success: false, error: error.message }));
};

/**
 * Lấy thông tin chi tiết một bản ghi theo ID
 * @param {mongoose.Model} model - Model Mongoose
 * @param {string|object} populate - Cấu hình nối bảng
 */
const get = (model, populate) => (req, res, next) => {
    const id = req.params.id;
    let query = model.findById(id);

    // Kiểm tra trạng thái xóa mềm
    if (model.schema.paths.is_deleted) {
        query = query.where({ is_deleted: { $ne: true } });
    }

    if (populate) query = query.populate(populate);

    return query
        .then((result) => (result ? res.status(200).json({ success: true, result }) 
                                  : res.status(404).json({ success: false, message: 'Không tìm thấy dữ liệu' })))
        .catch((error) => res.status(500).json({ success: false, error: error.message }));
};

/**
 * Cập nhật thông tin bản ghi theo ID
 * @param {mongoose.Model} model - Model Mongoose
 */
const update = (model, populate) => (req, res, next) => {
    const id = req.params.id;

    // Tìm bản ghi đang hoạt động
    let query = model.findOne({ _id: id });
    if (model.schema.paths.is_deleted) {
        query = query.where({ is_deleted: { $ne: true } });
    }

    return query
        .then((result) => {
            if (result) {
                // Cập nhật các trường dữ liệu mới
                result.set(req.body);
                return result
                    .save()
                    .then((savedResult) => res.status(200).json({ success: true, result: savedResult }))
                    .catch((error) => res.status(400).json({ success: false, error: error.message }));
            } else {
                return res.status(404).json({ success: false, message: 'Không tìm thấy dữ liệu để cập nhật' });
            }
        })
        .catch((error) => res.status(500).json({ success: false, error: error.message }));
};

/**
 * Xóa bản ghi (Hỗ trợ cả Xóa mềm và Xóa vĩnh viễn)
 * @param {mongoose.Model} model - Model Mongoose
 */
const delet = (model) => (req, res, next) => {
    const id = req.params.id;

    // Nếu Model hỗ trợ xóa mềm, ta cập nhật trường is_deleted
    if (model.schema.paths.is_deleted) {
        return model.findById(id)
            .then(result => {
                if (!result) return res.status(404).json({ success: false, message: 'Không tìm thấy dữ liệu' });
                result.is_deleted = true;
                return result.save()
                    .then(() => res.status(200).json({ success: true, message: 'Đã xóa (Xóa mềm)' }));
            })
            .catch((error) => res.status(500).json({ success: false, error: error.message }));
    } else {
        // Nếu không, thực hiện xóa vĩnh viễn khỏi Database
        return model.findByIdAndDelete(id)
            .then((result) => (result ? res.status(200).json({ success: true, message: 'Đã xóa vĩnh viễn' }) 
                                      : res.status(404).json({ success: false, message: 'Không tìm thấy dữ liệu' })))
            .catch((error) => res.status(500).json({ success: false, error: error.message }));
    }
};

module.exports = { create, getAll, get, update, delet };
