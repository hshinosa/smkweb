# Academic Calendar System Documentation

## Overview

The Academic Calendar System for SMKN15Bandung website provides functionality to manage and display academic calendars for the school. It consists of an admin interface for managing calendar content and a public interface for viewing active calendars.

## Key Components

### Backend (PHP/Laravel)
1. **Models**:
   - `AcademicCalendarContent` - The main model for storing calendar information including title, description, image URL, academic year, and active status.
  
2. **Controllers**:
   - `Admin\AcademicCalendarController` - Provides CRUD operations for admin management of calendars
   - `AcademicCalendarPublicController` - Handles rendering the public-facing calendar page

3. **Migrations**:
   - `2025_05_28_064349_create_academic_calendar_contents_table.php` - Creates the table for storing calendar content

4. **Seeders**:
   - `AcademicCalendarContentSeeder.php` - Provides sample calendar data

### Frontend (React/Inertia.js)
1. **Admin Interface**:
   - `resources/js/Pages/Admin/AcademicCalendarContentPage.jsx` - Admin page for managing calendar content

2. **Public Interface**:
   - `resources/js/Pages/AcademicCalendarPage.jsx` - Public page for viewing academic calendars

## Features

1. **Admin Panel**:
   - Create new academic calendars with title, description, image, and academic year
   - Edit existing calendars
   - Delete calendars
   - Search and filter calendars
   
2. **Public View**:
   - View active calendar content
   - Select from different academic years (if multiple calendars exist)
   - View calendar images in a modal for better visibility

## Database Structure

### AcademicCalendarContent Table
- `id` - Primary key
- `title` - Title of the calendar
- `description` - Optional description
- `calendar_image_url` - URL to the calendar image
- `academic_year` - The academic year (e.g., "2024/2025")
- `sort_order` - Order for display
- `created_at` - Timestamp of creation
- `updated_at` - Timestamp of last update

## How It Works

1. Admins can create and manage academic calendars through the admin panel
2. The public page displays the currently active calendar by default
3. Users can view different calendar years if multiple calendars exist
4. Users can click on calendar images to view them in a larger modal

## Routes

### Admin Routes
- `GET admin/academic-calendar` - Index of all calendars (admin view)
- `POST admin/academic-calendar` - Store a new calendar
- `PUT/PATCH admin/academic-calendar/{id}` - Update a calendar
- `DELETE admin/academic-calendar/{id}` - Delete a calendar
- `PATCH admin/academic-calendar/{id}/set-active` - Set a calendar as active

### Public Routes
- `GET /kalender-akademik` - Public view of the academic calendar

## Usage Tips

1. Upload calendar images with sufficient resolution for clear viewing
2. Keep the calendar active status updated to ensure users see the most current information
3. Include descriptive titles and academic year information
4. For best display, use consistent image dimensions across all calendars

## Key Points
- No `is_active` field or logic anywhere in the system.
- Academic year is always displayed as a range (start year/end year), e.g., 2024/2025.
- Admin and public interfaces are consistent and show all entries.
- Update form uses PUT/PATCH, not POST.

## How to Use
- Add or edit entries via the admin page. Specify the start year; the system will display the year as a range.
- All entries are visible; there is no active/inactive toggle.

## Migration & Seeder
- Migration and seeder files do not include `is_active`.

## Model & Controller
- No `is_active` logic, scopes, or helpers.
- Only relevant fields are used.

## Frontend
- No `is_active` toggles or filters.
- Academic year is always shown as a range.

# End of file
