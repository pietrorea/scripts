import { Sequelize, DataTypes } from 'sequelize';
import { Table, Column, Model, AutoIncrement, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'ccce_english_translation',
  modelName: 'ccce_english_translation',
  timestamps: false
})

export default class EnglishTranslation extends Model<EnglishTranslation> {
  
}

// EnglishTranslation.init({
//   //attributes
//   translationId: {
//     type: DataTypes.INTEGER.UNSIGNED,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   translation: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   entryId: {
//     type: DataTypes.INTEGER.UNSIGNED,
//     allowNull: true
//   }
// }, {
//   sequelize,
//   modelName: 'ccce_english_translation'
// });


// EnglishTranslation.belongsTo(Entry,  {targetKey: 'entryId'});
