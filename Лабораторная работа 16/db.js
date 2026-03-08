const { getPool } = require('./config.js');

class DB {
    constructor() {
    }

    async _execute(query) {
        let pool;
        try {
            pool = getPool();
            if (!pool) throw new Error('Database pool not initialized.');
            
            const result = await pool.request().query(query);
            return result.recordset;
        } catch (err) {
            console.error('MSSQL Error:', err.message);
            throw new Error(`Error: ${err.message}`); 
        }
    }

    async getFaculties({faculty}) {
        let query = 'SELECT FACULTY AS faculty, FACULTY_NAME AS faculty_name FROM dbo.FACULTY';
        if (faculty) {
            query += ` WHERE FACULTY = '${faculty}'`;
        }
        return this._execute(query);
    }

    async getPulpits({ pulpit }) {
        let query = `SELECT 
                        RTRIM(PULPIT) AS pulpit, 
                        RTRIM(PULPIT_NAME) AS pulpit_name, 
                        RTRIM(FACULTY) AS faculty 
                     FROM dbo.PULPIT`;
        if (pulpit) {
            query += ` WHERE PULPIT = '${pulpit}'`;
        }
        return this._execute(query);
    }
    
    async getSubjects({ subject }) {
        let query = `SELECT 
                        RTRIM(SUBJECT) AS subject, 
                        RTRIM(SUBJECT_NAME) AS subject_name, 
                        RTRIM(PULPIT) AS pulpit 
                     FROM dbo.SUBJECT`;
        if (subject) {
            query += ` WHERE SUBJECT = '${subject}'`;
        }
        return this._execute(query);
    }

    async getTeachers({ teacher }) {
        let query = `SELECT 
                        RTRIM(TEACHER) AS teacher, 
                        RTRIM(TEACHER_NAME) AS teacher_name, 
                        RTRIM(PULPIT) AS pulpit 
                     FROM dbo.TEACHER`;
        if (teacher) {
            query += ` WHERE TEACHER = '${teacher}'`;
        }
        return this._execute(query);
    }
    
    async getTeachersByFaculty(facultyCode) {
        const query = `
            SELECT 
                RTRIM(t.TEACHER) AS teacher, 
                RTRIM(t.TEACHER_NAME) AS teacher_name, 
                RTRIM(t.PULPIT) AS pulpit 
            FROM dbo.TEACHER t
            JOIN dbo.PULPIT p ON t.PULPIT = p.PULPIT
            WHERE p.FACULTY = '${facultyCode}'
        `;
        return this._execute(query);
    }

    async getSubjectsByFaculties(facultyCode) {
        const query = `SELECT 
                        RTRIM(PULPIT) AS pulpit, 
                        RTRIM(PULPIT_NAME) AS pulpit_name, 
                        RTRIM(FACULTY) AS faculty 
                      FROM dbo.PULPIT 
                      WHERE FACULTY = '${facultyCode}'`;
        return this._execute(query);
    }

    async setFaculty(facultyInput) {
        const { faculty, faculty_name } = facultyInput;
        const existing = await this._execute(`SELECT FACULTY FROM dbo.FACULTY WHERE RTRIM(FACULTY) = '${faculty}'`); 
        
        let query;
        if (existing.length > 0) {
            query = `UPDATE dbo.FACULTY SET FACULTY_NAME = N'${faculty_name}' WHERE RTRIM(FACULTY) = '${faculty}'`;
        } else {
            query = `INSERT INTO dbo.FACULTY (FACULTY, FACULTY_NAME) VALUES ('${faculty}', N'${faculty_name}')`;
        }
        
        await this._execute(query);
        return (await this._execute(`SELECT RTRIM(FACULTY) AS faculty, RTRIM(FACULTY_NAME) AS faculty_name FROM dbo.FACULTY WHERE RTRIM(FACULTY) = '${faculty}'`))[0];
    }

    async setPulpit(pulpitInput) {
        const { pulpit, pulpit_name, faculty } = pulpitInput;
        const existing = await this._execute(`SELECT PULPIT FROM dbo.PULPIT WHERE RTRIM(PULPIT) = '${pulpit}'`);
        
        let query;
        if (existing.length > 0) {
            query = `UPDATE dbo.PULPIT SET pulpit_name = N'${pulpit_name}', faculty = '${faculty}' WHERE RTRIM(PULPIT) = '${pulpit}'`;
        } else {
            query = `INSERT INTO dbo.PULPIT (pulpit, pulpit_name, faculty) VALUES ('${pulpit}', N'${pulpit_name}', '${faculty}')`;
        }
        
        await this._execute(query);
        return (await this._execute(`SELECT RTRIM(PULPIT) AS pulpit, RTRIM(PULPIT_NAME) AS pulpit_name, RTRIM(FACULTY) AS faculty FROM dbo.PULPIT WHERE RTRIM(PULPIT) = '${pulpit}'`))[0];
    }

