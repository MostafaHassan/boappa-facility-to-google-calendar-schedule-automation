# Boappa to Google Calendar Facility Reservation Sync

## Summary

Boappa to Google Calendar Facility Reservation Sync is an integration that automatically fetches facility reservations from Boappa and creates corresponding events in your Google Calendar. This allows you to view upcoming reservations directly in your calendar widget, set alerts and notifications, and stay informed ahead of time. As a board member, this integration helps ensure you're prepared to grant access to facilities if necessary, streamlining your responsibilities and enhancing convenience.

## Synchronization Details

- **One-way Sync:** The synchronization is one-way only, from Boappa to Google Calendar. Changes made in Google Calendar will not be reflected back in Boappa.
- **Interval:** Synchronization occurs every x hours (it is up to you).
- **Time Range:** Only bookings up to 30 days in advance are synchronized (can be adjusted as needed).
- **Calendar:** You should create a new calendar in your google calendar for the reservations, as you might otherwise lose events.
- **Calendar reminders:** The calendar will send a reminder 1 day in advance.
- **Event Cleanup:** All events within the 30-day (can be modified) period are deleted before new reservations are added. This ensures that duplicates are avoided and any canceled bookings are removed.

## Implementation
This guide will walk you through setting up the Boappa to Google Calendar Schedule Automation integration. This tool automatically creates events in Google Calendar based on whole-day facility bookings made in Boappa.

## Prerequisites

- Access to Boappa with valid credentials
- Google Calendar and Google Apps Script accounts

## Setup Instructions

### 1. Create a New Calendar in Google Calendar

1. Open [Google Calendar](https://calendar.google.com).
2. On the left sidebar, click on the **“+”** next to **“Other calendars”** and select **“Create new calendar”**.
3. Name your new calendar (e.g., "Boappa Facility Bookings").
4. Click **“Create calendar”**.
5. Once created, click on **“Settings and sharing”** for the new calendar.
6. Under **“Integrate calendar”**, find and copy the **“Calendar ID”**. You will need this for the integration.

### 2. Create a Project in Google Apps Script

1. Go to [Google Apps Script](https://script.google.com) and sign in with your Google account.
2. Click on **“New project”** to create a new script project.
3. Name your project (e.g., "Boappa to Google Calendar Integration").

### 3. Add Script Properties

1. In your Google Apps Script project, click on **“Project Settings”** (gear icon).
2. Select **“Script Properties”**.
3. Add the following script properties:

    - **boappa_username**: Your Boappa email address.
    - **boappa_password**: Your Boappa password.
    - **calendar_id**: The Calendar ID you retrieved from Google Calendar.

   For each property:
   - Click **“Add Row”**.
   - Enter the property name and value.
   - Click **“Save”**.
  
### 4. Add Script

1. Copy the script (kod.js) into edit mode for your new Google Apps Script project.
2. Paste the script code into the editor.

### 5. Schedule the Script

To ensure that the script runs automatically, follow these steps:

1. In your Google Apps Script project, click on the clock icon **(Triggers)** in the left sidebar.
2. Click on **“Add Trigger”** in the bottom-right corner.
3. Set the following options:
    - **Choose which function to run**: Select the function from your script that handles the scheduling.
    - **Choose which deployment should run**: Select the default deployment.
    - **Select event source**: Choose **“Time-driven”**.
    - **Select type of time based trigger**: Choose the appropriate time interval (e.g., daily, hourly) based on how frequently you want to check for new bookings.
4. Click **“Save”** to set up the trigger.

With this setup, your script will now run automatically according to the schedule you specified, creating events in your Google Calendar based on your Boappa bookings.
