import { getAllUsers, getUserByUsername, updateUserSaldo } from '../models/userModel.js';

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      success: true,
      message: 'Successfully retrieved user data',
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user data',
      error: error.message
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully retrieved user data',
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user data',
      error: error.message
    });
  }
};

export const updateSaldo = async (req, res) => {
  try {
    const { id } = req.params;
    const { saldo_virtual } = req.body;

    if (saldo_virtual === undefined) {
      return res.status(400).json({
        success: false,
        message: 'saldo_virtual is required'
      });
    }

    const updatedUser = await updateUserSaldo(id, saldo_virtual);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully updated virtual balance',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating virtual balance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update virtual balance',
      error: error.message
    });
  }
};
