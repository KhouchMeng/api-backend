// models/user.js
import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const User = sequelize.define('e_coffee_shop', {
  proName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  banner: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
}, {
  tableName: 'tbl_product',
  timestamps: true,
});

export default User;
