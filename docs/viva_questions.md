# MailGuard AI — Comprehensive Viva Voce Questions & Answers
### Curated Guide with 28 High-Frequency Examination Questions

---

### Category 1: Machine Learning & NLP Concepts

#### Q1: What machine learning algorithm is used in MailGuard AI, and why was it chosen?
**Answer:**
MailGuard AI uses the **Multinomial Naive Bayes** classifier paired with a **TF-IDF Vectorizer**.
*Why it was chosen:*
1. **High dimensional text efficiency:** Text vectorization creates thousands of sparse features. Naive Bayes handles sparse feature spaces efficiently.
2. **Computational speed:** Training and inference run in linear time $\mathcal{O}(N \cdot D)$, delivering sub-2ms response times without GPU hardware.
3. **High Precision:** Naive Bayes produces remarkably low False Positive rates, which is critical in email security to prevent legitimate messages from being dropped.

---

#### Q2: State Bayes' Theorem and explain how it applies to text classification.
**Answer:**
Bayes' Theorem states:
$$P(C \mid \mathbf{X}) = \frac{P(\mathbf{X} \mid C) \cdot P(C)}{P(\mathbf{X})}$$
Where:
- $P(C \mid \mathbf{X})$ is the **Posterior probability** that an email is class $C$ (Spam or Not Spam) given words $\mathbf{X}$.
- $P(C)$ is the **Prior probability** of the class in the dataset.
- $P(\mathbf{X} \mid C)$ is the **Likelihood** of the word combination occurring in class $C$.
- $P(\mathbf{X})$ is the **Marginal probability** of the evidence (a constant normalizer across classes).

The class with the highest posterior probability $\arg\max_C P(C \mid \mathbf{X})$ is selected as the prediction.

---

#### Q3: Why is the algorithm termed "Naive"?
**Answer:**
It is termed "naive" because it makes the strong assumption of **class-conditional feature independence**—that the presence or absence of a particular word in an email is completely independent of the presence of any other word given the class label:
$$P(x_1, x_2, \dots, x_n \mid C) = \prod_{i=1}^n P(x_i \mid C)$$
In natural language, words are correlated (e.g., "bank" and "transfer"), yet Naive Bayes performs surprisingly well in practice because classification ranking depends primarily on probability order rather than exact probability calibration.

---

#### Q4: What is Laplace Smoothing, and why is it essential?
**Answer:**
If an email contains a word that never appeared in the training set for a particular class, the empirical likelihood estimate would be zero:
$$P(w \mid C) = 0$$
Because probabilities are multiplied together, a single zero probability forces the entire product to zero, regardless of other strong words.
**Laplace smoothing (additive smoothing)** adds a positive constant $\alpha$ (in MailGuard AI, $\alpha = 0.1$) to the numerator and $\alpha |V|$ to the denominator:
$$\hat{P}(w \mid C) = \frac{count(w, C) + \alpha}{\sum_{w'} count(w', C) + \alpha |V|}$$
This ensures unseen tokens receive small, non-zero probabilities.

---

#### Q5: What is TF-IDF and how does it improve upon simple Bag-of-Words (CountVectorizer)?
**Answer:**
Simple Bag-of-Words merely counts word frequencies. Common English words (e.g., "the", "and", "is") dominate frequencies without providing discriminative value.
**TF-IDF** balances local frequency with global rarity:
1. **Term Frequency (TF):** Measures how frequently term $t$ appears within document $d$. MailGuard AI uses sublinear scaling ($1 + \log(\text{TF})$) to prevent high-frequency repeated words from exerting disproportionate influence.
2. **Inverse Document Frequency (IDF):** Penalizes terms that appear across many documents:
   $$\text{IDF}(t) = \log\left(\frac{1 + N}{1 + \text{df}(t)}\right) + 1$$
Discriminative words like "lottery", "unauthorized", or "invoice" receive high TF-IDF weights, whereas generic terms receive low weights.

---

#### Q6: Why did you use N-grams (1, 2) instead of only single words (unigrams)?
**Answer:**
Single words lose context and negation. For example:
- "Not bad" vs. "Bad"
- "Credit card" vs. "Credit" and "Card" separately
Using bigrams alongside unigrams captures two-word phrases that frequently signal spam patterns (e.g., "wire transfer", "verify account", "claim prize") without exploding feature dimensionality.

---

#### Q7: What is the difference between Precision and Recall in email spam filtering? Which is more critical?
**Answer:**
- **Precision:** Out of all emails the model classified as SPAM, what percentage were actually spam?
  $$\text{Precision} = \frac{\text{TP}}{\text{TP} + \text{FP}}$$
- **Recall:** Out of all actual spam emails in existence, what percentage did the model catch?
  $$\text{Recall} = \frac{\text{TP}}{\text{TP} + \text{FN}}$$
