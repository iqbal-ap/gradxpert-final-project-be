# GradXpert Final Project - Backend
## DRO
[Design, Requirement, and Objectives](https://docs.google.com/document/d/1xzJGHAJWesuQl7HHqg0dNCxhKBOVAP1KVf0cT62lHho/edit#heading=h.hqo576f2l496)

## ERD
### V1
```mermaid
---
title: H8 Connect Group
---
erDiagram
	p[User] {
		int id PK
		string username "Nullable"
		string email "Not null, unique, in email format"
		string password "required"
		string phone_number
		enum role "admin or user"
	}
	st["Service Type"] {
		int id PK
		string name
	}
    s[Service] {
        int id PK
        int type_id FK
        string name
        string description
        real rating "scale: 0-5"
        string address
        string phone_number
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    r[Review] {
        int id PK
        int service_id FK
        int user_id FK
        string description
        real rating "scale: 0-5"
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    s ||--|| st: has
    s ||--o{ r : have
    r }o--o{ p : from
```
## API Docs
See [this](./docs/api-docs.yml) using OpenAPI/Swagger Preview.