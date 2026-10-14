# Healthcare System

A PHP web project containing patient, doctor, and administrator interfaces, appointment workflows, messaging, and profile pages.

## Stack

PHP, HTML/CSS/JavaScript, and a database configured under `config/`. The repository also includes a web manifest and service worker.

## Explore the project

- `patient/`, `doctor/`, `admin/`: role-specific pages
- `chat/` and messaging scripts: communication workflows
- `config/`, `database/`, `sql/`: database configuration and SQL resources
- `assets/`: interface assets

## Run locally

Clone the repository into a local PHP development environment. Review `config/database.php` and the SQL resources to configure a separate development database before opening `index.php` or `login.php`.

Several scripts initialize, change, or reset database tables. Read the script before running it and use a disposable test database for reset operations. No installation or production-readiness claim is made by this documentation.

Use fictional records when evaluating the interface; this repository should not be assumed ready to handle real patient information.