    async setSubject(subjectInput) {
        const { subject, subject_name, pulpit } = subjectInput;
        const existing = await this._execute(`SELECT subject FROM dbo.SUBJECT WHERE RTRIM(subject) = '${subject}'`);
        
        let query;
        if (existing.length > 0) {
            query = `UPDATE dbo.SUBJECT SET subject_name = N'${subject_name}', pulpit = '${pulpit}' WHERE RTRIM(subject) = '${subject}'`;
        } else {
            query = `INSERT INTO dbo.SUBJECT (subject, subject_name, pulpit) VALUES ('${subject}', N'${subject_name}', '${pulpit}')`;
        }
        
        await this._execute(query);
        return (await this._execute(`SELECT RTRIM(subject) AS subject, RTRIM(subject_name) AS subject_name, RTRIM(pulpit) AS pulpit FROM dbo.SUBJECT WHERE RTRIM(subject) = '${subject}'`))[0];
    }
    
    async setTeacher(teacherInput) {
        const { teacher, teacher_name, pulpit } = teacherInput;
        const existing = await this._execute(`SELECT teacher FROM dbo.TEACHER WHERE RTRIM(teacher) = '${teacher}'`);
        
        let query;
        if (existing.length > 0) {
            query = `UPDATE dbo.TEACHER SET teacher_name = N'${teacher_name}', pulpit = '${pulpit}' WHERE RTRIM(teacher) = '${teacher}'`;
        } else {
            query = `INSERT INTO dbo.TEACHER (teacher, teacher_name, pulpit) VALUES ('${teacher}', N'${teacher_name}', '${pulpit}')`;
        }
        
        await this._execute(query);
        return (await this._execute(`SELECT RTRIM(teacher) AS teacher, RTRIM(teacher_name) AS teacher_name, RTRIM(pulpit) AS pulpit FROM dbo.TEACHER WHERE RTRIM(teacher) = '${teacher}'`))[0];
    }

    async delFaculty(facultyCode) {
        const result = await this._execute(`DELETE FROM dbo.FACULTY WHERE RTRIM(faculty) = '${facultyCode}'`);
        return true;
    }

    async delPulpit(pulpitCode) {
        const result = await this._execute(`DELETE FROM dbo.PULPIT WHERE RTRIM(pulpit) = '${pulpitCode}'`);
        return true;
    }

    async delSubject(subjectCode) {
        const result = await this._execute(`DELETE FROM dbo.SUBJECT WHERE RTRIM(subject) = '${subjectCode}'`);
        return true;
    }
    
    async delTeacher(teacherCode) {
        const result = await this._execute(`DELETE FROM Teacher WHERE teacher = '${teacherCode}'`);
        return true;
    }
}

const database = new DB();
const resolver = {
        getFaculties: (args) => {return database.getFaculties(args)},
        getTeachers: (args) => {return database.getTeachers(args)}, 
        getPulpits: (args) => {return database.getPulpits(args)},
        getSubjects: (args) => {return database.getSubjects(args)},
        getTeachersByFaculty: ({ faculty }) => {return database.getTeachersByFaculty(faculty)},
        getSubjectsByFaculties: ({ faculty }) => {return database.getSubjectsByFaculties(faculty)},

        setFaculty: ({ faculty }) => {console.log(faculty); return database.setFaculty(faculty)},
        setPulpit: ({ pulpit }) => {return database.setPulpit(pulpit)},
        setSubject: ({ subject }) => {return database.setSubject(subject)},
        setTeacher: ({ teacher }) => {return database.setTeacher(teacher)},
        delFaculty: ({faculty}) => { return database.delFaculty(faculty)},
        delPulpit: ({ pulpit }) => {return database.delPulpit(pulpit)},
        delSubject: ({ subject }) => {return database.delSubject(subject)},
        delTeacher: ({ teacher }) => {return database.delTeacher(teacher)},
    
    Faculty: {
    pulpits: (parent) => {
            const trimmedFaculty = parent.faculty.trim(); 
      return database._execute(`SELECT 
                                    RTRIM(PULPIT) AS pulpit, 
                                    RTRIM(PULPIT_NAME) AS pulpit_name, 
                                    RTRIM(FACULTY) AS faculty 
                                  FROM dbo.PULPIT 
                                  WHERE FACULTY = '${trimmedFaculty}'`);
    }
  },
  
  Pulpit: {
    subjects: (parent) => {
             const trimmedPulpit = parent.pulpit.trim();
      return database._execute(`SELECT 
                                    RTRIM(SUBJECT) AS subject, 
                                    RTRIM(SUBJECT_NAME) AS subject_name, 
                                    RTRIM(PULPIT) AS pulpit 
                                  FROM dbo.SUBJECT 
                                  WHERE PULPIT = '${trimmedPulpit}'`);
    }
  }
};

exports.database = database;
exports.resolver = resolver;
