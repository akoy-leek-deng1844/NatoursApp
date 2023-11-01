const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../../models/tourmodel');

dotenv.config({ path: `${__dirname}/../../../config.env` });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connections successful...');
  });

//   IMPORT DATA INTO THE DB
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const importData = async () => {
    try {
        await Tour.create(tours);
        process.exit()
    } catch (error) {
        console.log(error);  
    }
}
console.log(process.argv); 

// DELETE DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        process.exit();
    
    } catch (error) {
      console.log(error);
    }
}

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
  deleteData();
}