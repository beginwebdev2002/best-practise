---
technology: Express.js
domain: backend
level: Senior/Architect
version: "4.x / 5.x"
tags: [best-practices, clean-code, expressjs, vibe-coding, cursor-rules, javascript, typescript, software-architecture, system-design, mvc, production-ready, programming-standards, node-js, design-patterns, scalable-code, windsurf-rules, ai-coding, enterprise-patterns, backend]
ai_role: Senior Express.js Backend Expert
last_updated: 2026-03-23
---

<div align="center">
  <img src="https://cdn.simpleicons.org/express/000000" width="100" alt="ExpressJS Logo">
  
  # 🚂 Express.js Production-Ready Best Practices
</div>

---

Этот документ описывает **лучшие практики (best practices)** для архитектуры Express.js. Фреймворк крайне нетребователен к структуре (unopinionated), поэтому соблюдение этих 30 строгих правил критично для поддержания чистоты и безопасности энтерпрайз-кода.

# Context & Scope
- **Primary Goal:** Предоставить жесткий архитектурный каркас MVC и 30 паттернов для создания безопасных Express.js API.
- **Target Tooling:** AI-агенты (Cursor, Windsurf, Copilot) и Senior-разработчики.
- **Tech Stack Version:** Express 4.x / 5.x

> [!IMPORTANT]
> **Архитектурный стандарт (Contract):** Никогда не пишите бизнес-логику в роутерах. Строго разделяйте ответственности на `Router`, `Controller` и `Service`.

---

## 1. Controller / Route Decoupling
### ❌ Bad Practice
```javascript
app.post('/api/users', async (req, res) => {
  /* бизнес-логика здесь */
});
```
### ✅ Best Practice
```javascript
router.post('/api/users', UserController.create);

class UserController {
  static async create(req, res, next) { /* делегация в сервис */ }
}
```
### 🚀 Solution
Роутер только описывает эндпоинты, Контроллер извлекает данные запроса и отдает ответ. Логика — в Сервисах.

## 2. Async/Await Error Wrapping (Express 4)
### ❌ Bad Practice
```javascript
router.get('/', async (req, res) => { throw new Error('Crash'); }); // Express 4 не ловит rejection
```
### ✅ Best Practice
```javascript
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
router.get('/', asyncHandler(UserController.get));
```
### 🚀 Solution
В Express 4 всегда оборачивайте async-маршруты в `asyncHandler`, чтобы пробрасывать ошибки в глобальный Error Handler. (В Express 5 это встроено).

## 3. Global Error Handler Middleware
### ❌ Bad Practice
```javascript
app.use((req, res) => res.status(404).send('Not Found')); // Нет ловца ошибок 500
```
### ✅ Best Practice
```javascript
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});
```
### 🚀 Solution
Определите единую middleware с 4 аргументами `(err, req, res, next)` в самом конце пайплайна для перехвата всех сбоев.

## 4. Request Payload Validation (Joi / Zod)
### ❌ Bad Practice
```javascript
if (!req.body.email || req.body.age < 18) return res.status(400); // Ручная проверка
```
### ✅ Best Practice
```javascript
const validate = schema => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json(error.details);
  next();
};
router.post('/', validate(userSchema), UserController.create);
```
### 🚀 Solution
Проверяйте тело и параметры запросов на уровне Middleware с помощью надежных библиотек валидации (Joi, Zod), не пуская мусор в контроллеры.

## 5. Environment Variables separation
### ❌ Bad Practice
```javascript
mongoose.connect('mongodb://admin:pass@host/db'); // Хардкод секретов
```
### ✅ Best Practice
```javascript
require('dotenv').config();
mongoose.connect(process.env.DB_URI);
```
### 🚀 Solution
Используйте `dotenv` и конфигурационные файлы для разных окружений. Секреты хранятся только в `.env` (который добавлен в `.gitignore`).

## 6. HTTP Security Headers (Helmet)
### ❌ Bad Practice
// Приложение светит 'X-Powered-By: Express'
### ✅ Best Practice
```javascript
const helmet = require('helmet');
app.use(helmet());
```
### 🚀 Solution
Используйте `helmet` для автоматической защиты от XSS, clickjacking и скрытия заголовков фреймворка из коробки.

## 7. Cross-Origin Resource Sharing (CORS)
### ❌ Bad Practice
```javascript
app.use((req, res, next) => { res.header("Access-Control-Allow-Origin", "*"); next(); });
```
### ✅ Best Practice
```javascript
const cors = require('cors');
app.use(cors({ origin: 'https://myapp.com', credentials: true }));
```
### 🚀 Solution
Используйте официальный модуль `cors`. Разрешайте доступ только доверенным доменам, а не всем подряд (`*`).