**In email filtering, Precision is generally more critical.** A False Positive (legitimate email sent to spam) can result in a missed job offer, critical client invoice, or medical emergency. High precision ensures that when MailGuard AI flags an email as SPAM (98.26% precision), users can trust that verdict.

---

#### Q8: Explain the Confusion Matrix of your trained model.
**Answer:**
Evaluated on 1,032 unseen holdout test samples:
- **True Negatives (TN) = 903:** Legitimate emails correctly identified as legitimate.
- **False Positives (FP) = 2:** Legitimate emails incorrectly flagged as spam (error rate: 0.22%).
- **False Negatives (FN) = 14:** Spam emails that evaded detection.
- **True Positives (TP) = 113:** Spam threats accurately intercepted.
Total accuracy: $\frac{903 + 113}{1032} = 98.45\%$.

---

#### Q9: What is Stratified Train-Test Splitting and why did you use it?
**Answer:**
The dataset has an imbalanced class distribution (~87.7% legitimate and ~12.3% spam). Random splitting could result in a test set with an uneven proportion of spam samples. Stratified splitting guarantees that both the training set (80%) and test set (20%) preserve the exact 87.7% / 12.3% ratio, ensuring fair and representative evaluation.

---

#### Q10: Why is the model pipeline serialized with joblib instead of pickle?
**Answer:**
`joblib` is optimized specifically for Python objects containing large NumPy arrays and Scikit-learn pipelines. It performs efficient disk serialization without redundant memory copies, yielding smaller artifact size (`422 KB`) and faster cold-start deserialization during FastAPI startup.

---

### Category 2: Backend Architecture & FastAPI

#### Q11: Why did you choose FastAPI over Flask or Django?
**Answer:**
1. **Asynchronous Architecture:** Built on ASGI (`Starlette` and `Uvicorn`), FastAPI natively handles asynchronous request concurrency.
2. **Automatic Data Validation:** Through Pydantic schemas, payload validation and type coercion are handled automatically with clean HTTP 422 error responses.
3. **Auto-Generated Documentation:** FastAPI inspects route decorators and Pydantic types to automatically generate interactive Swagger UI (`/docs`) and ReDoc (`/redoc`) without third-party plugins.
4. **Execution Speed:** Benchmarks place FastAPI among the fastest Python web frameworks, comparable to NodeJS and Go.

---

#### Q12: How is the ML model loaded in FastAPI? Does it reload for every request?
**Answer:**
No, reloading the model from disk on every HTTP request would create severe I/O bottlenecks. In MailGuard AI:
1. The model is loaded once as an in-memory singleton via `get_model()` during application startup or the first request.
2. Subsequent requests reuse the pre-warmed in-memory `Pipeline` object, executing predictions in milliseconds.

---

#### Q13: What is Dependency Injection in FastAPI and how is it used here?
**Answer:**
Dependency Injection provides modular components to route handlers when requested. In MailGuard AI, the database session dependency:
```python
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```
is injected into routes via `db: Session = Depends(get_db)`. This guarantees that each request receives an isolated database session that is safely closed even if an unhandled exception occurs.

---

#### Q14: How does Pydantic v2 contribute to system integrity?
**Answer:**
Pydantic validates incoming JSON payloads at runtime before any business logic executes. If an incoming POST payload has an empty body, exceeds maximum length, or contains invalid types, Pydantic immediately returns an explicit HTTP 422 error, protecting the ML pipeline from invalid input data.

---

#### Q15: What is CORS and how is it handled in your API?
**Answer:**
**CORS (Cross-Origin Resource Sharing)** is a browser security mechanism that restricts web applications running at one origin from requesting resources from a different origin. Because the Vite frontend runs at `http://localhost:5173` and the backend at `http://127.0.0.1:8000`, the backend includes `CORSMiddleware` configured with explicit allowed origins, rejecting unauthorized cross-site requests.

---

### Category 3: Database & Persistence

#### Q16: Why was SQLite selected instead of PostgreSQL or MySQL?
**Answer:**
1. **Zero-Configuration & Portability:** SQLite requires no separate server daemon, external network ports, or credentials; the entire database resides in a single local file (`backend/data/mailguard.db`).
2. **Reproducibility:** Anyone cloning the repository can run the application instantly without setting up a database server.
3. **Performance:** For read-heavy desktop workloads, SQLite reads directly from OS file caches, executing queries faster than networked client-server engines.
4. **Clean Abstraction:** Because SQLAlchemy ORM is used, migrating to PostgreSQL in the future requires merely changing the `DATABASE_URL` connection string.

---

