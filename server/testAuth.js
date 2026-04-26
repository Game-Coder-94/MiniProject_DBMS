const { signup, login } = require('./controllers/authController');

(async () => {
    try {
        const mockSignupReq = {
            body: {
                username: 'test_astronaut_' + Date.now(),
                email: `test_${Date.now()}@nasa.gov`,
                password: 'supersecretpassword',
            }
        };

        const mockSignupRes = {
            status: (code) => ({
                json: (data) => {
                    console.log(`[SIGNUP] Status: ${code}`);
                    console.log(`[SIGNUP] Data:`, data);
                }
            })
        };

        console.log('--- Testing Signup ---');
        await signup(mockSignupReq, mockSignupRes);

        const mockLoginReq = {
            body: {
                email: mockSignupReq.body.email,
                password: 'supersecretpassword',
            }
        };

        const mockLoginRes = {
            status: (code) => ({
                json: (data) => {
                    console.log(`\n[LOGIN] Status: ${code}`);
                    console.log(`[LOGIN] Data:`, Object.keys(data).includes('token') ? 'Token received' : data);
                }
            })
        };

        console.log('\n--- Testing Login ---');
        await login(mockLoginReq, mockLoginRes);
    } catch(err) {
        console.error("Test failed:", err);
    } finally {
        setTimeout(() => process.exit(0), 1000);
    }
})();
