import { getAllUsers, getUserByUsername, updateUserSaldo, getUserById, updateUserProfile } from '../models/userModel.js';
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      success: true,
      message: 'Successfully retrieved user data',
      data: users.map(u => ({ ...u, saldo_virtual: u.saldo_virtual !== undefined ? Number(u.saldo_virtual) : 0 }))
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
      data: { ...user, saldo_virtual: user.saldo_virtual !== undefined ? Number(user.saldo_virtual) : 0 }
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
      data: { ...updatedUser, saldo_virtual: updatedUser.saldo_virtual !== undefined ? Number(updatedUser.saldo_virtual) : 0 }
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

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username } = req.body;

    if (!name || !username) {
      return res.status(400).json({
        success: false,
        message: 'Name and username are required'
      });
    }

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let updateUsernameTimestamp = false;

    if (username !== user.username) {
      // Check if username can be updated (14 days rule)
      if (user.last_username_change) {
        const lastChangeDate = new Date(user.last_username_change);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - lastChangeDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        if (diffDays < 14) {
          return res.status(400).json({
            success: false,
            message: `Username can only be changed once every 14 days. You must wait ${14 - diffDays} more day(s).`
          });
        }
      }
      
      // Also verify if the new username is already taken
      const existingUser = await getUserByUsername(username);
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken'
        });
      }

      updateUsernameTimestamp = true;
    }

    const updatedUser = await updateUserProfile(id, name, username, updateUsernameTimestamp);

    res.status(200).json({
      success: true,
      message: 'Successfully updated user profile',
      data: { ...updatedUser, saldo_virtual: updatedUser.saldo_virtual !== undefined ? Number(updatedUser.saldo_virtual) : 0 }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
      error: error.message
    });
  }
};
