import pool from '../config/db.js';

export const getCoursesWithDetails = async () => {
  const query = `
    SELECT json_build_object(
        'total_all_course_xp',
        (
            SELECT SUM(totalxp)
            FROM course
        ),
        'courses',
        (
            SELECT json_agg(
                json_build_object(
                    'course_id', c.id,
                    'data',
                    json_build_object(
                        'title', c.title,
                        'content', c.content,
                        'deskripsi_title', c.deskripsi_title,
                        'total_xp', c.totalxp,
                        'questions',
                        (
                            SELECT json_agg(
                                json_build_object(
                                    'no', q.id,
                                    'question', q.question,

                                    'question_options',
                                    (
                                        SELECT json_agg(
                                            json_build_object(
                                                'id', qo.id,
                                                'question_option', qo.question_option
                                            )
                                        )
                                        FROM questions_options qo
                                        WHERE qo.questions_id = q.id
                                    )
                                )
                            )
                            FROM questions q
                            INNER JOIN quizzes qu
                                ON qu.id = q.quizzes_id
                            WHERE qu.course_id = c.id
                        )
                    )
                )
            )
            FROM course c
        )
    ) AS result;
  `;
  const result = await pool.query(query);
  return result.rows[0]?.result; 
};

export const getCourseXpById = async (courseId) => {
  const query = 'SELECT totalxp FROM course WHERE id = $1';
  const result = await pool.query(query, [courseId]);
  return result.rows[0];
};

export const getTotalCourseXp = async () => {
  const query = 'SELECT SUM(totalxp) as total_xp FROM course';
  const result = await pool.query(query);
  return result.rows[0]?.total_xp || 0;
};
