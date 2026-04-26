const { signup } = require('./controllers/authController');

const req = {
  body: {
    username: 'tester_' + Date.now(),
    email: 'test_' + Date.now() + '@example.com',
    password: 'password'
  }
};

const res = {
  status: (code) => ({
    json: (data) => {
      require('fs').writeFileSync('test_error.json', JSON.stringify({ code, data }, null, 2));
    }
  })
};

signup(req, res).then(() => setTimeout(() => process.exit(0), 1000));
