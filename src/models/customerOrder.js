// models/user.js
import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const User = sequelize.define('e_coffee_shop', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productOrder: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
}, {
  tableName: 'tbl_customer',
  timestamps: true,
});

export default User;
