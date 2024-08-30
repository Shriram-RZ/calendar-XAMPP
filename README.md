# Calendar Application Setup

## Overview

This document provides instructions for setting up the Calendar Application using XAMPP and PHP. It includes steps for installing PHP, cloning the repository, and running the application.

## Prerequisites

- Windows operating system
- XAMPP installed and running (includes Apache and MySQL)
- A web browser (e.g., Chrome, Firefox)

## Installation Instructions

### 1. Install PHP

1. **Download PHP**: Go to [PHP Downloads](https://windows.php.net/downloads/releases/php-8.3.11-Win32-vs16-x64.zip) and download the PHP 8.3.11 for Windows.

2. **Extract PHP**: Extract the downloaded `php-8.3.11-Win32-vs16-x64.zip` file to a directory of your choice. For example, you can extract it to `C:\php`.

3. **Add PHP to PATH**:
   - Right-click on `This PC` or `Computer` on your desktop or in File Explorer and select `Properties`.
   - Click `Advanced system settings`, then `Environment Variables`.
   - In the `System variables` section, find and select the `Path` variable, then click `Edit`.
   - Click `New` and add the path to the PHP directory (e.g., `C:\php`).
   - Click `OK` to close all dialog boxes.

4. **Verify PHP Installation**: Open a Command Prompt and type `php -v` to verify that PHP is installed correctly and added to the PATH.

### 2. Clone the Repository

1. **Open Command Prompt**.

2. **Navigate to XAMPP's `htdocs` directory**:
    ```sh
    cd C:\xampp\htdocs
    ```

3. **Clone the Repository**:
    ```sh
    git clone https://github.com/Shriram-RZ/calendar-XAMPP.git event-calendar
    ```

4. **Navigate to the Project Directory**:
    ```sh
    cd event-calendar
    ```

### 3. Set Up the Application

1. **Ensure XAMPP is Running**: Make sure that Apache and MySQL services are running in the XAMPP Control Panel.

2. **Open the Application**:
    - Open your web browser.
    - Type `http://localhost/event-calendar/` into the address bar and press `Enter`.

## Future Enhancements

- **Improve Design**: Enhance the UI/UX of the calendar application for a more user-friendly experience.
- **Add Features**: Consider adding features such as event reminders, recurring events, or integration with other calendar services.

## Additional Resources

- [XAMPP Documentation](https://www.apachefriends.org/index.html)
- [PHP Manual](https://www.php.net/manual/en/)
- [Git Documentation](https://git-scm.com/doc)

