const http = require('http');
const fs = require('fs');
const url = require('url');
const { initPools, getPool } = require('./db');

let pool;

(async () => {
    try {
        await initPools();
        pool = getPool();
        console.log("DB pool initialized");

        const server = http.createServer(async (req, res) => {

            const parsed = url.parse(req.url, true);
            const method = req.method;
            const pathname = parsed.pathname;

    if (method === 'GET' && pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const html = fs.readFileSync('./14-01.html');
        res.end(html);
        return;
    }

    if (method === 'GET' && pathname === '/api/faculties') {
        try {
            const result = await pool.request().query("SELECT * FROM FACULTY");
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.recordset));
        } catch (err) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    if (method === 'GET' && pathname === '/api/pulpits') {
        try {
            const result = await pool.request().query("SELECT * FROM PULPIT");
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.recordset));
        } catch (err) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    if (method === 'GET' && pathname === '/api/subjects') {
        try {
            const result = await pool.request().query("SELECT * FROM SUBJECT");
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.recordset));
        } catch (err) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    if (method === 'GET' && pathname === '/api/auditoriumstypes') {
        try {
            const result = await pool.request().query("SELECT * FROM AUDITORIUM_TYPE");
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.recordset));
        } catch (err) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    if (method === 'GET' && pathname === '/api/auditoriums') {
        try {
            const result = await pool.request().query("SELECT * FROM AUDITORIUM");
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.recordset));
        } catch (err) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    if (method === 'POST' && pathname === '/api/faculties') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
          try {
              const data = JSON.parse(body);

              const sqlQuery = `
                  INSERT INTO FACULTY (FACULTY, FACULTY_NAME)
                  VALUES (@faculty, @fname)
              `;

              const result = await pool.request()
                  .input('faculty', data.faculty)
                  .input('fname', data.faculty_name)
                  .query(sqlQuery);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(data));
          } catch (e) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: e.message }));
          }
      });
      return;
    }

    if (method === 'POST' && pathname === '/api/pulpits') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
          try {
              const data = JSON.parse(body);

              const sqlQuery = `
                  INSERT INTO PULPIT (PULPIT, PULPIT_NAME, FACULTY)
                  VALUES (@pulpit, @pname, @faculty)
              `;

              const result = await pool.request()
                  .input('pulpit', data.pulpit)
                  .input('pname', data.pulpit_name)
                  .input('faculty', data.faculty)
                  .query(sqlQuery);

              if (result.rowsAffected[0] === 0) {
                res.end(JSON.stringify({ error: "PULPIT not found" }));
                return;
              }

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(data));
          } catch (e) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: e.message }));
          }
      });
      return;
    }

    if (method === 'POST' && pathname === '/api/subjects') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
          try {
              const data = JSON.parse(body);

              const sqlQuery = `
                  INSERT INTO SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT)
                  VALUES (@subject, @sname, @pulpit)
              `;

              const result = await pool.request()
                  .input('subject', data.subject)
                  .input('sname', data.subject_name)
                  .input('pulpit', data.pulpit)
                  .query(sqlQuery);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(data));
          } catch (e) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: e.message }));
          }
      });
      return;
    }

    
    if (method === 'POST' && pathname === '/api/auditoriumstypes') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
          try {
              const data = JSON.parse(body);

              const sqlQuery = `
                  INSERT INTO AUDITORIUM_TYPE (AUDITORIUM_TYPE, AUDITORIUM_TYPENAME)
                  VALUES (@auditoriumtype, @auditoriumtypename)
              `;

              const result = await pool.request()
                  .input('auditoriumtype', data.auditoriumtype)
                  .input('auditoriumtypename', data.auditoriumtypename)
                  .query(sqlQuery);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(data));
          } catch (e) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: e.message }));
          }
      });
      return;
    }

    if (method === 'POST' && pathname === '/api/auditoriums') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
          try {
              const data = JSON.parse(body);

              const sqlQuery = `
                  INSERT INTO AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_CAPACITY, AUDITORIUM_TYPE)
                  VALUES (@auditorium, @auditoriumname, @auditoriumcapacity, @auditoriumtype)
              `;

              const result = await pool.request()
                  .input('auditorium', data.auditorium)
                  .input('auditoriumname', data.auditoriumname)
                  .input('auditoriumcapacity', data.auditoriumcapacity)
                  .input('auditoriumtype', data.auditoriumtype)
                  .query(sqlQuery);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(data));
          } catch (e) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: e.message }));
          }
      });
      return;
    }

    if (method === 'PUT' && pathname === '/api/faculties') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);

                const sqlQuery = `
                    UPDATE FACULTY
                    SET FACULTY_NAME = @fname
                    WHERE FACULTY = @faculty
                `;

                await pool.request()
                    .input('faculty', data.faculty)
                    .input('fname', data.faculty_name)
                    .query(sqlQuery);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            } catch (e) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    if (method === 'PUT' && pathname === '/api/pulpits') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);

                const sqlQuery = `
                    UPDATE PULPIT
                    SET PULPIT_NAME = @pname,
                    FACULTY = @faculty  
                    WHERE PULPIT = @pulpit
                `;

                const result = await pool.request()
                .input('pulpit', data.pulpit)
                .input('pname', data.pulpit_name)
                .input('faculty', data.faculty)
                .query(sqlQuery);

                if (result.rowsAffected[0] === 0) {
                    res.end(JSON.stringify({ error: "PULPIT not found" }));
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            } catch (e) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    if (method === 'PUT' && pathname === '/api/subjects') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);

                const sqlQuery = `
                    UPDATE SUBJECT
                    SET SUBJECT_NAME = @sname,
                    PULPIT = @pulpit  
                    WHERE SUBJECT = @subject
                `;

                await pool.request()
                    .input('subject', data.subject)
                    .input('sname', data.subject_name)
                    .input('pulpit', data.pulpit)
                    .query(sqlQuery);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            } catch (e) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    if (method === 'PUT' && pathname === '/api/auditoriumstypes') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);

                const sqlQuery = `
                    UPDATE AUDITORIUM_TYPE
                    SET AUDITORIUM_TYPENAME = @sname
                    WHERE AUDITORIUM_TYPE = @auditoriumtype
                `;

                await pool.request()
                    .input('auditoriumtype', data.auditoriumtype)
                    .input('sname', data.auditoriumtypename)
                    .query(sqlQuery);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            } catch (e) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    if (method === 'PUT' && pathname === '/api/auditoriums') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);

                const sqlQuery = `
                    UPDATE AUDITORIUM
                    SET AUDITORIUM_NAME = @sname,
                    AUDITORIUM_TYPE = @auditoriumtype,
                    AUDITORIUM_CAPACITY = @auditoriumcapacity
                    WHERE AUDITORIUM = @auditorium
                `;

                await pool.request()
                    .input('auditoriumtype', data.auditoriumtype)
                    .input('sname', data.auditoriumname)
                    .input('auditoriumcapacity', data.auditoriumcapacity)
                    .input('auditorium', data.auditorium)
                    .query(sqlQuery);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            } catch (e) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    if (method === 'DELETE' && pathname.startsWith('/api/faculties/')) {
        const code = pathname.split('/')[3];

        try {
            const sqlQuery = `
                DELETE FROM FACULTY WHERE FACULTY = @code
            `;

            await pool.request().input('code', code).query(sqlQuery);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ deleted: code }));
        } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    if (method === 'DELETE' && pathname.startsWith('/api/pulpits/')) {
        const code = pathname.split('/')[3];

        try {
            const sqlQuery = `
                DELETE FROM PULPIT WHERE PULPIT = @code
            `;

            
            const result = await pool.request().input('code', code).query(sqlQuery);

            if (result.rowsAffected[0] === 0) {
                res.end(JSON.stringify({ error: "PULPIT not found" }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ deleted: code }));
        } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    if (method === 'DELETE' && pathname.startsWith('/api/subjects/')) {
        const code = pathname.split('/')[3];

        try {
            const sqlQuery = `
                DELETE FROM SUBJECT WHERE SUBJECT = @code
            `;

            await pool.request().input('code', code).query(sqlQuery);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ deleted: code }));
        } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    if (method === 'DELETE' && pathname.startsWith('/api/auditoriumstypes/')) {
        const code = pathname.split('/')[3];

        try {
            const sqlQuery = `
                DELETE FROM AUDITORIUM_TYPE WHERE AUDITORIUM_TYPE = @code
            `;

            await pool.request().input('code', code).query(sqlQuery);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ deleted: code }));
        } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    if (method === 'DELETE' && pathname.startsWith('/api/auditoriums/')) {
        const code = pathname.split('/')[3];

        try {
            const sqlQuery = `
                DELETE FROM AUDITORIUM WHERE AUDITORIUM = @code
            `;

            await pool.request().input('code', code).query(sqlQuery);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ deleted: code }));
        } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    } 
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Route not found" }));
});
    server.listen(4000, () => console.log("Server started on port 4000"));
}
catch (err) {
    console.error("INIT ERROR:", err);
}})();
