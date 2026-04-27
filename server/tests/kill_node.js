const { exec } = require('child_process');
exec('netstat -ano | findstr :3000', (err, stdout) => {
    if (err) return console.error(err);
    const lines = stdout.split('\n');
    lines.forEach(line => {
        if(line.includes('LISTENING')) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            console.log("Killing PID:", pid);
            exec(`taskkill /F /PID ${pid}`, (e, so, se) => {
                console.log(so || se || e);
            });
        }
    });
});
