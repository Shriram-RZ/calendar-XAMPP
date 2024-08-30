# Calendar Database Setup

## Overview

This document describes how to set up the database for a calendar application. The database will include a table named `events` to store information about calendar events.

## Prerequisites

- MySQL server installed and running.
- Access to a MySQL client (e.g., phpMyAdmin, MySQL Workbench, or command-line client).
- Installation of XAMPP.
- Start Apache Server.
- Start MySQL Server.

## Database Schema

### `events` Table

The `events` table stores details about events in the calendar. Here is the SQL statement to create the table:

```sql
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    start_time TIME NOT NULL,
    end_time TIME
);
