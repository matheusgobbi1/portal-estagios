# Portal de Estágios

Bem-vindo ao repositório do **Portal de Estágios**! Este projeto é uma aplicação completa para gestão de vagas, empresas e estudantes, utilizando React no frontend, Spring Boot no backend e PostgreSQL como banco de dados.

---

## 📦 Estrutura do Projeto

```
projeto-faculdade/
├── backend/                # Backend Spring Boot
├── frontend/               # Frontend React
├── portal_estagios_backup.sql  # Backup do banco de dados PostgreSQL
└── README.md               # Este arquivo
```

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** React + TypeScript
- **Backend:** Spring Boot (Java 17)
- **Banco de Dados:** PostgreSQL
- **Gerenciadores:** Maven, npm

---

## ⚙️ Pré-requisitos

- Java 17+
- Node.js 16+
- PostgreSQL 12+
- Maven
- npm
- pgAdmin 4 (opcional, para restaurar o banco)

---

## 🗄️ Configuração do Banco de Dados

1. Instale o PostgreSQL e crie um banco chamado `portal_estagios`.
2. Abra o **pgAdmin 4**.
3. Clique com o botão direito no banco `portal_estagios` > **Restore...**
4. Selecione o arquivo [`portal_estagios_backup.sql`](./portal_estagios_backup.sql) e conclua o processo.

---

## 🖥️ Como rodar o Backend

```bash
cd backend/portal-estagios
mvn clean install
mvn spring-boot:run -Dspring.profiles.active=prod
```

- O backend ficará disponível em: [http://localhost:8080](http://localhost:8080)
- Documentação da API: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## 💻 Como rodar o Frontend

```bash
cd frontend
npm install
npm run build
npm install -g serve # (se ainda não tiver)
serve -s build
```

- O frontend ficará disponível em: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Credenciais de Teste

| Tipo          | Email                   | Senha    |
| ------------- | ----------------------- | -------- |
| Administrador | admin@admin.com         | admin123 |
| Empresa       | empresa@empresa.com     | admin123 |
| Estudante     | estudante@estudante.com | admin123 |

---

## 📝 Observações Importantes

- Não é necessário enviar a pasta `node_modules`.
- O arquivo `portal_estagios_backup.sql` deve estar na raiz do projeto.
- As portas padrão são: **8080** (backend) e **3000** (frontend).
- Se mudar usuário/senha do PostgreSQL, ajuste em `backend/portal-estagios/src/main/resources/application-prod.properties`.

---

## 🆘 Suporte e Dúvidas

Se tiver qualquer problema:

- Verifique se todos os serviços estão rodando
- Confira as portas e credenciais
- Consulte este README


---


