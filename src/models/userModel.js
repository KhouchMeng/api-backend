// models/user.js
import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const User = sequelize.define('e_coffee_shop', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
   
  },
  profile: {
    type: DataTypes.STRING,
    allowNull: false,  // Set this to 'true' if you want to allow null values
  },
}, {
  tableName: 'users',
  timestamps: true,
});

export default User;
