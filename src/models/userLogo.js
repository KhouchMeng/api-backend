// models/user.js
import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const User = sequelize.define('e_coffee_shop', {
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
}, {
  tableName: 'tbl_logo',
  timestamps: true,
});

export default User;
