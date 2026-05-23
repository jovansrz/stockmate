import { getCoursesWithDetails, getCourseXpById } from '../models/courseModel.js';
import { addUserXp } from '../models/userModel.js';

export const getCourses = async (req, res) => {
  try {
    const data = await getCoursesWithDetails();
    
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'No courses found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully retrieved courses',
      data: data
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve courses',
      error: error.message
    });
  }
};

export const completeCourse = async (req, res) => {
  try {
    const userId = req.user.id; // Diperoleh dari verifyToken middleware
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required' });
    }

    // Ambil XP dari tabel course
    const course = await getCourseXpById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Tambahkan XP ke user
    const updatedUser = await addUserXp(userId, course.totalxp);

    res.status(200).json({
      success: true,
      message: 'Successfully added XP to user',
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        Xp: updatedUser.totalxp + '%'
      }
    });
  } catch (error) {
    console.error('Error adding XP to user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add XP to user',
      error: error.message
    });
  }
};