## 8. Rate Limiting (Защита от DDoS)
### ❌ Bad Practice
// API открыт для миллиона запросов в секунду
### ✅ Best Practice
```javascript
const rateLimit = require('express-rate-limit');
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```
### 🚀 Solution
Защищайте все эндпоинты (а особенно авторизацию) встроенным лимитером запросов.

## 9. Body Parsing & Payload Limits
### ❌ Bad Practice
```javascript
app.use(express.json()); // Злоумышленник может отправить 500Мб JSON
```
### ✅ Best Practice
```javascript
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
```
### 🚀 Solution
Строго ограничивайте размер принимаемого JSON через опцию `limit`, чтобы предотвратить исчерпание RAM.

## 10. Centralized Logging (Morgan + Winston)
### ❌ Bad Practice
```javascript
console.log('User signed in'); 
```
### ✅ Best Practice
```javascript
app.use(morgan('combined', { stream: winstonLogger.stream }));
winstonLogger.info('User signed in');
```
### 🚀 Solution
Заменяйте `console.log` на логгеры вроде Winston (с уровнями log/warn/error) и Morgan (для фиксации HTTP-запросов).

## 11. Database Connection Management
### ❌ Bad Practice
```javascript
// Коннект к базе делается перед каждым запросом
```
### ✅ Best Practice
```javascript
mongoose.connect(process.env.DB_URI).then(() => {
  app.listen(3000, () => console.log('Server running'));
});
```
### 🚀 Solution
Открывайте единый пул подключений к БД (Connection Pool) при запуске приложения и используйте его во всех контроллерах.

## 12. JWT Authentication Middleware
### ❌ Bad Practice
```javascript
// Проверка токена встроена в контроллер профиля
```
### ✅ Best Practice
```javascript
const authGuard = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Auth required' });
  req.user = jwt.verify(token, process.env.SECRET);
  next();
};
```
### 🚀 Solution
Аутентификация должна представлять собой изолированную Middleware, которая вешается на защищенные маршруты и прикрепляет объект `req.user`.

## 13. Role-Based Access Control (RBAC) Middleware
### ❌ Bad Practice
```javascript
if (req.user.role !== 'admin') return res.status(403);
```
### ✅ Best Practice
```javascript
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
  next();
};
router.delete('/:id', requireRole('admin', 'manager'), Controller.del);
```
### 🚀 Solution
Доступ к маршрутам по ролям должен задаваться декларативно через Middleware.

## 14. Standard API Response Wrapper
### ❌ Bad Practice
```javascript
res.json({ foo: 'bar' }); // Каждый метод возвращает случайную структуру
```
### ✅ Best Practice
```javascript
class ApiResponse {
  static success(res, data, status = 200) { res.status(status).json({ success: true, data }); }
  static error(res, message, status = 400) { res.status(status).json({ success: false, error: message }); }
}
```
### 🚀 Solution
Используйте единый класс-утилиту для отправки ответов, чтобы клиент всегда ожидал `success` и `data`/`error` поля.

## 15. Pagination details in API
### ❌ Bad Practice
```javascript
res.json(users); // Выбросить миллион записей
```
### ✅ Best Practice
```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
res.json({ data: users, meta: { total, page, limit, pages: Math.ceil(total/limit) } });
```
### 🚀 Solution
Любой список сущностей обязан иметь пагинацию (Offset или Cursor) и секцию `meta` в ответе.

## 16. Graceful Shutdown
### ❌ Bad Practice
// При получении SIGTERM сервер моментально обрывает процессы
### ✅ Best Practice
```javascript
process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close(false, () => process.exit(0));
  });
});
```
### 🚀 Solution
Корректно закрывайте активные HTTP-сессии и пулы подключений к БД перед остановкой контейнера.

## 17. 404 Route Handler
### ❌ Bad Practice
// Если роут не найден, возвращается пустая белая страница
### ✅ Best Practice
```javascript
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});
```
### 🚀 Solution
Поместите этот обработчик ПОСЛЕ всех ваших маршрутов (но ДО глобального обработчика ошибок).

## 18. Application Structure (Folder organization)
### ❌ Bad Practice
```
/routes.js
/app.js  // Монолит на 5000 строк
```
### ✅ Best Practice
```
src/
  ├── controllers/
  ├── services/
  ├── models/
  ├── middlewares/
  ├── routes/
```
### 🚀 Solution
Строго разделяйте проект на логические папки. Имплементируйте многослойную архитектуру.

