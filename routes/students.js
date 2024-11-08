import express from 'express';
const router = express.Router();

export default (db) => {
    // Rota GET para retornar todos os estudantes
    router.get('/', async (req, res) => {
        res.json(db.data.students); // Retorna todos os estudantes
    });
    

    // Rota GET para retornar um estudante específico
    router.get('/', async (req, res) => {
        await db.read(); // Ler o arquivo JSON atualizado
        res.json(db.data.students);
    });

    // Rota POST para adicionar um novo estudante
    router.post('/', async (req, res) => {
        const { name, course, year } = req.body;
        const newStudent = { id: Date.now(), name, course, year }; // Gerando o id no servidor
        db.data.students.push(newStudent);
        await db.write();  // Salva as alterações no db.json
        res.status(201).json(newStudent); // Retorna o estudante com o id gerado
    });
    

    // Rota PUT para atualizar um estudante
    router.put('/:id', async (req, res) => {
        const student = db.data.students.find(s => s.id === Number(req.params.id));

        if (!student) {
            return res.status(404).send('Student not found');
        }

        const { name, course, year } = req.body;
        if (!name || !course || !year) {
            return res.status(400).json({ error: 'Todos os campos (nome, curso, ano) são obrigatórios para atualizar.' });
        }

        Object.assign(student, req.body);  // Atualiza o estudante com as novas informações
        await db.write();  // Save changes to db.json
        res.json(student);
    });

    // Rota DELETE para remover um estudante
    router.delete('/:id', async (req, res) => {
        const studentIndex = db.data.students.findIndex(s => s.id === Number(req.params.id));

        if (studentIndex === -1) {
            return res.status(404).send('Student not found');
        }

        db.data.students.splice(studentIndex, 1);  // Remove o estudante
        await db.write();  // Salva as alterações no db.json
        res.status(204).end();  // Sucesso, sem conteúdo
    });

    return router;
};
