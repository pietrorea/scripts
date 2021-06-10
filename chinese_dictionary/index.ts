import { Sequelize, Model, DataTypes } from "sequelize";

import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
});

console.log('Beginning to attempt connection to database');

sequelize
  .authenticate()
  .then(() => {
    console.log("I'm authenticated. I'm in!");
  })
  .catch(err => {
    console.log(`Could not authenticate with error ${err}`);
  });

// async function readEntries() {
//   const entries = await Entry.findAll()
//   console.log(`all entries: ${entries}`);
// }

// class Entry extends Model {
//   public entryId: number;
//   public simplified: string;
//   public traditional: string;
//   public pinyin: string;
// };

// Entry.init({
//   //attributes
//   entryId: {
//     type: DataTypes.INTEGER.UNSIGNED,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   simplified: {
//     type: DataTypes.STRING(255),
//     allowNull: true
//   },
//   traditional: {
//     type: DataTypes.STRING(255),
//     allowNull: true
//   },
//   pinyin: {
//     type: DataTypes.STRING(255),
//     allowNull: true
//   }
// }, {
//   sequelize,
//   modelName: 'ccce_entry'
// });

// class EnglishTranslation extends Model {
//   public translationId: number;
//   public translation: string;
//   public entryId: number
// };


// Entry.hasMany(EnglishTranslation, {
//   sourceKey: 'entryId',
//   foreignKey: 'entryId',
//   as: 'translations to entry'
// });
