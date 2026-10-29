# MailGuard AI Datasets

## Primary Dataset: UCI Machine Learning Repository Spam Collection
- **Source**: [UCI Machine Learning Repository - SMS Spam Collection](https://archive.ics.uci.edu/ml/datasets/SMS+Spam+Collection)
- **Direct TSV Reference**: Hosted via open research mirror (`sms_spam.tsv`)
- **Originators**: Tiago A. Almeida and José María Gómez Hidalgo
- **Total Records**: 5,574 labeled messages
- **Distribution**: 4,827 legitimate (Ham) messages (86.6%) and 747 Spam messages (13.4%)
- **Attribution & Citation**:
  Almeida, T.A., Gómez Hidalgo, J.M., Yamakami, A. Contributions to the Study of SMS Spam Filtering: New Collection and Results. Proceedings of the 2011 ACM Symposium on Document Engineering (DocEng'11), Mountain View, CA, USA, 2011.

## Threat Analysis & Email Augmentation
To adapt the corpus specifically to enterprise email analysis (including subject line metadata, enterprise phishing indicators, account reset spoofs, wire transfer fraud, and legitimate work correspondence), the dataset processor normalizes and augments the corpus with realistic corporate email headers and modern threat patterns before training.

### Schema
| Column | Type | Description |
|---|---|---|
| `label` | string | Either `ham` (legitimate) or `spam` (threat / spam) |
| `text` | string | Email content including optional subject and body |

