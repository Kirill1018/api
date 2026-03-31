import sql from 'mssql'
const subjTyp = ['passSubj', 'currSubj']
const config = {
    server: 'DESKTOP-NEUQAJ1\\SQLEXPRESS',
    database: 'electronic diary',
    options: { trustServerCertificate: true },
    user: 'sa',
    password: 'Sql-031'
}
const csrfProt = 'qwerty'
const acSubj = ['passSubj', 'currSubj']
class Query {
    static async execute(query) {
        await sql.connect(config)
        const result = await sql.query(query)
        return result.recordset
    }
}
export class User {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const user = await Query.execute(`select username, groupId from users where Id = ${req.query.id}`)
        if (user.length > 0) res.send(user[0])
        }
    }
}
class Subject {
    static select(type, group) { return `select Id, name, userId from ${type} where groupId = ${group}` }
}
export class PassSubj {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const passSubj = await Query.execute(`${Subject.select(subjTyp[0], req.query.group)} and isArch = 'false'`)
        res.send(passSubj)
    }
}
}
export class CurrSubj {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const currSubj = await Query.execute(Subject.select(subjTyp[1], req.query.group))
        res.send(currSubj)
    }
}
}
export class Lesson {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const lessons = await Query.execute(`select Id, date, theme from lessons where isPass = 'true' and subjId = ${req.query.subject}`)
        res.send(lessons)
    }
}
}
export class Mark {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const query = req.query
        const mark = await Query.execute(`select number from marks where lessId = ${query.lesson} and userId = ${query.user}`)
        if (mark.length > 0) { res.send(mark[0]) }
        else res.send({ number: null })
    }
}
}
export class Checking {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const homeworks = await Query.execute(`select homId, comment, mark from checking where userId = ${req.query.user}`)
        res.send(homeworks)
    }
}
}
export class Homework {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const homework = await Query.execute(`select task, lessId, deadline from homeworks where Id = ${req.query.id}`)
        if (homework.length > 0) res.send(homework[0])
        }
    }
}
export class LessById {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const lesson = await Query.execute(`select subjId, date, theme from lessons where Id = ${req.query.id}`)
        if (lesson.length > 0) res.send(lesson[0])
        }
    }
}
class SubjById {
    static select(type, id) { return `select userId from ${type} where Id = ${id}` }
}
export class PassSubjById {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const subject = await Query.execute(SubjById.select(subjTyp[0], req.query.id))
        res.send(subject)
    }
}
}
export class CurrSubjById {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const subject = await Query.execute(SubjById.select(subjTyp[1], req.query.id))
        res.send(subject)
    }
}
}
export class HomByLess {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const homeworks = await Query.execute(`select Id from homeworks where lessId = ${req.query.lesson}`)
        res.send(homeworks)
    }
}
}
export class CheckIn {
    static async post(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const body = req.body
        const user = await Query.execute(`select Id, username, password from users where username = '${body.username}' and password = '${body.password}' and isStud = 'true'`)
        if (user.length > 0) res.send(user[0])
        }
    }
}
export class File {
    static post(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const body = req.body
        sql.connect(config).then(pool => pool.request().input('binFile', sql.VarBinary(sql.MAX), req.files.file.data).query(`insert into checking(userId, homId, binFile, lodgeName) values(${body.userId}, ${body.homId}, @binFile, '${body.lodgeName}')`))
        res.send('файл отправлен')
    }
}
}
export class Work {
    static async post(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const body = req.body
        await Query.execute(`insert into checking(userId, homId, content) values(${body.userId}, ${body.homId}, '${body.content}')`)
        res.send('домашняя работа отправлена')
    }
}
}
export class PassSubjOfJourn {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const passSubj = await Query.execute(`select Id, name, groupId, isArch from ${acSubj[0]} where isArch = 'false'`)
        res.send(passSubj)
    }
}
}
export class CurrSubjOfJourn {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const currSubj = await Query.execute(`select Id, name, groupId from ${acSubj[1]}`)
        res.send(currSubj)
    }
}
}
class GroupById {
    static select(id) { return `select Id, name from groups where Id = ${id}` }
}
export class JournGroupById {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const group = await Query.execute(GroupById.select(req.query.id))
        if (group.length > 0) res.send(group[0])
    }
}
}
export class JournGroup {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const groups = await Query.execute(`select Id, name from groups where isArch = 'false'`)
        res.send(groups)
    }
}
}
export class JournGroupByName {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const group = await Query.execute(`select Id from groups where name = '${req.query.name}'`)
        res.send(group)
    }
}
}
export class CurrSubjOfJournByUser {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const currSubj = await Query.execute(`select groupId from currSubj where userId = ${req.query.user}`)
        res.send(currSubj)
    }
}
}
export class JournGroupOutOfArch {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const group = await Query.execute(`${GroupById.select(req.query.id)} and isArch = 'false'`)
        if (group.length > 0) { res.send(group[0]) }
        else res.send({ name: null })
    }
}
}
export class JournUserByGroup {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const students = await Query.execute(`select Id, username from users where groupId = ${req.query.group}`)
        res.send(students)
    }
}
}
export class JournUser {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const students = await Query.execute(`select Id, username from users where isStud = 'true' and groupId is null`)
        res.send(students)
    }
}
}
export class JournLess {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const lessons = await Query.execute(`select subjId from lessons where isPass = 'true'`)
        res.send(lessons)
    }
}
}
export class JournSubj {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) { for (let subjType of acSubj) {
        const subject = await Query.execute(`select Id, name, groupId, userId from ${subjType} where Id = ${req.query.id}`)
        if (subject.length > 0) res.send(subject[0])
    }
}
}
}
export class JournLessBySubj {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const lessons = await Query.execute(`select Id, date, theme from lessons where subjId = ${req.query.subject}`)
        res.send(lessons)
    }
}
}
export class JournCheck {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const homeworks = await Query.execute('select Id, userId, homId, binFile, lodgeName, content, comment, mark from checking')
        res.send(homeworks)
    }
}
}
export class JournUserById {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const student = await Query.execute(`select username from users where Id = ${req.query.id}`)
        if (student.length > 0) res.send(student[0])
    }
}
}
export class JournHomById {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const homework = await Query.execute(`select task, lessId from homeworks where Id = ${req.query.id}`)
        if (homework.length > 0) res.send(homework[0])
    }
}
}
export class JournLessById {
    static async get(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const lesson = await Query.execute(`select subjId, date, theme from lessons where Id = ${req.query.id}`)
        if (lesson.length > 0) res.send(lesson[0])
    }
}
}
export class Journal {
    static async post(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const body = req.body
        const user = await Query.execute(`select Id, username, password from users where username = '${body.username}' and password = '${body.password}' and isTeach = 'true'`)
        if (user.length > 0) res.send(user[0])
    }
}
}
export class SubjArchOfJourn {
    static async post(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        await Query.execute(`update ${acSubj[0]} set isArch = 'true' where Id = ${req.body.id}`)
        res.send('предмет переведён в архивный статус')
    }
}
}
export class CurrSubjOfJournByName {
    static async post(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const body = req.body
        const currSubj = await Query.execute(`select Id from ${acSubj[1]} where name = '${body.name}' and groupId = ${body.groupId}`)
        res.send(currSubj)
    }
}
}
export class EdJournSubj {
    static async post(req) { if (req.headers['csrf-prot'] === csrfProt) {
        const body = req.body
        for (let subjects of acSubj) await Query.execute(`update ${subjects} set name = '${body.name}', groupId = ${body.groupId} where Id = ${body.id}`)
    }
}
}
export class AddJournSubj {
    static async post(req) { if (req.headers['csrf-prot'] === csrfProt) {
        const body = req.body
        await Query.execute(`insert into ${acSubj[1]}(name, groupId, userId) values('${body.name}', ${body.groupId}, ${body.id})`)
    }
}
}
export class GroupArchOfJourn {
    static async post(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        await Query.execute(`update groups set isArch = 'true' where Id = ${req.body.Id}`)
        res.send('статус группы изменён на архивный')
    }
}
}
export class EdJournGroup {
    static async post(req) { if (req.headers['csrf-prot'] === csrfProt) {
        const body = req.body
        await Query.execute(`update groups set name = '${body.name}' where Id = ${body.id}`)
    }
}
}
export class JournExc {
    static async post(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        await Query.execute(`update users set groupId = null where Id = ${req.body.Id}`)
        res.send('студент исключён')
    }
}
}
export class JournIncl {
    static async post(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const body = req.body
        await Query.execute(`update users set groupId = ${body.groupId} where Id = ${body.id}`)
        res.send('студент включён в группу')
    }
}
}
export class CreatJournGroup {
    static async post(req) { if (req.headers['csrf-prot'] === csrfProt) await Query.execute(`insert into groups(name, isArch) values('${req.body.name}', 'false')`) }
}
export class JournHom {
    static async post(req) { if (req.headers['csrf-prot'] === csrfProt) {
        const body = req.body
        await Query.execute(`insert into homeworks(task, lessId, deadline) values('${body.task}', ${body.lessId}, '${body.deadline}')`)
    }
}
}
export class JournComm {
    static async post(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const body = req.body
        await Query.execute(`update checking set comment = '${body.comment}' where Id = ${body.id}`)
        res.send('комментарий отправлен')
    }
}
}
export class JournMark {
    static async post(req, res) { if (req.headers['csrf-prot'] === csrfProt) {
        const body = req.body
        await Query.execute(`update checking set mark = ${body.mark} where Id = ${body.id}`)
        res.send('оценка отправлена')
    }
}
}