const axios = require('axios');
const pool = require('../config/db'); // Your PG connection from the previous step

async function seedSpaceData(searchQuery) {
    try {
        // 1. Fetch from NASA Library
        const response = await axios.get(`https://images-api.nasa.gov/search?q=${searchQuery}&media_type=image`);
        const items = response.data.collection.items.slice(0, 10); // Grab top 10 results

        for (let item of items) {
            const info = item.data[0];
            const image = item.links[0].href;
            
            // 2. Simple logic to determine subtype for your Class Table Inheritance
            let objType = 'N'; // Default to Nebula
            if (info.keywords?.some(k => k.toLowerCase().includes('planet'))) objType = 'P';
            if (info.keywords?.some(k => k.toLowerCase().includes('galaxy'))) objType = 'G';

            // 3. Call your Stored Procedure
            console.log(`Ingesting: ${info.title}...`);
            await pool.query(
                'CALL add_nasa_pin($1::INT, $2::INT, $3::TEXT, $4::TEXT, $5::VARCHAR, $6::CHAR, $7::NUMERIC, $8::NUMERIC)',
                [
                    1,              // user_id (Assign to your admin user)
                    1,              // mission_id (Assign to a default mission)
                    image,          // p_img_url
                    info.description.substring(0, 500), // p_desc (trimming for safety)
                    info.title,     // p_obj_name
                    objType,        // p_obj_type ('P', 'G', or 'N')
                    null,           // mass (NASA API requires secondary lookup for metrics)
                    null            // dist (NASA API requires secondary lookup for metrics)
                ]
            );
        }
        console.log("Ingestion Complete!");
    } catch (err) {
        console.error("Ingestion Failed:", err.message);
    }
}

// Run it for "Mars" or "Andromeda"
// seedSpaceData('Andromeda');