#### Q17: What does `check_same_thread=False` mean in SQLite connection settings?
**Answer:**
By default, the Python SQLite driver prevents sharing connections across multiple OS threads to avert state corruption. However, FastAPI handles requests using a multi-threaded asynchronous worker pool. Setting `check_same_thread=False` permits SQLAlchemy's scoped session maker to manage thread isolation safely across requests.

---

#### Q18: What tables exist in your database and how do they relate?
**Answer:**
1. `predictions`: Stores individual email analysis results, classification verdicts, confidence levels, and timestamps.
2. `model_metadata`: Stores metadata, versioning information, and empirical evaluation metrics for active machine learning models.
3. `activity_logs`: Logs operational events such as database initialization, model training, and history deletion.

---

#### Q19: Are KPI statistics hardcoded or dynamically computed?
**Answer:**
All KPI metrics (total emails, spam count, legitimate count, spam percentage, daily trends, and distribution) are **dynamically aggregated via SQLAlchemy SQL queries** from the active `predictions` table. When history is cleared or an email is analyzed, the dashboard metrics update in real time.

---

### Category 4: Frontend & UI Engineering

#### Q20: Why choose React with TypeScript over plain JavaScript?
**Answer:**
TypeScript provides compile-time static type verification. Interfaces like `PredictionItem` and `AnalyticsOverviewResponse` ensure strict data contracts between the API responses and React components, eliminating runtime `undefined` property errors and enabling dependable refactoring.

#### Q21: What is Vite and why is it preferred over Create React App (CRA)?
**Answer:**
Create React App relied on Webpack, which bundles the entire codebase before launching the development server. **Vite** leverages native browser ES Modules (ESM) and an `esbuild` pre-bundler written in Go, delivering millisecond server startup and instantaneous Hot Module Replacement regardless of application scale.

---

#### Q22: How is Dark and Light theme switching implemented?
**Answer:**
MailGuard AI implements theme switching through a dedicated `ThemeContext` React provider:
1. The active theme (`dark` or `light`) is saved in browser `localStorage`.
2. When toggled, the root HTML document element updates with the `.dark` class.
3. Tailwind CSS utilities (`dark:bg-[#0B1020]`, `not-dark:bg-[#F3F5FA]`) adapt colors smoothly across all views.

---

#### Q23: How do you prevent unnecessary re-renders in React?
**Answer:**
1. Proper state colocation: UI state (such as input form values) is isolated within the `EmailInput` component rather than lifting it to the global page container.
2. Pure functional components with explicit dependency arrays in `useEffect`.
3. Standard SVG rendering through Recharts with responsive container sizing.

---

### Category 5: Quality Assurance, Security & Best Practices

#### Q24: What test suites are implemented in the project?
**Answer:**
1. **Backend Tests (Pytest):** 7 automated test suites testing `/api/health`, `/api/predictions` POST and GET, validation edge cases, history pagination, individual and bulk deletion, analytics calculations, and model metadata inspection.
2. **Frontend Tests (Vitest + Testing Library):** Tests verifying landing page rendering, hero section components, and benchmark metric cards.

---

#### Q25: Why doesn't the project have a dummy login page?
**Answer:**
Implementing a fake frontend login without genuine password hashing (e.g. bcrypt), secure HTTP-only session cookies, or JWT token verification creates a misleading illusion of security. The project is transparently designed as a single-user threat auditing platform, with modular service boundaries ready for enterprise OAuth/JWT integration if deployed as a multi-user service.

---

#### Q26: What are adversarial attacks on NLP spam filters and how can they be mitigated?
**Answer:**
Adversarial attacks involve intentionally modifying spam messages to evade detection (e.g., character substitution like `v1agra`, adding hidden white-font legitimate words, or embedding images).
*Mitigation in MailGuard AI:*
1. Robust regex sanitization tokenizing URLs, emails, and currency expressions.
2. Sublinear TF-IDF weighting preventing word-stuffing exploits.
3. Laplace smoothing preventing single unseen character tricks from nullifying threat scores.

---

#### Q27: How can this system be packaged for production deployment?
**Answer:**
1. **Docker Containerization:** A multi-stage `Dockerfile` building the React static files with Node.js and serving them alongside FastAPI via `uvicorn` or Nginx reverse proxy.
2. **CI/CD Pipeline:** Running Pytest and Vitest checks on Git push to guarantee code health.
3. **Database Migration:** Swapping SQLite for managed PostgreSQL by updating the `DATABASE_URL` environment variable.

---

#### Q28: What is your primary contribution in this project?
**Answer:**
Engineered a comprehensive, end-to-end full-stack cybersecurity application that bridges theoretical probabilistic machine learning with responsive, enterprise-grade software design. Replaced simple command-line scripts with an interactive dashboard, reliable database persistence, transparent model metric auditing, and intuitive email inspection tools.