## 19. Health Check Endpoint
### ❌ Bad Practice
// Нет проверки жизнеспособности подов Kubernetes
### ✅ Best Practice
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', uptime: process.uptime() });
});
```
### 🚀 Solution
Всегда имейте эндпоинт `/health` для систем мониторинга, балансировщиков и Health Probes.

## 20. Data Sanitization (XSS / NoSQL Injection)
### ❌ Bad Practice
```javascript
User.find({ username: req.body.username }); // body.username = { "$gt": "" }
```
### ✅ Best Practice
```javascript
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
app.use(mongoSanitize());
app.use(xss());
```
### 🚀 Solution
Защищайте БД от NoSQL-инъекций и XSS скриптов, очищая `req.body` и `req.query`.

## 21. Swagger / OpenAPI documentation
### ❌ Bad Practice
// Документация в стороннем Word-файле
### ✅ Best Practice
```javascript
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```
### 🚀 Solution
Генерируйте или обслуживайте API-документацию прямо в приложении (Swagger, OpenAPI).

## 22. Manual Dependency Injection
### ❌ Bad Practice
```javascript
const UserService = require('./UserService'); // Прямой импорт, невозможно тестировать
```
### ✅ Best Practice
```javascript
class UserController {
  constructor(userService) { this.userService = userService; }
}
const controller = new UserController(new UserService(db));
```
### 🚀 Solution
Если не используете IoC (Awilix), инжектируйте зависимости вручную для облегчения Unit-тестирования.

## 23. File Uploads (Multer)
### ❌ Bad Practice
// Парсинг бинарников руками
### ✅ Best Practice
```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });
router.post('/avatar', upload.single('file'), Controller.upload);
```
### 🚀 Solution
Используйте `multer` с обязательным ограничением размера файла (`limits`), чтобы обезопасить сервер от переполнения диска.

## 24. Event Emitters (Фоновые задачи)
### ❌ Bad Practice
```javascript
await emailService.send(); // Блокировка респонса
res.send('Welcome');
```
### ✅ Best Practice
```javascript
const EventEmitter = require('events');
const myEmitter = new EventEmitter();
myEmitter.on('user_registered', emailService.send);

myEmitter.emit('user_registered', user);
res.send('Welcome');
```
### 🚀 Solution
Снимайте длительные задачи с основного потока ответа с помощью нативных Events NodeJS.

## 25. Caching (Redis Middleware)
### ❌ Bad Practice
// БД обрабатывает сложные расчеты на каждый хит
### ✅ Best Practice
```javascript
const cacheMiddleware = (req, res, next) => {
  redis.get(req.path, (err, data) => {
    if (data) return res.json(JSON.parse(data));
    next();
  });
}
```
### 🚀 Solution
Используйте кэширование (Redis) для GET-запросов, результат которых меняется редко.

## 26. Custom Error Classes
### ❌ Bad Practice
```javascript
throw new Error('Not found');
```
### ✅ Best Practice
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
throw new AppError('User not found', 404);
```
### 🚀 Solution
Создавайте кастомные классы ошибок, чтобы глобальный логгер мог отличать операционные ошибки (Operational) от фатальных крашей кода.

## 27. Proxy Trust in Production
### ❌ Bad Practice
```javascript
req.ip // Дает '127.0.0.1' через Nginx
```
### ✅ Best Practice
```javascript
app.set('trust proxy', 1); // Доверяем первому прокси
```
### 🚀 Solution
Если Express стоит за Nginx / AWS ELB, включите `trust proxy`, чтобы получать реальные IP пользователей.

## 28. Separating Server from App
### ❌ Bad Practice
```javascript
// app.js
app.listen(3000); // Мешает интеграционным тестам
```
### ✅ Best Practice
```javascript
// app.js
module.exports = app;

// server.js
const app = require('./app');
app.listen(3000);
```
### 🚀 Solution
Экспортируйте Express App отдельно от `listen`, чтобы `supertest` мог легко запускать тесты на случайных портах.

## 29. UUID Request Correlation
### ❌ Bad Practice
// Ошибки в логах невозможно связать с конкретным пользователем
### ✅ Best Practice
```javascript
const { v4: uuidv4 } = require('uuid');
app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-Id', req.id);
  next();
});
```
### 🚀 Solution
Устанавливайте уникальный ID каждому запросу для отслеживания его пути по всем логам и микросервисам.

## 30. Secure Session Management
### ❌ Bad Practice
// Сессия хранится в памяти (MemoryStore) с открытыми куками
### ✅ Best Practice
```javascript
app.use(session({
  secret: 'super-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true }
}));
```
### 🚀 Solution
Настраивайте сессии с `httpOnly`, `secure` флагами и храните их в Redis/БД, а не в памяти Node.js.

<br>

<div align="center">
  <b>Применяйте данные паттерны для построения максимально безопасной, быстрой и прозрачной архитектуры на Express.js! 🚂</b>
</div>
