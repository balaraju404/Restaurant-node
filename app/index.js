const router = require('express').Router();
const dbConn = require('./db-conn/db-conn');
const dbQuery = require('./db-conn/db-query');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.post('/post', async (req, res) => {
    try {
        const { name, age, email, exp, role } = req.body || {};
        const insertRec = { name, age, email, exp, role };
        const result = await dbQuery.addRecord('users', insertRec);
        res.json({ status: true, msg: 'Data Inserted Successfully', insertId: result.insertId });
    } catch (error) {
        res.status(500).json({ status: false, msg: 'Error Occurred', error });
    }
});

router.post('/user_profile', upload.single('image'), (req, res) => {
    try {
        const id = req.body['id'];
        const image = req.file.buffer;
        const sql = `INSERT INTO users_profiles (image, user_id) VALUES (?, ?)`;

        dbConn.query(sql, [image, id], (err, results) => {
            if (err) {
                return res.status(500).json({ status: false, msg: 'Error inserting data' });
            }
            res.json({ status: true, msg: 'Data Inserted Successfully', insertId: results.insertId });
        });
    } catch (error) {
        res.status(500).json({ status: false, msg: 'Error Occurred', error });
    }
});

router.get('/profile/:id', async (req, res) => {
    try {
        const id = req.params['id'];
        const sql = `SELECT * FROM users_profiles WHERE user_id = ?`;
        const result = await dbQuery.getDetails(sql, [id]);

        if (result.length > 0) {
            const images = result.map((obj) => {
                const imageData = obj.image;
                const base64Image = imageData.toString('base64');
                return `data:image/png;base64,${base64Image}`;
            });
            res.send({ images });
        } else {
            res.status(404).send({ status: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).send({ status: false, message: 'Error fetching data' });
    }
});

module.exports = router;
