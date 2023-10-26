const Country = require('../model/countryModel');
const fs = require('fs');
const multer = require('multer');
const csv = require('csv-parser');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage }).single('file');

exports.uploadCountryCSV = async (req, res, next) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(`Uploaded file path: ${file.path}`);

        fs.createReadStream(file.path)
            .pipe(csv())
            .on('data', async (row) => {
                try {
                    const existingCountry = await Country.findOne({
                        Country_Name: row.Country_Name,
                        Country_two_letter_Code: row.Country_two_letter_Code,
                        Currency_Code: row.Currency_Code,
                        Phone_Code: row.Phone_Code
                    });

                    if (!existingCountry) {
                        const data = new Country({
                            Country_Name: row.Country_Name,
                            Country_two_letter_Code: row.Country_two_letter_Code,
                            Currency_Code: row.Currency_Code,
                            Phone_Code: row.Phone_Code
                        });

                        await data.save();
                        console.log(`Data for ${row.Country_Name} inserted into MongoDB`);
                    } else {
                        console.log(`Data for ${row.Country_Name} already exists, skipping...`);
                    }
                } catch (error) {
                    console.error(error);
                }
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                console.log(`Removing file at path: ${file.path}`);
                fs.unlinkSync(file.path); // Remove the temporary file after processing
                res.json({ message: 'CSV file uploaded successfully' });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


exports.createCountry = async (req, res, next) => {
    try {
        const { Country_Name, Country_two_letter_Code, Currency_Code, Phone_Code } = req.body;

        if (!Country_Name || !Country_two_letter_Code || !Currency_Code || !Phone_Code) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingCountry = await Country.findOne({
            Country_Name,
            Country_two_letter_Code,
            Currency_Code,
            Phone_Code
        });

        if (existingCountry) {
            return res.status(400).json({ error: 'Country already exists' });
        }

        const country = new Country({
            Country_Name,
            Country_two_letter_Code,
            Currency_Code,
            Phone_Code
        });

        await country.save();

        res.status(201).json({ status: 'Success', message: 'Country created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getCountry = async(req,res,next) => {
    try {
        const countries = await Country.find();
        res.status(200).json(countries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
