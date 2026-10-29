# MailGuard AI — Email Spam Prediction & Threat Analysis Platform
## Comprehensive Engineering Project Report

---

## 1. Abstract
Electronic mail remains the principal protocol for professional, corporate, and personal digital communication. Consequently, email remains the most exploited vector for unsolicited bulk marketing, fraudulent deception, credential phishing, and malware distribution. Conventional rule-based spam filters are rigid, difficult to maintain, and fail against novel lexical variations.

**MailGuard AI** is a full-stack, enterprise-grade threat detection platform engineered to analyze email content in real time. It utilizes Natural Language Processing (NLP) with Term Frequency-Inverse Document Frequency (TF-IDF) feature engineering and a calibrated Multinomial Naive Bayes classifier. Built with a decoupled architectural paradigm—featuring a modern React + TypeScript + Tailwind CSS frontend and a high-performance Python FastAPI backend backed by an SQLite 3 relational database—MailGuard AI achieves an empirical accuracy of **98.45%**, precision of **98.26%**, and F1-score of **0.9339** on a holdout test set of 1,032 samples.

---

## 2. Introduction & Problem Statement
Spam constitutes over 45% of global email traffic. Threats range from harmless promotional advertisements to advanced spear-phishing attacks designed to compromise enterprise networks and exfiltrate credentials.

### Problem Objectives
1. Provide instant classification (`SPAM` vs. `NOT_SPAM`) with calculated posterior confidence scores.
2. Maintain an auditable history of classified messages without external cloud dependencies.
3. Deliver visual analytics highlighting threat trends, classification distribution, and empirical confusion matrices.
4. Establish clean software engineering practices separating frontend presentation, backend REST services, database persistence, and ML pipelines.

---

## 3. Technology Stack & Design Decisions

| Layer | Selected Technology | Technical Rationale |
|---|---|---|
| **Frontend Framework** | React 18 + TypeScript | Type safety, component modularity, predictable state management. |
| **Bundler & Tooling** | Vite 5 | Instant Hot Module Replacement (HMR) and optimized rollup production bundles. |
| **Styling & UI** | Tailwind CSS | Utility-first styling with custom cybersecurity dark/light tokens. |
| **Visualization** | Recharts | Declarative SVG charting for time-series trends and donut distributions. |
| **Backend Framework** | FastAPI (Python 3.13) | Asynchronous execution, native Pydantic data validation, OpenAPI specification. |
| **Machine Learning** | Scikit-Learn | Industrial-standard NLP transformers, pipeline encapsulation, and metric calculation. |
| **Relational Database**| SQLite 3 + SQLAlchemy 2.0 | Zero-configuration file-based relational storage with parameterized SQL queries. |
| **Testing** | Pytest & Vitest | Comprehensive automated unit, integration, and UI component testing. |

---

## 4. Machine Learning Methodology

### 4.1 Dataset Description
The model was trained on the benchmark **UCI SMS Spam Collection** augmented with enterprise cybersecurity email samples (account alerts, payroll notifications, lottery scams, wire transfer fraud, and legitimate corporate announcements). The combined corpus consists of 5,156 unique sanitized samples:
- **Legitimate (Ham)**: 4,523 samples (87.7%)
- **Spam / Threats**: 633 samples (12.3%)

### 4.2 Data Preprocessing & Sanitization
Raw email text underwent systematic preprocessing:
1. **HTML Entity Decoding**: Unescaping characters such as `&amp;` and `&lt;`.
2. **Entity Tokenization**: Normalizing sensitive dynamic identifiers:
   - Hyperlinks $\rightarrow$ `urltoken`
   - Email addresses $\rightarrow$ `emailtoken`
   - Monetary values $\rightarrow$ `moneytoken`
   - Long numbers $\rightarrow$ `numbertoken`
3. **Punctuation Normalization**: Retaining syntactic exclamation and question indicators while eliminating noisy characters.
4. **Lowercasing & Whitespace Stripping**: Ensuring uniform token representation.

### 4.3 Feature Representation (TF-IDF)
Raw text is transformed into numerical vectors using Term Frequency-Inverse Document Frequency:

$$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \text{IDF}(t, D)$$

Where:
- $\text{TF}(t, d) = 1 + \log(f_{t,d})$ (sublinear term frequency scaling)
- $\text{IDF}(t, D) = \log\left(\frac{1 + |D|}{1 + |\{d \in D : t \in d\}|}\right) + 1$
- N-gram range: Unigrams and Bigrams $(1, 2)$
- Maximum feature vocabulary: 6,000 terms

### 4.4 Multinomial Naive Bayes Classification
The Multinomial Naive Bayes classifier computes the posterior probability of class $c$ given feature vector $\mathbf{x} = (x_1, x_2, \dots, x_n)$:

$$P(c \mid \mathbf{x}) \propto P(c) \prod_{i=1}^{n} P(x_i \mid c)$$

To prevent zero-probability issues for unseen tokens, **Laplace smoothing** ($\alpha = 0.1$) is applied:

$$\hat{P}(x_i \mid c) = \frac{N_{ci} + \alpha}{N_c + \alpha |V|}$$

Where $N_{ci}$ is the count of term $i$ in class $c$, $N_c$ is the total count of all terms in class $c$, and $|V|$ is the vocabulary size.

---

## 5. Experimental Results & Performance

A stratified 80/20 train/test split was performed (`random_state=42`), allocating 4,124 samples for training and 1,032 samples for evaluation.

### Performance Summary Table
| Metric | Value | Interpretation |
|---|---|---|
| **Accuracy** | **98.45%** | 1,016 out of 1,032 test samples correctly classified. |
| **Precision (Spam)** | **98.26%** | Out of all predicted spam emails, 98.26% were true spam. |
| **Recall (Spam)** | **88.98%** | 88.98% of all true spam threats were successfully flagged. |
| **F1-Score (Spam)** | **0.9339** | Harmonic mean indicating strong balanced threat detection. |
| **Inference Latency** | **< 1.8 ms** | Real-time classification suitable for high-throughput mail transfer agents. |

### Evaluation Confusion Matrix (N = 1,032)
```
                  Predicted Legitimate    Predicted Spam
Actual Legitimate         903 (TN)               2 (FP)
Actual Spam                14 (FN)             113 (TP)
```
- **False Positive Rate**: $\frac{2}{903 + 2} \approx 0.22\%$ (Crucial for preventing loss of legitimate emails).

---

## 6. System Architecture & Component Design
- **Single-User Architecture**: For desktop and laboratory evaluation, the system operates as a single-user SaaS tool, avoiding pseudo-security logins while remaining architecturally ready for JWT/OAuth multi-tenant extension.
- **RESTful Endpoints**: Full CRUD operations for predictions, paginated query filters, statistical KPI aggregators, and model inspection.
- **Persistent Storage**: SQLite database file (`backend/data/mailguard.db`) initialized automatically on startup.

---

## 7. Conclusion & Future Scope
MailGuard AI demonstrates that combining lightweight probabilistic machine learning with modern web frameworks yields an effective, responsive, and maintainable cybersecurity application. Future enhancements may incorporate:
1. Deep Transformer embeddings (e.g., DistilRoBERTa) for contextual nuance.
2. Email attachment header analysis and DKIM/SPF domain verification.
3. Multi-tenant enterprise role-based access control (RBAC).
