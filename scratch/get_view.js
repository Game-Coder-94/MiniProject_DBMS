const pool = require('../server/config/db');

async function getView() {
    try {
        const sql = `
            CREATE OR REPLACE VIEW v_main_feed AS
            SELECT p.pin_id,
                p.image_url,
                p.description,
                u.username AS pinner,
                m.mission_name,
                c.name AS space_object,
                c.object_type
            FROM pins p
            LEFT JOIN users u ON p.user_id = u.user_id
            LEFT JOIN missions m ON p.mission_id = m.mission_id
            LEFT JOIN celestial_objects c ON p.object_id = c.object_id;
        `;
        await pool.query(sql);
        console.log("View v_main_feed updated successfully.");
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

getView();
