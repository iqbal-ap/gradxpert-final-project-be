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
### V2 - Implementation
```mermaid
---
title: H8 Connect Group
---
erDiagram
	p[Users] {
		int id PK
		int pivotImgId
		string username 
		string email "Required, Unique"
		string password "Required"
		string phoneNumber
		enum role "`admin` or `user`"
		timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
	}
	st["Service Types"] {
		int id PK
		string name
		timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
	}
    s[Services] {
        int id PK
        int serviceTypeId FK
        int pivotImgId
        string name "Required"
        text description
        real rating "Scale: 0-5"
        text address
        string phoneNumber
        timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
    }
    r[Reviews] {
        int id PK
        int serviceId FK
        int userId FK
        text description
        real rating "Scale: 0-5"
        timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
    }
    pivot["Pivot Images"] {
	    int id PK
	    int pivotId
	    int imageId
    }
    img[Images] {
	    int id PK
	    boolean is_main_img "Default: `false`"
		text description
		text url "Required"
		timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
    }
    st ||--|{ s : have 
    s ||--o{ r : have
    r }o--o{ p : from
    s ||--o{ pivot: have
    p ||--|| pivot: has
    pivot ||--o{ img : have
```
## API Docs
See [this](./docs/api-docs.yml) using OpenAPI/Swagger Preview.