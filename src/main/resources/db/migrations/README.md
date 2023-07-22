# Database SQL Migration Folder - Flyway Migration

## Introduction

This README provides an overview of the Database SQL Migration folder for Flyway migration. Flyway is an open-source database migration tool that allows you to evolve your database schema over time in a simple and controlled manner. It works by applying SQL migration scripts in a predefined order to keep the database schema up-to-date with the latest changes.

## Purpose

The Database SQL Migration folder serves as a repository for managing the evolution of the database schema in a version-controlled manner. Each SQL migration script represents a specific change or set of changes to be applied to the database schema. Flyway, when executed, automatically detects and applies these migration scripts in the correct order, ensuring that the database schema is always up-to-date with the latest version.

## Folder Structure

The typical folder structure for the Database SQL Migration folder in a Flyway project is as follows:

```
db/
|-- migration/
|   |-- V1_1__create_table.sql
|   |-- V1_2__add_columns.sql
|   |-- V2_1__modify_table.sql
```

1. The `db` folder is the main directory where the migration scripts are stored.
2. Inside the `db` folder, you will find the `migration` folder, which contains all the migration scripts.
3. Each migration script follows a specific naming convention to ensure proper ordering:
   - `V` stands for "Versioned," and it is followed by a version number.
   - The version number consists of a major version and a minor version separated by an underscore. For example, `V1_1`.
   - The version number helps Flyway to understand the order in which the migration scripts should be applied.
   - After the version number, there is a description of the migration, separated by double underscores (`__`).
   - Optionally, a script can be prefixed with `R` (for "Repeatable") if it contains code that is reapplied every time migrations are run. This is useful for things like views or stored procedures that need to be updated frequently.

## Creating New Migration Scripts

When you need to make changes to the database schema, you create new migration scripts in the `migration` folder. Here are the steps to create a new migration script:

1. Choose a meaningful and descriptive name for your migration script that indicates the changes it will apply to the database schema.
2. Use the version number convention (`VX_Y__`) to prefix the script name. Increment the major version if it's a completely new migration, and increment the minor version if it's an update to an existing migration.
3. Write the necessary SQL statements to implement the changes. Ensure that your script is idempotent, meaning it can be safely applied multiple times without causing issues.

## Applying Migrations

To apply the migrations and update the database schema, you typically use the Flyway command-line tool or integrate Flyway with your application's build process. Flyway will automatically detect the new migration scripts in the `migration` folder and apply them in the order specified by their version numbers.

Remember that once a migration script has been applied to a database, Flyway records its execution in a special table in the database. This allows Flyway to track which migrations have already been applied and avoid reapplying them in the future.

## Conclusion

The Database SQL Migration folder for Flyway migration is a powerful tool for managing database schema changes in a version-controlled and systematic way. By following the naming conventions and maintaining an organized folder structure, you can ensure that your database schema evolves smoothly over time while keeping track of changes and their execution status.
