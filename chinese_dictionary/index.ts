import { Sequelize, Model, DataTypes } from "sequelize";

const sequelize = new Sequelize('db_name', 'user', 'password', {
  host: 'host',
  dialect: 'dialect'
});

console.log('Beginning to attempt connection to database');

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (err) {
  console.error('Unable to connect to the database:', err);
}

sequelize
  .authenticate()
  .then(() => {
    
    readEntries();
  })
  .catch(err => {
    
  });

async function readEntries() {
  const entries = await Entry.findAll()
  console.log(`all entries: ${entries}`);
}

class Entry extends Model {
  public entryId: number;
  public simplified: string;
  public traditional: string;
  public pinyin: string;
};

Entry.init({
  //attributes
  entryId: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  simplified: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  traditional: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  pinyin: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'ccce_entry'
});

class EnglishTranslation extends Model {
  public translationId: number;
  public translation: string;
  public entryId: number
};

EnglishTranslation.init({
  //attributes
  translationId: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  translation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  entryId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'ccce_english_translation'
});

Entry.hasMany(EnglishTranslation, {
  sourceKey: 'entryId',
  foreignKey: 'entryId',
  as: 'translations to entry'
});

EnglishTranslation.belongsTo(Entry,  {targetKey: 'entryId'});
